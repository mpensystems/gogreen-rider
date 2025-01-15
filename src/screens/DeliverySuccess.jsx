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
import React, {useEffect} from 'react';
import {RMS, RV} from '@utils/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import CustomButton from '@components/ui/CustomButton';
import {useTranslation} from 'react-i18next';
import LiveHeader from '../screens/LiveHeader';
import {navigate, resetAndNavigate} from '@navigation/NavigationService';
import {useMinimizeScreen} from 'context/TripScreenContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectTrip,
  setTrip,
  setTripStatus,
  setTripSubstatus,
} from 'redux/slices/tripSlice';

const DeliverySuccess = () => {
  const {t} = useTranslation();
  const tripData = useSelector(selectTrip);
  const dispatch = useDispatch();

  const helpData = {
    bookingId: '123456789',
    helpMessage: ['Call Support'],
  };

  const {translateY, closeScreen} = useMinimizeScreen();

  useEffect(() => {
    translateY.setValue(0);
  }, [translateY]);

  const handleNavigation = () => {
    resetAndNavigate('Main');
    dispatch(setTripStatus(null));
    dispatch(setTripSubstatus(null));
    dispatch(setTrip(null));
  };

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <LiveHeader
        helpData={helpData}
        isDisabled={true}
        title={t('Delivery Success')}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Icon name="check-decagram" color="green" size={RFValue(50)} />
          </View>
          <View style={styles.title}>
            <CustomText variant="h5" fontFamily={Fonts.semiBold}>
              {t('BOOKING_DELIVERY_COMPLETE')}
            </CustomText>
            <CustomText
              variant="h5"
              style={{color: '#666666'}}
              fontFamily={Fonts.semiBold}>
              {t('EARNINGS_TRIP_EARNINGS')}
            </CustomText>
            <CustomText variant="h1" fontFamily={Fonts.bold}>
              ₹{tripData?.fare}
            </CustomText>
          </View>
        </View>
        <View style={styles.tripContainer}>
          <CustomText variant="h5" fontFamily={Fonts.light}>
            {t('DETAILS')}
          </CustomText>
          <View style={styles.tripDetails}>
            <View style={styles.tripHeader}>
              <Icon name="currency-inr" color="#666666" size={RFValue(20)} />
              <CustomText
                variant="h6"
                fontFamily={Fonts.semiBold}
                style={{color: 'grey'}}>
                {t('EARNINGS_TRIP_PAY')}
              </CustomText>
            </View>
            <View>
              <CustomText
                style={{color: 'grey'}}
                variant="h6"
                fontFamily={Fonts.semiBold}>
                <Icon name="currency-inr" color="#666666" size={RFValue(11)} />
                {tripData?.fare}
              </CustomText>
            </View>
          </View>
          <View style={styles.tripEarningContainer}>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              {t('EARNINGS_TRIP_EARNINGS')}
            </CustomText>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              <Icon name="currency-inr" color="black" size={RFValue(13)} />
              {tripData?.fare}
            </CustomText>
          </View>
        </View>
        <View style={styles.TripDistanceContainer}>
          <View style={styles.tripDistance}>
            <CustomText
              variant="h6"
              fontFamily={Fonts.light}
              style={{color: 'grey'}}>
              {t('EARNINGS_TRIP_DISTANCE')}
            </CustomText>
            <CustomText
              variant="h6"
              fontFamily={Fonts.light}
              style={{color: 'grey'}}>
              {tripData?.trip_distance
                ? (tripData?.trip_distance / 1000).toFixed(2)
                : '0'}
              km
            </CustomText>
          </View>
          <View style={styles.tripTime}>
            <CustomText
              variant="h6"
              fontFamily={Fonts.light}
              style={{color: 'grey'}}>
              {t('EARNINGS_TRIP_TIME')}
            </CustomText>
            <CustomText
              variant="h6"
              fontFamily={Fonts.light}
              style={{color: 'grey'}}>
              20 mins
            </CustomText>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={handleNavigation} title={t('CONTINUE')} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: RMS(10),
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderColor: Colors.border,
    height: RV(150),
    width: '100%',
    marginTop: RMS(100),
    borderRadius: RMS(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
    paddingTop: RMS(10),
    gap: RMS(5),
  },
  tripContainer: {
    backgroundColor: 'white',
    height: RV(105),
    width: '100%',
    marginTop: RMS(25),
    borderRadius: RMS(15),
    borderColor: Colors.border,
    padding: RMS(10),
  },
  tripDetails: {
    paddingTop: RMS(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: RMS(5),
  },
  tripEarningContainer: {
    paddingTop: RMS(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TripDistanceContainer: {
    backgroundColor: 'white',
    borderColor: Colors.border,
    height: RV(70),
    width: '100%',
    borderRadius: RMS(15),
    marginTop: RMS(20),
    padding: RMS(10),
    gap: RMS(25),
  },
  tripDistance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: RMS(10),
    backgroundColor: Colors.backgroundSecondary,
  },
});

export default DeliverySuccess;
