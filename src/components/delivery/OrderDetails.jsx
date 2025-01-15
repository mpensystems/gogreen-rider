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

import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';
import {RMS, RV} from '@utils/responsive';

const OrderDetails = ({shopName, items, onVerifyOrderPress}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleDropdown = () => {
    if (isVerified) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <View style={styles.orderDetails}>
      {isVerified ? (
        <TouchableOpacity
          style={styles.verifiedContainer}
          onPress={toggleDropdown}>
          <View style={styles.title}>
            <CustomText variant="h5" fontFamily={Fonts.bold}>
              Order Verified
            </CustomText>
            <Icon name="checkmark-circle" size={RMS(20)} color="#28a745" />
          </View>

          <Icon
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={RMS(20)}
            color="#0067a5"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      ) : null}

      {(isExpanded || !isVerified) && (
        <>
          <View style={styles.orderDetailHeader}>
            <CustomText
              style={{color: '#0067a5'}}
              variant="h6"
              fontFamily={Fonts.light}>
              {shopName}
            </CustomText>
          </View>
          <View style={styles.pickupItemHeader}>
            <CustomText
              style={{color: '#0067a5'}}
              variant="h5"
              fontFamily={Fonts.semiBold}>
              Pickup Items
            </CustomText>
          </View>

          <View style={styles.pickupOrderDetails}>
            {items.map((item, index) => (
              <View key={index} style={styles.pickupOrderHeader}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {item.name}
                </CustomText>
                <CustomText
                  style={styles.desc}
                  variant="h5"
                  fontFamily={Fonts.extraLight}>
                  {item.description}
                </CustomText>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderDetails: {
    borderRadius: RMS(5),
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  verifiedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RMS(10),
    height: RV(50),
    backgroundColor: '#e6ffe6',
  },
  orderDetailHeader: {
    backgroundColor: '#87cefa75',
    padding: RMS(10),
    borderBottomWidth: 1,
    borderBottomColor: '#1e90ff99',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    gap: RMS(10),
  },
  pickupOrderHeader: {
    justifyContent: 'center',
    marginBottom: RMS(15),
    gap: RMS(5),
  },
  verifyButtonContainer: {
    padding: RMS(10),
  },
  desc: {
    paddingLeft: RMS(10),
  },
  dropdownIcon: {
    marginLeft: RMS(10),
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
  },
});

export default OrderDetails;
