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
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import CustomButton from './CustomButton';
import {RMS} from '@utils/responsive';


const BottomModalInfo = ({title, modalVisible, onClose}) => {
  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <CustomText variant="h2" fontFamily={Fonts.light}>
                x
              </CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <CustomText variant="h1" fontFamily={Fonts.semiBold}>
              {title}
            </CustomText>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={onClose} title="Okay" />
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
    height: '40%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: RMS(20),
    borderTopRightRadius: RMS(20),
    padding: RMS(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: RMS(10),
  },
  modalContent: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingTop: RMS(100),
  },
});

export default BottomModalInfo;
