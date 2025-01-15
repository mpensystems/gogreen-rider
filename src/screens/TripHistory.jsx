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
import {RMS} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import CustomBackButton from '@components/ui/CustomBackButton';

const TripHistory = () => {
  const data = ['AdharCard', 'Pancard', 'License'];
  const [selectedIdType, setSelectedIdType] = useState('20 Mar to 10 Mar');
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
      <View style={styles.modalContainer}>
        <CustomBackButton />
        <CustomPayoutModal
          data={data}
          placeholder={placeholder}
          selectedValue={selectedIdType}
          onValueChange={handleValueChange}
        />
      </View>
      <View style={styles.tripHistoryContainer}>
        <View style={styles.tripHistoryDetails}>
          <View style={styles.tripHistoryHeader}>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              Ordered Delivered Place Name
            </CustomText>
            <CustomText style={styles.timeText} fontFamily={Fonts.light}>
              2:21 AM
            </CustomText>
          </View>
          <View style={styles.tripHistoryDistance}>
            <CustomText variant="h5" fontFamily={Fonts.semiBold}>
              10 km
            </CustomText>
            <CustomText variant="h5" fontFamily={Fonts.semiBold}>
              ₹100
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RMS(10),
    backgroundColor: Colors.backgroundSecondary,
  },
  modalContainer: {
    marginBottom: RMS(50),
  },
  tripHistoryContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: RMS(10),
    padding: RMS(10),
  },
  tripHistoryDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: RMS(10),
  },
  tripHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RMS(10),
  },
  timeText: {
    color: 'grey',
  },
  tripHistoryDistance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TripHistory;
