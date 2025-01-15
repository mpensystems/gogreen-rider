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

import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import {
  goBack,
  navigate,
  resetAndNavigate,
} from '@navigation/NavigationService';
import {RMS, RS, RV} from '@utils/responsive';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';
import {useDispatch} from 'react-redux';
import {openBottomSheet} from 'redux/slices/bottomSheetSlice';
import Iconm from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMinimizeScreen} from 'context/TripScreenContext';

const LiveHeader = ({title, isDisabled, helpData, hideAlert, hideHelp}) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleConfirmCall = () => {
    setIsCallModalOpen(false);
  };

  const handleCancelCall = () => {
    setIsCallModalOpen(false);
  };

  const handleCall = () => {
    setIsCallModalOpen(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          isDisabled && {
            paddingHorizontal: RMS(60),
            justifyContent: 'space-between',
          },
        ]}>
        {!isDisabled && (
          <TouchableOpacity
            style={styles.backButton}
            disabled={isDisabled}
            onPress={goBack}>
            <Icon name="chevron-back" size={RFValue(20)} color="#fff" />
          </TouchableOpacity>
        )}
        {isDisabled && (
          <TouchableOpacity
            style={styles.backButton}
            // disabled={isDisabled}
            // onPress={()=>closeScreen('Main')}>
            onPress={() => resetAndNavigate('Main')}>
            <Icon name="chevron-down" size={RFValue(27)} color="#fff" />
          </TouchableOpacity>
        )}
        <CustomText
          variant="h4"
          fontFamily={Fonts.light}
          style={styles.titleTextWhite}>
          {title}
        </CustomText>
        <View style={styles.rightContainer}>
          {!hideAlert && (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => dispatch(openBottomSheet())}>
              <Iconm name="alarm-light" color="#CD5C5C" size={RFValue(18)} />
            </TouchableOpacity>
          )}

          {!hideHelp && (
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() =>
                navigate('Help', {
                  bookingId: helpData?.bookingId,
                  helpMessage: helpData?.helpMessage,
                })
              }>
              <CustomText
                style={{color: 'white'}}
                variant="h5"
                fontFamily={Fonts.light}>
                Help
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ConfirmationModal
        visible={isCallModalOpen}
        onCancel={handleCancelCall}
        onConfirm={handleConfirmCall}
        message="Call Support ?"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: RMS(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: RMS(10),
  },
  rightContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: RMS(10),
  },
  helpButton: {
    width: RS(50),
    borderWidth: 1,
    height: RMS(30),
    borderRadius: RMS(10),
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: RMS(5),
  },
  titleTextWhite: {
    color: 'white',
  },
  iconContainer: {
    borderRadius: RMS(50),
    height: RV(30),
    width: RS(30),
    borderColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RMS(5),
  },
});

export default LiveHeader;
