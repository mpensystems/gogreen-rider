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

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import LiveMap from './LiveMap';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigate, resetAndNavigate} from '@navigation/NavigationService';
import CustomSwipeableButton from '@components/ui/CustomSwipeableButton';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';
import {useMinimizeScreen} from 'context/TripScreenContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectTrip,
  setTripStatus,
  setTripSubstatus,
} from 'redux/slices/tripSlice';
import {selectToken} from 'redux/slices/riderSlice';
import {setStatus} from '@service/api';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useLocation} from 'context/LocationContext';
import Loader from '@components/ui/Loader';

const DeliveredOrder = () => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef(null);
  const [isCallModalVisible, setCallModalvisible] = useState(false);
  const tripData = useSelector(selectTrip);
  const token = useSelector(selectToken);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {location} = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    navigate('DeliveryComplete');
  };

  const handleNavigation = async () => {
    const currentLoc = {
      lat: location?.lat,
      lng: location?.lng,
    };
    const data = {
      status: 'way-to-drop',
      substatus: 'arrived-at-drop',
      tid: tripData?.tid,
      token: token,
      currentLoc,
    };

    // resetAndNavigate('DeliveryComplete');

    try {
      setLoading(true);
      const response = await setStatus(data);
      console.log(response, 'SET_STATUS_RESPONSE_DROP_ARRIVED');

      if (response?.status === 200) {
        const tripStatus = response?.data;
        dispatch(setTripStatus(tripStatus?.status));
        dispatch(setTripSubstatus(tripStatus?.substatus));
        setLoading(false);
        // const tripData = response?.data;
        // dispatch(addNewTrip(tripData));
        resetAndNavigate('DeliveryComplete');
      } else {
        console.log(response, 'ERROR_DROP');
        setLoading(false);
        setIsModalVisible(true);
        setModalTitle(t('SOMETHING_WENT_WRONG'));
        console.error('Failed to DROP', response?.status, response?.data);
        // Optionally show an error message to the user
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in DROP:', error.message);
      // Optionally show an error message to the user
      setIsModalVisible(true);
      setModalTitle(t('SOMETHING_WENT_WRONG'));
    }
  };

  const openGoogleMapsNavigation = (latitude, longitude) => {
    const googleMapsNavigationURL = `google.navigation:q=${latitude},${longitude}&mode=d`;

    if (Platform.OS === 'android') {
      Linking.openURL(googleMapsNavigationURL).catch(err =>
        console.error('Error opening map', err),
      );
    } else {
      const appleMapsURL = `maps://?daddr=${latitude},${longitude}&dirflg=d`;
      Linking.openURL(appleMapsURL).catch(err =>
        console.error('Error opening map', err),
      );
    }
  };

  // Variables to control the snap points (heights of the bottom sheet)
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '80%'], []);

  useEffect(() => {
    if (bottomSheetRef) {
      bottomSheetRef.current?.expand();
    }
    return () => {
      bottomSheetRef.current = null;
    };
  }, []);

  const handleSheetChanges = index => {
    console.log('Bottom sheet index changed to: ', index);

    if (index === -1) {
      bottomSheetRef.current?.snapToIndex(1);
    }
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

  const handleConfirmCall = () => {
    setCallModalvisible(false);
    console.log('Calling customer...');
  };

  const handleCancelCall = () => {
    setCallModalvisible(false);
  };

  const handleCallPress = () => {
    setCallModalvisible(true);
  };

  const {translateY, closeScreen} = useMinimizeScreen();

  useEffect(() => {
    // Reset translateY when the component mounts
    translateY.setValue(0);
  }, [translateY]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.innerContainer}>
        <LiveHeader
          helpData={helpData}
          isDisabled={true}
          title={t('REACH_DROP')}
        />
        <View style={styles.mapContainer}>
          {location && tripData ? (
            <LiveMap
              deliveryLocation={{
                latitude: tripData?.drop_geo?.lat,
                longitude: tripData?.drop_geo?.lng,
              }}
              deliveryPersonLocation={{
                latitude: location?.lat,
                longitude: location?.lng,
              }}
              hasAccepted={false}
              hasPickedUp={true}
              pickupLocation={null}
            />
          ) : (
            <ActivityIndicator size="large" color="green" />
          )}
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.title}>
              <CustomText
                style={{color: 'white'}}
                variant="h5"
                fontFamily={Fonts.light}>
                {t('BOOKING_DROP_TITLE')}
              </CustomText>
            </View>
            <View style={styles.booking}>
              <View style={styles.pickupAddress}>
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.light}
                  style={styles.header}>
                  {tripData?.drop_name}
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={styles.text}>
                  {tripData?.drop_address1} {tripData?.drop_address2}
                  {tripData?.drop_landmark} {tripData?.drop_house}{' '}
                  {tripData?.drop_landmark}
                  {tripData?.drop_district}
                  {tripData?.drop_city}
                  {tripData?.drop_state} {tripData?.drop_zip}
                </CustomText>
              </View>
            </View>
            <View style={styles.bookingDistanceDetails}>
              <TouchableOpacity
                style={styles.bookingDetailsSubcontainer}
                onPress={handleCallPress}>
                <Icon name="call-sharp" size={RS(18)} color="#0073cf" />
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={{color: '#0073cf'}}>
                  {t('BOOKING_REACH_PICKUP_CALL')}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookingDetailsSubcontainer2}
                onPress={() =>
                  openGoogleMapsNavigation(
                    tripData?.drop_geo?.lat,
                    tripData?.drop_geo?.lng,
                  )
                }>
                <Icon name="navigate-sharp" size={RS(17)} color="white" />
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={{color: 'white'}}>
                  {t('MAP')}
                </CustomText>
              </TouchableOpacity>
            </View>

            <View style={styles.bookingAddressContainer}>
              <Icon name="card-outline" size={RS(21)} color="grey" />
              <CustomText
                variant="h4"
                fontFamily={Fonts.extraLight}
                style={{color: '#757575'}}>
                {t('BOOKING_ORDER_TITLE')} :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                XXXXXX
              </CustomText>
            </View>
            <View style={styles.bookingAddressContainer2}>
              <Icon name="cube-outline" size={RS(21)} color="grey" />
              <CustomText
                variant="h4"
                fontFamily={Fonts.extraLight}
                style={{color: '#757575'}}>
                Name_From_where_picked :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                {tripData?.drop_name}
              </CustomText>
            </View>

            <View style={styles.bookingAddressContainer2}>
              <Icon name="cube-outline" size={RS(21)} color="grey" />
              <CustomText
                variant="h4"
                fontFamily={Fonts.extraLight}
                style={{color: '#757575'}}>
                Drop Phone No :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                {tripData?.drop_mobile}
              </CustomText>
            </View>
          </View>
        </BottomSheet>
      </View>
      <ConfirmationModal
        visible={isCallModalVisible}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
        message={t('ARE_YOU_SURE_YOU_WANT_TO_CALL_SUPPORT')}
      />

      <View style={styles.buttonContainer}>
        <CustomSwipeableButton
          title={t('BOOKING_DROP_REACH_DROP_LOCATION')}
          handleNavigation={handleNavigation}
        />
        <BottomModalInfo
          modalVisible={isModalVisible}
          title={modalTitle}
          onClose={handleCloseModal}
        />
      </View>
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
  },
  innerContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  title: {
    backgroundColor: 'green',
    height: RV(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: RS(80),
    borderRadius: RMS(5),
    marginBottom: RMS(5),
  },
  booking: {
    width: '100%',
    borderRadius: 8,
    borderColor: Colors.border,
    paddingBottom: RMS(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingDistanceDetails: {
    borderRadius: RMS(5),
    width: '100%',
    height: RV(45),
    borderWidth: 1,
    borderColor: '#0073cf',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingDetailsSubcontainer: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingDetailsSubcontainer2: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    borderColor: '#0073cf',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0073cf',
  },
  bookingAddressContainer: {
    borderRadius: 15,
    width: '100%',
    borderColor: Colors.border,
    paddingLeft: RMS(10),
    paddingTop: RMS(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
  },
  scrollContent: {
    paddingBottom: RMS(80),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: RMS(10),
    backgroundColor: 'white',
  },
  pickupAddress: {
    width: '100%',
  },
  header: {
    padding: RMS(3),
  },
  text: {
    padding: RMS(3),
    color: 'grey',
  },
  bookingAddressContainer2: {
    borderRadius: 15,
    width: '100%',
    borderColor: Colors.border,
    paddingLeft: RMS(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomSheetContent: {
    padding: RMS(5),
    justifyContent: 'center',
  },
});

export default DeliveredOrder;
