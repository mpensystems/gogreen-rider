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

import {View, StyleSheet, Image, SafeAreaView, Keyboard} from 'react-native';
import React, {useState} from 'react';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '../../utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import {RFValue} from 'react-native-responsive-fontsize';
import {resetAndNavigate} from '@navigation/NavigationService';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import {RMS, RS, RV} from '@utils/responsive';
import Flag from '../../assets/icons/Flag.png';
import {useDispatch} from 'react-redux';
import {RiderInitiateLogin} from 'redux/actions/riderAction';
import {handleError} from '@utils/errorHadler';
import {useTranslation} from 'react-i18next';

const RiderLogin = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const handleAuth = async () => {
    Keyboard.dismiss();
    setErrorMessage('');
    setLoading(true);
    try {
      const data = {
        country_code: '+91',
        mobile: mobile,
      };

      const res = await dispatch(RiderInitiateLogin(data));
      console.log(res, 'RIDER_LOGIN');

      if (res?.status === 200) {
        const token = res?.data?.token;
        console.log(token, 'TOKEN');

        resetAndNavigate('OtpScreen', {mobile, token});
      } else {
        handleError(res, setErrorMessage, t);
      }
    } catch (error) {
      handleError(error, setErrorMessage, t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          <View style={styles.centeredContent}>
            <Image
              source={require('@assets/images/GOGREEN.png')}
              style={styles.logo}
            />
            <CustomText variant="h2" fontFamily={Fonts.semiBold}>
              {t('SIGNIN_TO_YOUR_ACCOUNT')}
            </CustomText>
            <CustomText
              variant="h5"
              fontFamily={Fonts.light}
              style={styles.text}>
              {t('LOGIN_OR_CREATE_AN_ACCOUNT')}
            </CustomText>
            <CustomInput
              style={{fontFamily: Fonts.bold}}
              onChangeText={text => {
                setMobile(text.slice(0, 10));
              }}
              onClear={() => setMobile('')}
              maxLength={10}
              value={mobile}
              left={
                <>
                  <Image source={Flag} style={styles.flagImage} />
                  <CustomText
                    style={styles.phoneText}
                    variant="h5"
                    fontFamily={Fonts.bold}>
                    +91
                  </CustomText>
                </>
              }
              placeholder={t('ENTER_MOBILE_NUMBER')}
              inputMode="numeric"
            />
            {errorMessage ? (
              <CustomText
                variant="h7"
                fontFamily="semiBold"
                style={[styles.text, styles.errorText]}>
                {errorMessage}
              </CustomText>
            ) : null}
            <CustomText
              variant="h7"
              fontFamily={Fonts.semiBold}
              style={[styles.text, styles.validationText]}>
              {t('ENTER_A_VALID_10_DIGIT_MOBILE_NUMBER')}
            </CustomText>
          </View>
        </CustomSafeAreaView>
        <View style={styles.footer}>
          <CustomButton
            disabled={mobile?.length !== 10}
            onPress={() => handleAuth()}
            loading={loading}
            title={t('Continue')}
          />
          <SafeAreaView>
            <CustomText fontFamily={Fonts.light} fontSize={RFValue(6)}>
              By Continuing, you agree to our Terms of Service & Privacy Policy
            </CustomText>
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: RMS(2),
    marginBottom: RMS(25),
    opacity: 0.6,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: RMS(20),
  },
  validationText: {
    alignSelf: 'flex-start',
    marginLeft: RMS(20),
  },
  phoneText: {
    marginLeft: RMS(5),
  },
  logo: {
    height: RV(50),
    width: RS(50),
    borderRadius: RMS(50),
    marginVertical: RV(10),
  },
  centeredContent: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: RMS(20),
    paddingTop: RMS(20),
  },
  footer: {
    paddingBottom: RMS(10),
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RMS(10),
    backgroundColor: 'white',
    width: '100%',
  },
  gradient: {
    paddingTop: RMS(60),
    width: '100%',
  },
  flagImage: {
    height: RV(20),
    width: RS(20),
  },
});

export default RiderLogin;
