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
import React from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '@navigation/NavigationService';
import {RMS} from '@utils/responsive';

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#28a745';
    case 'confirmed':
      return '#007bff';
    case 'delivered':
      return '#17a2b8';
    case 'cancelled':
      return '#dc3545';
    default:
      return '#6c757d';
  }
}

const Booking = ({booking, isOnline, isKycApproved}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigate('AcceptBooking', {
            isOnline,
            isKycApproved,
            bookingID: booking?.bid,
          });
        }}>
        <View style={styles.flexRowBetween}>
          <CustomText variant="h8" fontFamily={Fonts.light}>
            {/* #{item.bid} */}
            #12343
          </CustomText>
          <View style={styles.bid}>
            <CustomText variant="h4" fontFamily={Fonts.semiBold}>
              ₹{booking?.bidConfig?.current_bid} -
            </CustomText>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              {(booking?.trip_distance / 1000).toFixed(2)} km
            </CustomText>
          </View>

          <View style={styles.statusContainer}>
            <CustomText
              variant="h8"
              fontFamily={Fonts.semiBold}
              style={[
                styles.statusText,
                {color: getStatusColor(booking?.status)},
              ]}>
              {booking?.status}
            </CustomText>
          </View>
        </View>

        <View style={styles.pickupContainer}>
          <CustomText
            variant="h6"
            style={{color: 'grey'}}
            fontFamily={Fonts.light}>
            PICKUP
          </CustomText>
          <CustomText variant="h6" fontFamily={Fonts.semiBold}>
            {booking?.pickup?.landmark} {booking?.pickup?.district}{' '}
            {booking?.pickup?.state} {booking?.pickup?.zip}
          </CustomText>
        </View>

        <View style={[styles.flexRowBetween, styles.addressContainer]}>
          <View style={styles.dropContainer}>
            <CustomText
              style={{color: 'grey'}}
              variant="h6"
              fontFamily={Fonts.light}>
              DROP
            </CustomText>
            <CustomText variant="h6" fontFamily={Fonts.semiBold}>
              {booking?.drops?.landmark} {booking?.drops?.district}{' '}
              {booking?.drops?.state} {booking?.drops?.zip}
            </CustomText>
          </View>

          <Icon name="arrow-right-circle" size={RFValue(24)} color="green" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.7,
    padding: 10,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    textTransform: 'capitalize',
    color: 'white',
  },
  pickupContainer: {
    gap: RMS(5),
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
  },
  addressContainer: {
    marginTop: 10,
  },
  dropContainer: {
    gap: RMS(11),
    flexDirection: 'row',
    width: '70%',
  },
  dateText: {
    marginTop: 2,
    fontSize: RFValue(8),
  },
  iconContainer: {
    alignItems: 'flex-end',
  },
  bid: {
    paddingTop: RMS(5),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: RMS(5),
  },
});

export default Booking;
