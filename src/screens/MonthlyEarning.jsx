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
import React, {useState} from 'react';
import CustomPayoutModal from '@components/ui/CustomPayoutModal';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {RMS, RS, RV} from '@utils/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTranslation} from 'react-i18next';

const MonthlyEarning = () => {
  const {t} = useTranslation();
  const data = ['March 2024', 'April 2024', 'May 2024'];
  const [selectedIdType, setSelectedIdType] = useState('March 2024');

  const placeholder = '20 Mar to 10 Mar';

  const handleValueChange = item => {
    // setSelectedIdType(item);
    // setFormValues(prevValues => ({
    //   ...prevValues,
    //   photo_id_type: item,
    // }));
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomPayoutModal
          data={data}
          placeholder={placeholder}
          selectedValue={selectedIdType}
          onValueChange={handleValueChange}
        />
      </View>
      <View style={styles.titleContainer}>
        <CustomText variant="h4" fontFamily={Fonts.semiBold}>
          {t('PERFORMANCE_FOR_THIS_MONTH')}
        </CustomText>
        <View style={styles.historyContainer}>
          <CustomText
            variant="h5"
            style={styles.historyText}
            fontFamily={Fonts.semiBold}>
            {t('SEE_HISTORY')}
          </CustomText>
          <Icon
            name="arrow-right-thin-circle-outline"
            color="green"
            size={RFValue(15)}
          />
        </View>
      </View>
      <View style={styles.reportContainer}>
        <View style={styles.tripContainer}>
          <View style={styles.tripDetails}>
            <CustomText variant="h5" fontFamily={Fonts.bold}>
              200
            </CustomText>
          </View>
          <View style={styles.tripLabel}>
            <CustomText
              style={{color: 'grey'}}
              variant="h5"
              fontFamily={Fonts.light}>
              {t('TRIP_DISTANCE')} (kms)
            </CustomText>
          </View>
        </View>
        <View style={styles.ordersContainer}>
          <View style={styles.orderDetails}>
            <CustomText variant="h5" fontFamily={Fonts.bold}>
              100
            </CustomText>
          </View>
          <View style={styles.orderLabel}>
            <CustomText
              variant="h5"
              style={{color: 'grey'}}
              fontFamily={Fonts.light}>
              {t('ORDERS')}
            </CustomText>
          </View>
        </View>
      </View>
      <View style={styles.earningContainer}>
        <CustomText variant="h4" fontFamily={Fonts.semiBold}>
          {t('EARNINGS_FOR_THIS_MONTH')}
        </CustomText>
        <CustomText
          style={{color: 'grey'}}
          variant="h5"
          fontFamily={Fonts.light}>
          March
        </CustomText>
        <CustomText variant="h1" fontFamily={Fonts.semiBold}>
          ₹1000
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginTop: RMS(100),
    padding: RMS(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    color: 'green',
    marginRight: 5,
  },
  reportContainer: {
    borderRadius: 10,
    margin: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tripDetails: {
    borderRadius: RMS(50),
    backgroundColor:'#f5f5f5',
    borderColor: Colors.border,
    width: RS(100),
    height: RV(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDetails: {
    borderRadius: RMS(50),
    backgroundColor:'#f5f5f5',
    borderColor: Colors.border,
    width: RS(100),
    height: RV(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningContainer: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    marginTop: RMS(50),
    height: RV(100),
    alignItems: 'center',
    justifyContent: 'center',
    gap: RMS(5),
  },
});

export default MonthlyEarning;
