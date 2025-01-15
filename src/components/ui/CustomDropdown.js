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

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
} from 'react-native';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';

const CustomDropdown = ({
  data,
  placeholder,
  selectedValue,
  onValueChange,
  style,
  initialValue,
  disabled,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [animatedLabelPosition] = useState(new Animated.Value(0));

  useEffect(() => {
    if (selectedValue !== initialValue) {
      setIsClicked(false);
    }
  }, [selectedValue, initialValue]);

  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: isFocused || selectedValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, selectedValue]);

  const handleSelect = item => {
    onValueChange(item);
    setIsClicked(false);
    setIsFocused(false);
  };

  const labelStyle = {
    position: 'absolute',
    left: RMS(15),
    top: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [RV(15), -RV(0)],
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
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdownSelector, disabled && styles.disabledDropdown]}
        onPress={() => {
          if (!disabled) {
            setIsClicked(true);
            setIsFocused(true);
          }
        }}
        disabled={disabled}>
        {/* Floating Label */}
        <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>

        <CustomText
          variant="h5"
          fontFamily={Fonts.light}
          style={[
            styles.selectedValueText,
            {color: selectedValue ? 'black' : 'transparent'},
          ]}>
          {selectedValue || placeholder || initialValue}
        </CustomText>

        <Icon
          size={RS(25)}
          color="#ccc"
          name={isClicked ? 'chevron-up-outline' : 'chevron-down-outline'}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={isClicked}
        animationType="fade"
        onRequestClose={() => setIsClicked(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.dropDownarea}>
            <FlatList
              data={data}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.listContainer}
                  onPress={() => handleSelect(item)}
                  key={index}>
                  <CustomText variant="h5" fontFamily={Fonts.light}>
                    {item}
                  </CustomText>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: RMS(10),
  },
  dropdownSelector: {
    width: '100%',
    height: RV(50),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: Colors.border,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: RMS(15),
    paddingRight: RMS(15),
    backgroundColor: 'white',
    opacity: 1,
    position: 'relative',
  },
  selectedValueText: {
    paddingTop: RV(10),
  },
  disabledDropdown: {
    backgroundColor: '#f0f0f0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropDownarea: {
    width: '80%',
    maxHeight: RV(300),
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
  },
  listContainer: {
    width: '100%',
    height: RV(40),
    justifyContent: 'center',
    paddingLeft: RMS(15),
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.border,
  },
});

export default CustomDropdown;
