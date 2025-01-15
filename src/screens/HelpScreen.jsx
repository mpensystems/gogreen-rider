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

import {View, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import CustomBackButton from '@components/ui/CustomBackButton';
import {RMS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {TouchableOpacity} from 'react-native';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';
import {resetAndNavigate} from '@navigation/NavigationService';
import {useLocation} from 'context/LocationContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectTrip,
  setTripStatus,
  setTripSubstatus,
} from 'redux/slices/tripSlice';
import {selectToken} from 'redux/slices/riderSlice';
import {setStatus} from '@service/api';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useTranslation} from 'react-i18next';

const HelpScreen = ({route}) => {
  const {bookingId, helpMessage} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');
  const {location} = useLocation();
  const dispatch = useDispatch();
  const tripData = useSelector(selectTrip);
  const token = useSelector(selectToken);
  const [modalTitle, setModalTitle] = useState('');
  const {t} = useTranslation();

  const handlePress = issue => {
    setIsBottomModalVisible(true);
    setSelectedIssue(issue);
    console.log('Content pressed!');
  };

  const onCancel = () => {
    setIsBottomModalVisible(false);
  };

  const onConfirm = () => {
    if (selectedIssue) {
      resetAndNavigate('ReturnToPickup');
      setIsBottomModalVisible(false);
    }
  };

  const handleNavigation = async () => {
    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };
    const data = {
      status: 'way-to-pickup',
      substatus: 'arrived-at-pickup',
      tid: tripData?.tid,
      token: token,
      currentLoc,
    };

    try {
      if (selectedIssue) {
        const response = await setStatus(data);
        console.log(response, 'SET_STATUS_RESPONSE_HELP');

        if (response?.status === 200) {
          const tripStatus = response?.data;
          dispatch(setTripStatus(tripStatus?.status));
          dispatch(setTripSubstatus(tripStatus?.substatus));

          // dispatch(addNewTrip(tripData));
          resetAndNavigate('ReturnToPickup');
          setIsBottomModalVisible(false);
        } else {
          console.log(response, 'ERROR_HELP_SCREEN');
          setIsBottomModalVisible(false);
          setModalVisible(true);
          setModalTitle('Something went wrong, please try again.');
          console.log(
            'Failed to HELP_SCREEN:',
            response?.status,
            response?.data,
          );
          // Optionally show an error message to the user
        }
      }
    } catch (error) {
      console.log('Error in HELP_SCREEN:', error.message);
      // Optionally show an error message to the user
      setModalVisible(true);
      setIsBottomModalVisible(false);
      setModalTitle('Something went wrong, please try again.');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.content}>
      <CustomText variant="h4" fontFamily={Fonts.light}>
        {item}
      </CustomText>
      <Icon name="chevron-forward-outline" size={RFValue(20)} color="black" />
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.buttonContainer}>
          <CustomBackButton />
        </View>

        <View style={styles.textContainer}>
          <CustomText variant="h2" fontFamily={Fonts.light}>
            {t('HELP_FOR')} #{bookingId || '92xxxxx89'}
          </CustomText>
        </View>
      </View>

      <View style={styles.title}>
        <CustomText variant="h5" fontFamily={Fonts.light}>
          {t('SELECT AN ISSUE')}
        </CustomText>
      </View>

      <View style={styles.contentSection}>
        <FlatList
          data={helpMessage}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <ConfirmationModal
        visible={isBottomModalVisible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        message="Sure wan't to cancel the trip ?"
      />
      <BottomModalInfo
        title={modalTitle}
        modalVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RMS(10),
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: RMS(50),
  },
  textContainer: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingRight: RMS(50),
  },
  title: {
    marginBottom: RMS(10),
  },
  contentSection: {
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    borderRadius: RMS(10),
    paddingLeft: RMS(20),
  },
  content: {
    borderBottomWidth: 1,
    borderColor: Colors.border,
    width: '95%',
    height: RV(50),
    paddingTop: RMS(10),
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: RMS(10),
  },
});

export default HelpScreen;
