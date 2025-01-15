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
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import LiveMap from './LiveMap';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import LiveHeader from './LiveHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigate} from '@navigation/NavigationService';
import CustomSwipeableButton from '@components/ui/CustomSwipeableButton';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {createOpenLink} from '@utils/OpenMap';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import ConfirmationModal from '@components/ui/CustomConfirmationModal';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const ReturnToPickup = () => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef(null);
  const [isCallModalVisible, setCallModalvisible] = useState(false);

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
      'Customer not available',
      'Delayed pickup',
      'Driver unreachable',
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

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <LiveHeader
          helpData={helpData}
          isDisabled={true}
          title={t('REACH_DROP')}
        />

        <View style={styles.mapContainer}>
          <LiveMap
            deliveryLocation={{
              latitude: 19.0866,
              longitude: 72.8873,
            }}
            deliveryPersonLocation={{latitude: 19.0822, longitude: 72.8844}}
            hasAccepted={true}
            hasPickedUp={false}
            pickupLocation={{
              latitude: 19.0822,
              longitude: 72.8844,
            }}
          />
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
                {t('BOOKING_DROP_TITLE') || 'RETURN'}
              </CustomText>
            </View>
            <View style={styles.booking}>
              <View style={styles.pickupAddress}>
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.light}
                  style={styles.header}>
                  Return location name
                </CustomText>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={styles.text}>
                  Return address line 1 Pickup address line 2 Pickup address
                  line 3
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
                  openGoogleMapsNavigation(19.076, 72.8777, 'My Restaurant')
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
                Name_of_place_to_return :
              </CustomText>
              <CustomText
                variant="h4"
                fontFamily={Fonts.light}
                style={{color: '#757575'}}>
                XXXXX
              </CustomText>
            </View>
          </View>
        </BottomSheet>
      </View>
      <ConfirmationModal
        visible={isCallModalVisible}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
        message="Are you sure want to call customer?"
      />
      <View style={styles.buttonContainer}>
        <CustomSwipeableButton
          title={t('BOOKING_DROP_REACH_DROP_LOCATION')}
          targetScreen="DeliveryDashboard"
        />
      </View>
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
    // margin: 10,
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
    gap: 10,
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

export default ReturnToPickup;
