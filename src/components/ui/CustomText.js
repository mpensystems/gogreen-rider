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
import {StyleSheet, Text} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import {RMS} from '@utils/responsive';
const CustomText = ({
  variant = 'body',
  fontFamily = Fonts.regular,
  fontSize,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  const fontSizeMapping = {
    h0: 35,
    h1: 22,
    h2: 20,
    h3: 18,
    h4: 16,
    h5: 14,
    h6: 12,
    h7: 12,
    h8: 10,
    h9: 9,
    body: 12,
  };

  const computedFontSize = RMS(fontSize || fontSizeMapping[variant]);

  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        {color: Colors.text, fontSize: computedFontSize, fontFamily},
        style,
      ]}
      numberOfLines={numberOfLines}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default CustomText;
