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

import {View, StyleSheet, ScrollView, Animated} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {RMS, RV} from '@utils/responsive';
import LiveHeader from '../screens/LiveHeader';
import CustomAccordionDropOrder from '@components/ui/CustomAccordionDropOrder';
import {navigate, push, resetAndNavigate} from '@navigation/NavigationService';
import CustomSwipeableButton from '@components/ui/CustomSwipeableButton';
import OrderVerification from '@components/ui/OrderVerification';
import {useTranslation} from 'react-i18next';
import {useMinimizeScreen} from 'context/TripScreenContext';
import {useSelector} from 'react-redux';
import {selectTrip} from 'redux/slices/tripSlice';
import {setStatus} from '@service/api';
import {selectToken} from 'redux/slices/riderSlice';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useLocation} from 'context/LocationContext';

const DeliveryComplete = () => {
  const {t} = useTranslation();
  const [images, setImages] = useState([]);
  const tripData = useSelector(selectTrip);
  const token = useSelector(selectToken);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {location} = useLocation();

  const accordionData = [
    {
      title: t('ORDER_DETAILS'),
      icon: 'information-outline',
      data: ['item1', 'item2'],
    },
    {
      title: 'Customer Name',
      icon: 'account',
      data: [],
      address: {
        line1: tripData?.drop_address1,
        line2: tripData?.drop_address2,
        house: tripData?.drop_house,
        landmark: tripData?.drop_landmark,
        city: tripData?.drop_city,
        district: tripData?.drop_district,
        state: tripData?.drop_state,
      },
    },
  ];

  const handlePress = () => {
    navigate('DeliverySuccess');
  };

  const handleImagePicked = (type, image) => {
    setImages(prevImages => ({
      ...prevImages,
      [type]: image,
    }));
  };

  const handleNavigation = async () => {
    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };

    const data = {
      status: 'delivered',
      substatus: 'all-good',
      tid: tripData?.tid,
      token: token,
      currentLoc,
    };

    push('OtpScreenDelivery');
  };

  const helpData = {
    bookingId: '123456789',
    helpMessage: [
      'Customer asked to edit/cancel order',
      'Drop location is closed',
      'I want to unassign my order',
      'Insufficient Fuel',
      'Package Lost',
      'Water Damage',
      'Other',
    ],
  };

  const {translateY, closeScreen} = useMinimizeScreen(); // Use the context

  useEffect(() => {
    // Reset translateY when the component mounts
    translateY.setValue(0);
  }, [translateY]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <LiveHeader helpData={helpData} isDisabled={true} title="Drop Order" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.subContainer}>
          <View style={styles.paymentContainer}>
            <View>
              <Icon name="check-circle" size={RFValue(30)} color="green" />
            </View>
            <View style={styles.paymentDetails}>
              <CustomText variant="h4" fontFamily={Fonts.semiBold}>
                {t('BOOKING_DROP_CASH_COLLECTED')}
              </CustomText>
              <CustomText variant="h5" fontFamily={Fonts.light}>
                {t('ORDER_SMALL')}: 43xxxxxx44
              </CustomText>
            </View>
          </View>
          <OrderVerification onImagePicked={handleImagePicked} />

          <CustomAccordionDropOrder data={accordionData} />
        </View>
        <BottomModalInfo
          title={modalTitle}
          modalVisible={isModalVisible}
          onClose={handleCloseModal}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomSwipeableButton
          title={t('BOOKING_DROP_ORDER_DELIVERED')}
          handleNavigation={handleNavigation}
          targetScreen="DeliverySuccess"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    marginTop: RMS(30),
    justifyContent: 'center',
  },
  paymentContainer: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderRadius: 8,
    height: RV(60),
    borderColor: Colors.border,
    alignItems: 'center',
    gap: RMS(10),
    padding: RMS(5),
  },
  paymentDetails: {
    gap: RMS(2),
    justifyContent: 'center',
  },
  subContainer: {
    padding: RMS(10),
  },
  buttonContainer: {
    padding: RMS(15),
    justifyContent: 'flex-end',
  },
});

export default DeliveryComplete;
