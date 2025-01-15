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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import LiveMap from './LiveMap';
import {RMS, RV, RS} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  navigate,
  push,
  replace,
  resetAndNavigate,
} from '@navigation/NavigationService';
import CustomSwipeButton from '@components/ui/CustomSwipeableButton';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectRider, selectToken} from 'redux/slices/riderSlice';
import {selectIsOnline, setIsDeliveryOnProcess} from 'redux/slices/modalSlice';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useMapRef} from 'context/MapRefContext';
import {acceptBooking, setStatus} from '@service/api';
import {useLocation} from 'context/LocationContext';
import {setTrip, setTripStatus, setTripSubstatus} from 'redux/slices/tripSlice';
import Loader from '@components/ui/Loader';
import {selectCurrentBooking} from 'redux/slices/bookingSlice';

const AcceptBooking = () => {
  const route = useRoute();
  const {isOnline, isKycApproved, bookingID} = route.params; // Access params
  const rider = useSelector(selectRider);
  const online = useSelector(selectIsOnline);
  const {t} = useTranslation();
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const {mapReady} = useMapRef();
  const st = useSelector(selectToken);
  const {location} = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const [booking, setBooking] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState('');
  const [kycModalTitle] = useState(t('KYC_APPROVAL_REQUIRED'));

  const bookings = useSelector(selectCurrentBooking);

  console.log(bookings, 'BOOKINDS');

  const booking = bookings?.find(bookinge => bookinge.bid === bookingID);

  console.log(booking, 'SELECTED_BOOKING');

  console.log(st, 'TOKEN_ACCEPTBOOKING');

  const handleNavigation = async () => {
    if (!booking) return;

    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };

    const data = {token: st, bid: booking?.bid, currentLoc};

    try {
      setLoading(true);
      const response = await acceptBooking(data);
      console.log(response, 'ACCEPT_BOOKING_RESPONSE');

      if (response?.status === 200) {
        const tripData = response?.data;
        dispatch(setTrip(tripData));
        console.log(tripData?.status, 'ACCEPT_BOOKING_RESPONSE');

        dispatch(setTripStatus(tripData?.status));
        dispatch(setTripSubstatus(tripData?.substatus));
        resetAndNavigate('PickupLocation');
        setLoading(false);
      } else {
        console.log(response, 'ERROR_ACCEPT_BOOKING');

        setIsModalVisible(true);
        setErrorModalTitle(t('SOMETHING_WENT_WRONG'));
        console.error(
          'Failed to accept booking:',
          response?.status,
          response?.data,
        );
        setLoading(false);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error in ACCEPT_BOOKING:', error.message);
      // Optionally show an error message to the user
      setIsModalVisible(true);
      setErrorModalTitle(t('SOMETHING_WENT_WRONG'));
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (rider?.kyc_approved !== 'approved') {
      setKycModalVisible(true);
    }
  }, [rider?.kyc_approved]);
  console.log(isOnline, isKycApproved, 'ISONLINE');
  console.log(mapReady, 'MAPREADY');
  console.log(rider, 'RIDER_DATA');

  return (
    <View style={styles.container}>
      <>
        <LiveHeader
          hideAlert={true}
          hideHelp={true}
          isDisabled={false}
          title={t('BOOKING')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={true}>
          <View style={styles.content}>
            <LiveMap
              deliveryLocation={{
                latitude: booking?.drops?.geo.lat,
                longitude: booking?.drops?.geo.lng,
              }}
              deliveryPersonLocation={location}
              hasAccepted={false}
              hasPickedUp={false}
              pickupLocation={{
                latitude: booking?.pickup?.geo.lat,
                longitude: booking?.pickup?.geo.lng,
              }}
            />

            <View style={styles.earningContainer}>
              <CustomText
                variant="h5"
                fontFamily={Fonts.light}
                style={styles.earningText}>
                {t('BOOKING_EXPECTED_EARNINGS')}
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.semiBold}
                style={styles.earningAmount}>
                ₹ {booking?.bidConfig?.current_bid}
              </CustomText>
            </View>
            <View style={styles.distanceContainer}>
              <View style={styles.distanceItem}>
                <CustomText
                  variant="h5"
                  style={styles.distanceLabel}
                  fontFamily={Fonts.light}>
                  {t('BOOKING_PICKUP_TITLE')}:
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.semiBold}
                  style={styles.distanceValue}>
                  0.94km
                </CustomText>
              </View>
              <View style={styles.distanceItem2}>
                <CustomText
                  variant="h5"
                  style={styles.distanceLabel}
                  fontFamily={Fonts.light}>
                  {t('BOOKING_DROP_TITLE')}:
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.semiBold}
                  style={styles.distanceValue}>
                  3km
                </CustomText>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <CustomText
                variant="h6"
                style={styles.addressTitle}
                fontFamily={Fonts.light}>
                {t('BOOKING_PICKUP_FROM')}
              </CustomText>
              <View style={styles.addressDetails}>
                <CustomText variant="h4" fontFamily={Fonts.semiBold}>
                  {t('BOOKING_PICKUP_ADDRESS')}
                </CustomText>
                <CustomText
                  variant="h6"
                  fontFamily={Fonts.light}
                  style={styles.addressText}>
                  {booking?.pickup?.address1} {booking?.pickup?.address2}
                  {booking?.pickup?.landmark} {booking?.pickup?.district}
                  {booking?.pickup?.state} {booking?.pickup?.zip}
                </CustomText>
                <View style={styles.timerContainer}>
                  <Icon name="time-outline" size={RS(15)} color="grey" />
                  <CustomText
                    variant="h6"
                    fontFamily={Fonts.light}
                    style={styles.timerText}>
                    2 mins away
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomSwipeButton
            // isKycApproved = {rider?.kyc_approved}
            isKycApproved={true}
            // isOnline={online}
            isOnline={true}
            title={t('BOOKING_PICKUP_ACCEPT_BOOKING')}
            handleNavigation={handleNavigation}
          />

          <BottomModalInfo
            title={kycModalTitle}
            modalVisible={kycModalVisible}
            onClose={() => setKycModalVisible(false)}
          />
          <BottomModalInfo
            title={errorModalTitle}
            modalVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </>
      {loading && (
        <View style={styles.loaderOverlay}>
          <Loader loading={loading} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  earningContainer: {
    width: '100%',
    height: RV(40),
    borderRadius: RMS(10),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: RMS(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: RMS(10),
  },
  earningText: {
    color: '#757575',
  },
  earningAmount: {
    // color: '#757575',
  },
  distanceContainer: {
    borderRadius: RMS(10),
    height: RV(40),
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RMS(10),
  },
  distanceItem: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  distanceItem2: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceLabel: {
    color: '#757575',
  },
  distanceValue: {
    marginLeft: RMS(8),
  },
  addressContainer: {
    borderRadius: RMS(10),
    width: '100%',
    marginTop: RMS(10),
    borderWidth: 1,
    borderColor: Colors.border,
    padding: RMS(10),
  },
  addressTitle: {
    color: '#757575',
  },
  addressDetails: {
    paddingTop: RMS(2),
  },
  addressText: {
    paddingTop: RMS(2),
    // color: '#757575',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: RMS(2),
  },
  timerText: {
    paddingLeft: RMS(5),
    color: '#757575',
  },
  scrollContent: {
    // backgroundColor: Colors.backgroundSecondary,
  },
  buttonContainer: {
    padding: RMS(10),
  },
});

export default AcceptBooking;
