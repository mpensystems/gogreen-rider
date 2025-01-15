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

import {Colors, Fonts} from '@utils/Constants';
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomText from './CustomText';
import {RMS} from '@utils/responsive';
import {navigate} from '@navigation/NavigationService';
import {useTranslation} from 'react-i18next';

const CustomBanner = ({
  message,
  textColor = Colors.text,
  title,
  backgroundColor = '#D4EDDA',
  buttonText,
  buttonColor = '#00693E',
  isbuttonVisible,
  titleColor,
}) => {
  const {t} = useTranslation();

  const onButtonPress = () => {
    navigate('OnboardingStack', {screen: 'OnboardingDetails'});
  };
  return (
    <TouchableWithoutFeedback onPress={() => console.log('Banner pressed')}>
      <View style={[styles.banner, {backgroundColor}]}>
        <View style={styles.textContainer}>
          {title && (
            <CustomText
              style={{color: titleColor}}
              variant="h3"
              fontFamily={Fonts.light}>
              {title}
            </CustomText>
          )}

          {message && (
            <>
              <CustomText
                style={{color: 'black'}}
                variant="h2"
                fontFamily={Fonts.semiBold}>
                Issue :
              </CustomText>
              <CustomText
                style={{color: textColor, textAlign: 'left'}}
                variant="h3"
                fontFamily={Fonts.light}>
                {message}
              </CustomText>
            </>
          )}
        </View>

        {isbuttonVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: buttonColor}]}
              onPress={onButtonPress}>
              <CustomText
                style={{color: 'white'}}
                variant="h5"
                fontFamily={Fonts.light}>
                {t(buttonText)}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: RMS(20),
    borderRadius: RMS(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: RMS(10),
  },
  buttonContainer: {
    margin: RMS(10),
    width: '50%',
  },

  button: {
    paddingVertical: RMS(10),
    paddingHorizontal: RMS(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RMS(9),
  },
  textContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    gap: RMS(10),
  },
});

export default CustomBanner;
