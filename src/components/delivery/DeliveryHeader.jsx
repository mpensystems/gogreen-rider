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

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CustomSwitch from '@components/ui/CustomSwitch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {RMS, RS, RV} from '@utils/responsive';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';
import {useDispatch} from 'react-redux';
import {openBottomSheet} from 'redux/slices/bottomSheetSlice';
import {t} from 'i18next';

const DeliveryHeader = ({}) => {
  const [iscallModalVisible, setIsCallModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleCall = () => {
    setIsCallModalVisible(true);
  };

  const handleConfirmCall = () => {
    setIsCallModalVisible(false);
  };

  const handleCancelCall = () => {
    setIsCallModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <CustomSwitch />
      </View>
      <ConfirmationModal
        visible={iscallModalVisible}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
        message={t('ARE_YOU_SURE_YOU_WANT_TO_CALL_CUSTOMER')}
      />

      <View style={styles.supportSection}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => dispatch(openBottomSheet())}>
          <Icon name="alarm-light-outline" color="#CD5C5C" size={RFValue(18)} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={handleCall}>
          <Icon name="headset" color="black" size={RFValue(18)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RMS(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  switchContainer: {
    borderRadius: RMS(50),
    height: RV(30),
    width: RMS(100),
    overflow: 'hidden',
  },
  iconContainer: {
    borderRadius: RMS(50),
    height: RV(30),
    width: RS(30),
    backgroundColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportSection: {
    flexDirection: 'row',
    gap: RMS(15),
  },
});

export default DeliveryHeader;
