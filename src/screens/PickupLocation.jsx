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
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  BackHandler,
  Animated,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import LiveMap from './LiveMap';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  navigate,
  replace,
  resetAndNavigate,
} from '@navigation/NavigationService';
import CustomSwipeableButton from '@components/ui/CustomSwipeableButton';
import {Gesture} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';
import {useRoute} from '@react-navigation/native';
import {useMinimizeScreen} from 'context/TripScreenContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectTrip,
  setTripStatus,
  setTripSubstatus,
} from 'redux/slices/tripSlice';
import {setStatus} from '@service/api';
import {selectToken} from 'redux/slices/riderSlice';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {useLocation} from 'context/LocationContext';
import Loader from '@components/ui/Loader';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const RenderBackPressModal = ({visible, onConfirm, onCancel, message}) => {
  console.log('called Modal');

  return (
    <ConfirmationModal
      visible={visible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      message={message}
    />
  );
};

const PickupLocation = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const [isVisible, setIsVisible] = useState(true);
  const token = useSelector(selectToken);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const tripData = useSelector(selectTrip);
  const dispatch = useDispatch();
  const {location} = useLocation();

  const [loading, setLoading] = useState(false);
  const handleConfirmCall = () => {
    setIsCallModalVisible(false);
    console.log('Calling customer...');
  };

  const handleCancelCall = () => {
    setIsCallModalVisible(false);
  };

  const handleCallPress = () => {
    setIsCallModalVisible(true);
  };
  const handlePress = () => {
    navigate('PickOrder');
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.scrollTo(-SCREEN_HEIGHT / 3);
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

  const gesture = Gesture.Pan().onUpdate(event => {
    if (event.translationY < -50) {
      bottomSheetRef.current?.scrollTo(-SCREEN_HEIGHT / 3);
    } else if (event.translationY > 50) {
      bottomSheetRef.current?.scrollTo(0);
    }
  });

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['10%', '25%', '50%', '80%'], []);

  const handleSheetChanges = index => {
    console.log('Bottom sheet index changed to: ', index);

    if (index === 0) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigate('DeliveryDashboard');
      console.log('called back action');
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const {translateY, closeScreen} = useMinimizeScreen();

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

    // resetAndNavigate('PickOrder');

    try {
      setLoading(true);
      const response = await setStatus(data);
      console.log(response, 'SET_STATUS_RESPONSE_PICKUP');

      if (response?.status === 200) {
        const tripStatus = response?.data;
        dispatch(setTripStatus(tripStatus?.status));
        dispatch(setTripSubstatus(tripStatus?.substatus));

        // dispatch(addNewTrip(tripData));
        resetAndNavigate('PickOrder');
      } else {
        setLoading(false);
        console.log(response, 'ERROR_PICKUP_LOCATION');

        setModalVisible(true);
        setModalTitle('Something went wrong, please try again.');
        console.error(
          'Failed to accept booking:',
          response?.status,
          response?.data,
        );
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error in PICKUP_LOCATION:', error.message);
      // Optionally show an error message to the user
      setLoading(false);
      setModalVisible(true);
      setModalTitle('Something went wrong, please try again.');
    }
  };

  useEffect(() => {
    // Reset translateY when the component mounts
    translateY.setValue(0);
  }, [translateY]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  console.log(tripData.drop_geo, 'TRIPDATASSS');

  return (
    // <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
    <View style={[styles.container]}>
      <View style={styles.innerContainer}>
        <LiveHeader
          helpData={helpData}
          isDisabled={true}
          title={t('BOOKING_REACH_PICKUP_TITLE')}
        />

        <View style={styles.mapContainer}>
          {location && tripData ? (
            <LiveMap
              deliveryLocation={null}
              deliveryPersonLocation={{
                latitude: location?.lat,
                longitude: location?.lng,
              }}
              hasAccepted={true}
              hasPickedUp={false}
              pickupLocation={{
                latitude: tripData?.pickup_geo?.lat,
                longitude: tripData?.pickup_geo?.lng,
              }}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          onChange={handleSheetChanges}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.title}>
              <CustomText
                style={{color: 'white'}}
                variant="h5"
                fontFamily={Fonts.light}>
                {t('BOOKING_PICKUP_TITLE_CAPS')}
              </CustomText>
            </View>

            <View style={styles.booking}>
              <View style={styles.pickupAddress}>
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.light}
                  style={styles.header}>
                  {tripData?.pickup_name || 'Pickup place name'}
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={styles.text}>
                  {tripData?.pickup_address1} {tripData?.pickup_address2}
                  {tripData?.pickup_landmark} {tripData?.pickup_house}{' '}
                  {tripData?.pickup_landmark}
                  {tripData?.pickup_district}
                  {tripData?.pickup_city}
                  {tripData?.pickup_state} {tripData?.pickup_zip}
                </CustomText>
              </View>
            </View>
            <View style={styles.bookingDistanceDetails}>
              <TouchableOpacity
                onPress={handleCallPress}
                style={styles.bookingDetailsSubcontainer}>
                <View>
                  <Icon name="call-sharp" size={RS(18)} color="#0073cf" />
                  <CustomText
                    variant="h5"
                    fontFamily={Fonts.light}
                    style={{color: '#0073cf'}}>
                    {t('BOOKING_REACH_PICKUP_CALL')}
                  </CustomText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  openGoogleMapsNavigation(
                    tripData?.pickup_geo?.lat,
                    tripData?.pickup_geo?.lng,
                  )
                }
                style={styles.bookingDetailsSubcontainer2}>
                <Icon name="navigate-sharp" size={RS(17)} color="white" />
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={{color: 'white'}}>
                  {t('BOOKING_REACH_PICKUP_MAP')}
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
                {t('CUSTOMER')} :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                XXXXX
              </CustomText>
            </View>
            <View style={styles.bookingAddressContainer2}>
              <Icon name="call-outline" size={RS(21)} color="grey" />
              <CustomText
                variant="h4"
                fontFamily={Fonts.extraLight}
                style={{color: '#757575'}}>
                Pickup Phone No :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                {tripData?.pickup_mobile || '9999999999'}
              </CustomText>
            </View>
          </View>
        </BottomSheet>
      </View>

      <View style={styles.buttonContainer}>
        <CustomSwipeableButton
          title={t('BOOKING_DELIVERY_REACHED_PICKUP_LOCATION')}
          handleNavigation={handleNavigation}
        />
      </View>
      <RenderBackPressModal
        visible={isCallModalVisible}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
        message="Are you sure you want to call the customer?"
      />
      <BottomModalInfo
        title={modalTitle}
        modalVisible={isModalVisible}
        onClose={handleCloseModal}
      />
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
    backgroundColor: '#fff',
    zIndex: 1,
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
    width: RS(60),
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
    // borderRightWidth: 1,
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
    flex: 1,
    paddingBottom: RMS(80), // Add padding at the bottom if needed
  },
  buttonContainer: {
    position: 'absolute', // Position the button container absolutely
    bottom: 0,
    left: 0,
    right: 0,
    padding: RMS(10),
    backgroundColor: 'white', // Ensure the background is visible if needed
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
  imageContainer: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: RS(100),
    height: RS(90),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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

    // alignItems: 'center',
  },
});

export default PickupLocation;
