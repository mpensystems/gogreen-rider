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
import {Modal, View, StyleSheet, Linking} from 'react-native';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import {RMS} from '@utils/responsive';
import CustomButton from './CustomButton';

const PermissionModal = ({visible, title, message}) => {
  const goToSettings = () => {
    Linking.openSettings();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomText variant="h5" fontFamily={Fonts.light}>
            {title}
          </CustomText>
          <CustomText variant="h4" fontFamily={Fonts.semiBold}>
            {message}
          </CustomText>

          <CustomButton title="Go to settings" onPress={goToSettings} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: RMS(20),
    backgroundColor: 'white',
    borderRadius: RMS(10),
    alignItems: 'center',
    gap: RMS(10),
  },
});

export default PermissionModal;
