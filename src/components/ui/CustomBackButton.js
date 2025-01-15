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


import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack, navigate} from '@navigation/NavigationService';
import {RMS} from '@utils/responsive';

const CustomBackButton = ({path, style}) => {

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        path ? navigate(path) : goBack();
      }}>
      <Icon name="arrow-back" color="black" size={RFValue(26)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: RMS(2),
    marginBottom: RMS(5),
  },
});
export default CustomBackButton;
