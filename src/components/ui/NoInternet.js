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
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import CustomBackButton from './CustomBackButton';
import {RMS} from '@utils/responsive';

const NoInternetError = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomBackButton />
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.errorContainer}>
          <Icon name="wifi-off" size={40} color="black" />
          <CustomText
            variant="h5"
            style={styles.title}
            fontFamily={Fonts.light}>
            No Internet Connection
          </CustomText>
          <CustomText
            variant="h6"
            style={styles.message}
            fontFamily={Fonts.light}>
            Please check your network settings and try again.
          </CustomText>
          <TouchableOpacity style={styles.retryButton}>
            <CustomText
              style={styles.retryButtonText}
              fontFamily={Fonts.semiBold}>
              Retry
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf3f8',
  },
  innerContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    color: 'black',
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: 'grey',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#73b1e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  onlineMessage: {
    fontSize: 18,
    color: 'green',
  },
  buttonContainer: {
    padding: RMS(20),
  },
});

export default NoInternetError;
