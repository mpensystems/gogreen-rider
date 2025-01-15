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

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Animated,
} from 'react-native';
import LiveHeader from './LiveHeader';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import {RMS, RS, RV} from '@utils/responsive'; // Make sure this is imported if used
import {navigate, resetAndNavigate} from '@navigation/NavigationService';
import CustomSwipeableButton from '@components/ui/CustomSwipeableButton';
import OrderVerification from '@components/ui/OrderVerification';
import {useTranslation} from 'react-i18next';
import CustomAccordionDropOrder from '@components/ui/CustomAccordionDropOrder';
import {useRoute} from '@react-navigation/native';
import OrderDetails from '@components/delivery/OrderDetails';
import {useMinimizeScreen} from 'context/TripScreenContext';
import {useSelector} from 'react-redux';
import {selectTrip} from 'redux/slices/tripSlice';
import {setStatus} from '@service/api';
import {selectToken} from 'redux/slices/riderSlice';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useLocation} from 'context/LocationContext';

const PickOrder = () => {
  const {t} = useTranslation();
  const [images, setImages] = useState([]);
  const route = useRoute();
  const tripData = useSelector(selectTrip);
  const token = useSelector(selectToken);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {location} = useLocation();

  const handlePickedOrder = () => {
    navigate('DeliveredOrder');
  };

  const handleImagePicked = (type, image) => {
    console.log(type, 'TYPE');
    console.log(image, 'IMAGE');

    setImages(prevImages => ({
      ...prevImages,
      [type]: image,
    }));
  };

  const handleVerifyOrderPress = () => {
    navigate('OtpScreenDelivery');
  };

  const handleNavigation = async () => {
    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };
    const data = {
      status: 'way-to-drop',
      substatus: 'routing',
      tid: tripData?.tid,
      token: token,
      currentLoc,
    };

    navigate('OtpScreenPickup');
  };

  const BookingDetails = [
    {
      title: t('DROP_DETAILS'),
      data: [
        {label: 'Name', value: tripData?.drop_name},
        {label: 'Phone No', value: tripData?.drop_mobile},
      ],
      icon: 'account-outline',
    },
    {
      title: t('PICKUP_DETAILS'),
      icon: 'warehouse',
      data: [],
      address: {
        line1: tripData?.pickup_address1,
        line2: tripData?.pickup_address2,
        house: tripData?.pickup_house,
        landmark: tripData?.pickup_landmark,
        city: tripData?.pickup_city,
        district: tripData?.pickup_district,
        state: tripData?.pickup_state,
      },
    },
  ];

  useEffect(() => {
    return () => {
      setImages({});
    };
  }, []);

  const helpData = {
    bookingId: '123456789',
    helpMessage: [
      'Customer asked to edit/cancel order',
      'Pickup location is closed',
      'I want to unassign my order',
      'Item is too big',
      'Restricted Item',
      'Insufficient packaging',
      'Drop to far',
      'Pickup location restriction',
      'Insufficient Fuel',
      'Other',
    ],
  };

  const fullNumber = '98xxxxxx434';

  const lastFourDigits = fullNumber.slice(-4);
  const numberWithoutLastFour = fullNumber.slice(0, -4);
  const {translateY, closeScreen} = useMinimizeScreen();

  useEffect(() => {
    translateY.setValue(0);
  }, [translateY]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <LiveHeader
        helpData={helpData}
        isDisabled={true}
        title={t('PICK_ORDER')}
      />
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.orderDetailsContainer}>
            <View style={styles.orderId}>
              <CustomText variant="h2" fontFamily={Fonts.light}>
                {t('BOOKING_ORDER_ORDER_ID')}
              </CustomText>
              <CustomText variant="h0">
                {numberWithoutLastFour}
                <CustomText
                  fontFamily={Fonts.light}
                  style={styles.highlight}
                  variant="h0">
                  {lastFourDigits}
                </CustomText>
              </CustomText>
            </View>
            <OrderDetails
              shopName="Shop Name"
              items={[
                {name: 'Item 1', description: 'Item desc1, Item desc 2'},
                {
                  name: 'Item 2',
                  description: 'Item desc1, Item desc 2, Item desc 3',
                },
                {name: 'Item 3', description: 'Item desc1'},
              ]}
              onVerifyOrderPress={handleVerifyOrderPress}
            />
            <OrderVerification onImagePicked={handleImagePicked} />
            <View style={styles.accordiancontainer}>
              <CustomAccordionDropOrder
                geoLoc={tripData?.pickup_geo}
                data={BookingDetails}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <CustomSwipeableButton
          title={t('PICKED_ORDER')}
          handleNavigation={handleNavigation}
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
  contentContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  orderDetailsContainer: {
    backgroundColor: 'white',
    padding: RMS(10),
    paddingVertical: RMS(50),
  },
  orderId: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RMS(20),
  },
  accordiancontainer: {
    flex: 1,
    paddingVertical: RMS(30),
  },
  buttonContainer: {
    padding: RMS(10),
  },
  orderDetails: {
    borderRadius: RMS(5),
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    justifyContent: 'space-between',
  },
  orderDetailHeader: {
    backgroundColor: '#87cefa75',
    padding: RMS(10),
    borderBottomWidth: 1,
    borderBottomColor: '#1e90ff99',
  },
  pickupItemHeader: {
    backgroundColor: '#87cefa75',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RMS(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickupOrderDetails: {
    padding: RMS(15),
    gap: 10,
  },
  pickupOrderHeader: {
    justifyContent: 'center',
    marginBottom: RMS(15),
    gap: RMS(5),
  },
  verifyButtonContainer: {
    padding: RMS(10),
  },
  imageContainer: {
    flex: 1,
    borderWidth: 1,
    marginTop: RMS(50),
    borderColor: Colors.border,
    gap: RMS(5),
    padding: RMS(10),
    borderRadius: RMS(5),
  },
  imagePreview: {
    width: RS(100),
    height: RV(80),
    borderRadius: RMS(5),
    marginBottom: RMS(10),
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
  },
  imageButtonContainer: {
    // paddingLeft:RMS(35)
  },
  desc: {
    paddingLeft: RMS(10),
  },
  iconContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: RMS(50),
    height: RV(35),
    width: RS(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    // backgroundColor:'#ffdf00',
  },
});

export default PickOrder;
