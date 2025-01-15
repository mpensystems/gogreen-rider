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

import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const DeliveryDetails = ({details}) => {
  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <View style={styles.iconContainer}>
          <Icon name="bike-fast" color={Colors.disabled} size={RFValue(20)} />
        </View>
        <View>
          <CustomText variant="h5" fontFamily={Fonts.semiBold}>
            Your Delivery Details
          </CustomText>
          <CustomText variant="h8" fontFamily={Fonts.medium}>
            Details of your current order
          </CustomText>
        </View>
      </View>

      <View style={styles.flexRow2}>
        <View style={styles.iconContainer}>
          <Icon
            name="map-marker-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View style={{width: '80%'}}>
          <CustomText variant="h8" fontFamily={Fonts.medium}>
            Delivery at Home
          </CustomText>
          <CustomText variant="h8" numberOfLines={2} fontFamily={Fonts.regular}>
            {details?.address || 'address'}
          </CustomText>
        </View>
      </View>

      <View style={styles.flexRow2}>
        <View style={styles.iconContainer}>
          <Icon
            name="phone-outline"
            color={Colors.disabled}
            size={RFValue(20)}
          />
        </View>
        <View style={{width: '80%'}}>
          <CustomText variant="h8" fontFamily={Fonts.medium}>
            {details?.name || 'Name'} {details?.phone || '+9199999999'}
          </CustomText>
          <CustomText variant="h8" numberOfLines={2} fontFamily={Fonts.regular}>
            Receiver's Contact Number.
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    marginVertical: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  flexRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeliveryDetails;
