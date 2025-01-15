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
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Linking,
  Image,
  NativeModules,
  Platform,
} from 'react-native';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import CustomButton from './CustomButton';
import map from '../../assets/images/map.png';
import {RMS} from '@utils/responsive';

const {GpsModule} = NativeModules;

const BottomModal = ({modalVisible}) => {
  const openGpsSettings = () => {
    if (Platform.OS === 'android') {
      GpsModule.openGpsSettings();
    } else {
      Linking.openURL('app-settings:').catch(err =>
        console.error('Failed to open settings:', err),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={map}
              style={{width: 200, height: 200}}
              resizeMode="contain"
            />
            <CustomText variant="h4" fontFamily={Fonts.bold}>
              Location Permission is off.
            </CustomText>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              Please allow location permission.
            </CustomText>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={() => openGpsSettings()}
                title="Continue"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '50%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: RMS(20),
    borderTopRightRadius: RMS(20),
    padding: RMS(20),
  },
  modalContent: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingTop: RMS(50),
  },
});

export default BottomModal;
