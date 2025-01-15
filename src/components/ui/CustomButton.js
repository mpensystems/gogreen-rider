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

import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import CustomText from './CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {RV, RMS} from '@utils/responsive';
const CustomButton = ({
  onPress,
  title,
  disabled = false,
  loading = false,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.btn,
        {
          backgroundColor: disabled
            ? Colors.disabled
            : backgroundColor || Colors.secondary,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{disabled: disabled || loading}}>
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <CustomText
          variant="h6"
          style={styles.text}
          fontFamily={Fonts.semiBold}>
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RMS(10),
    padding: RV(15),
    // marginVertical: RV(15),
    width: '100%',
  },
  text: {
    color: '#fff',
  },
});

export default CustomButton;
