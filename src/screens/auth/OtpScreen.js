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
import React, {useEffect, useState} from 'react';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '../../utils/Constants';
import CustomButton from '@components/ui/CustomButton';
import {RFValue} from 'react-native-responsive-fontsize';
import {resetAndNavigate} from '@navigation/NavigationService';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import {RMS, RS, RV} from '@utils/responsive';
import OtpInput from '@components/auth/OtpInput';
import {useDispatch} from 'react-redux';
import {RiderResendOtp, RiderValidateOtp} from 'redux/actions/riderAction';
import {useRoute} from '@react-navigation/native';
import {handleError} from '@utils/errorHadler';
import {useTranslation} from 'react-i18next';

const OtpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const route = useRoute();
  const {mobile, token: initialToken} = route.params;
  const {t} = useTranslation();
  const [token, setToken] = useState(initialToken);

  const handleOtpVerification = async () => {
    Keyboard.dismiss();
    setErrorMessage('');
    setLoading(true);

    try {
      const data = {
        token: token,
        otp: otp,
      };

      const res = await dispatch(RiderValidateOtp(data));
      console.log(res?.status, 'STATUS');

      if (res?.status == 200) {
        resetAndNavigate('Main');
      } else {
        handleError(res, setErrorMessage, t);
      }
    } catch (error) {
      handleError(error, setErrorMessage, t);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = {
        country_code: '+91',
        mobile: mobile,
      };

      const res = await dispatch(RiderResendOtp(data));
      console.log(res, 'RIDER_LOGIN');
      setCountdown(40);

      if (res?.status === 200) {
        const token = res?.data?.token;
        setToken(token);
        console.log(token, 'TOKEN');
      } else {
        handleError(res);
      }
    } catch (error) {
      handleError(error);
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
              {t('ENTER_OTP')}
            </CustomText>
            <CustomText variant="h7" style={styles.text}>
              {t('OTP_SENT_TO')} {mobile}
            </CustomText>
            <OtpInput onOtpFilled={setOtp} />

            {errorMessage ? (
              <CustomText
                variant="h7"
                fontFamily="semiBold"
                style={[styles.text, styles.errorText]}>
                {errorMessage}
              </CustomText>
            ) : null}

            {/* Resend OTP Section */}
            <View style={styles.resendContainer}>
              {countdown > 0 ? (
                <CustomText>{`${t('DIDNT_GET_OTP')} ${countdown}s`}</CustomText>
              ) : (
                <CustomText
                  variant="h7"
                  fontFamily={Fonts.medium}
                  onPress={handleResendOtp}
                  style={styles.resendText}>
                  {t('RESEND_OTP')}
                </CustomText>
              )}
            </View>
          </View>
        </CustomSafeAreaView>
        <View style={styles.footer}>
          <CustomButton
            disabled={!otp || loading}
            onPress={handleOtpVerification}
            loading={loading}
            title={t('VERIFY_OTP')}
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
    marginLeft: RMS(10),
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
  otpContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: RMS(100),
  },
  inputView: {
    width: RS(40),
    height: RV(40),
    borderWidth: RMS(0.5),
    borderRadius: RMS(10),
  },
  resendText: {
    color: 'green',
  },
});
export default OtpScreen;
