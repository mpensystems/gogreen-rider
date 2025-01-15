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

import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';
import {RS, RV} from '@utils/responsive';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTranslation} from 'react-i18next';

const CustomDatePicker = ({onchangeDate, initialDate, style, placeholder}) => {
  const {t} = useTranslation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = useState(new Animated.Value(0))[0]; // Initialize animated value

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (selectedDate || isFocused) {
      Animated.timing(animatedLabelPosition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedLabelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedDate, isFocused]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const dt = new Date(date);
    const formattedDate = `${dt.getDate()}/${
      dt.getMonth() + 1
    }/${dt.getFullYear()}`;
    setSelectedDate(formattedDate);
    hideDatePicker();
    onchangeDate(formattedDate);
  };

  const labelStyle = {
    position: 'absolute',
    left: RS(15),
    top: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [RV(15), RV(0)],
    }),
    fontSize: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [RS(13), RS(12)],
    }),
    color: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', 'lightgrey'],
    }),
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.datePickerButton, style]}
        onPress={showDatePicker}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !selectedDate && setIsFocused(false)}>
        <Animated.Text style={[styles.dateText, labelStyle]}>
          {placeholder}
        </Animated.Text>
        <Text style={styles.selectedDateText}>{selectedDate}</Text>
        <Icon
          size={RS(25)}
          color="#ccc"
          name={
            isDatePickerVisible ? 'chevron-up-outline' : 'chevron-down-outline'
          }
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  datePickerButton: {
    width: '100%',
    height: RV(40),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: Colors.border,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    position: 'relative',
  },
  dateText: {
    color: 'black',
    fontSize: RFValue(12),
    fontFamily: Fonts.light,
    position: 'absolute',
  },
  selectedDateText: {
    color: 'black',
    fontSize: RFValue(12),
    fontFamily: Fonts.light,
    opacity: 0.8,
  },
});

export default CustomDatePicker;
