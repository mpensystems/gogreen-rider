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
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import {RMS, RS, RV} from '@utils/responsive';
import {RFValue} from 'react-native-responsive-fontsize';

const ConfirmationModal = ({visible, onConfirm, onCancel, message}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomText variant="h4" fontFamily={Fonts.light}>
            {message}
          </CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    gap: RMS(30),
    height: RV(150),
    width: RS(300),
    padding: RMS(20),
    backgroundColor: 'white',
    borderRadius: RMS(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: RMS(10),
    borderRadius: RMS(5),
    width: '45%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: RMS(10),
    borderRadius: RMS(5),
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: RFValue(12),
  },
});

export default ConfirmationModal;
