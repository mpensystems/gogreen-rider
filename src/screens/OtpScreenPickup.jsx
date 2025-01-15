/*
 *Copyright 2025 MP ENSYSTEMS ADVISORY PRIVATE LIMITED.
 *
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing, software
 *distributed under the License is distributed on an "AS IS" BASIS,
 *WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *See the License for the specific language governing permissions and
 *limitations under the License.
 */

import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {RMS, RS, RV} from '@utils/responsive';
import OtpInputpasscode from '@components/delivery/OtpInputpasscode';
import {navigate, push} from '@navigation/NavigationService';
import {useLocation} from 'context/LocationContext';
import {setStatus} from '@service/api';
import {useDispatch, useSelector} from 'react-redux';
import {selectToken} from 'redux/slices/riderSlice';
import {
  selectTrip,
  setTripStatus,
  setTripSubstatus,
} from 'redux/slices/tripSlice';
import CustomBackButton from '@components/ui/CustomBackButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import Loader from '@components/ui/Loader';

const OtpScreenPickup = () => {
  const [otpFilled, setOtpFilled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const {location} = useLocation();
  const token = useSelector(selectToken);
  const tripData = useSelector(selectTrip);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleOtpComplete = otp => {
    if (otp.length === 6) {
      setOtpFilled(otp);
      handleSetStatus(otp);
    }
  };

  const handleSetStatus = async otp => {
    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };
    const data = {
      status: 'way-to-drop',
      substatus: 'routing',
      tid: tripData?.tid,
      token: token,
      currentLoc,
      otp: otp,
    };
    console.log(data, 'SET_STATUS_RESPONSE_DROP_VERIFY');

    try {
      setLoading(true);
      const response = await setStatus(data);

      if (response?.status === 200) {
        const tripStatus = response?.data;
        dispatch(setTripStatus(tripStatus?.status));
        dispatch(setTripSubstatus(tripStatus?.substatus));
        setIsVerified(true);
        setLoading(false);
        push('DeliveredOrder');
      } else {
        setLoading(false);
        setIsModalVisible(true);

        if (response === 'ER223') {
          // setModalTitle(t('SOMETHING_WENT_WRONG'));
          setModalTitle('OTP is Incorrect');
        }
        console.error(
          'Failed to VERIFY_PICKUP_OTP:',
          response?.status,
          response?.data,
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in VERIFY_PICKUP_OTP:', error.message);
      setIsModalVisible(true);
      setModalTitle(t('SOMETHING_WENT_WRONG'));
    }
  };

  const splitText = text => {
    const lastFourDigits = text.slice(-4);
    const restOfText = text.slice(0, -4);
    return {restOfText, lastFourDigits};
  };

  const {restOfText, lastFourDigits} = splitText('123xxxxxxxx453');

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.buttonContainer}>
            <CustomBackButton path="PickOrder" />
          </View>
          <View>
            <CustomText
              variant="h4"
              style={{color: 'black'}}
              fontFamily={Fonts.light}>
              {t('ENTER_PASSCODE_FOR')}
            </CustomText>
            <CustomText variant="h0" fontFamily={Fonts.extraLight}>
              {restOfText}
              <CustomText
                variant="h0"
                fontFamily={Fonts.light}
                style={{color: '#ffffff', backgroundColor: 'green'}}>
                {lastFourDigits}
              </CustomText>
            </CustomText>
          </View>
        </View>
        {isVerified && (
          <View style={styles.verificationContainer}>
            <CustomText
              variant="h4"
              fontFamily={Fonts.light}
              style={{color: 'white'}}>
              {t('ORDER_VERIFICATION_SUCCESSFULL')}
            </CustomText>
          </View>
        )}
        <View style={styles.otpSection}>
          <View style={styles.otpScreen}>
            <OtpInputpasscode onOtpFilled={handleOtpComplete} />
          </View>
          {isVerified && (
            <View style={styles.verifyContainer}>
              <Icon name="checkmark-circle" size={RS(150)} color="green" />
            </View>
          )}
        </View>
        <BottomModalInfo
          title={modalTitle}
          modalVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </ScrollView>
      {loading && (
        <View style={styles.loaderOverlay}>
          <Loader loading={loading} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: RMS(10),
    height: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: RMS(20),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  otpSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: RMS(50),
  },
  verificationContainer: {
    height: RV(40),
    backgroundColor: 'green',
    marginBottom: RMS(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingRight: RMS(20),
  },
  verifyContainer: {
    marginTop: RMS(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OtpScreenPickup;
