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

import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';

const CustomPayoutModal = ({
  data,
  placeholder,
  selectedValue,
  onValueChange,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (selectedValue !== placeholder) {
      setIsClicked(false);
    }
  }, [selectedValue, placeholder]);

  const handleSelect = item => {
    onValueChange(item);
    setIsClicked(false);
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={item + index.toString()}
      style={styles.listContainer}
      onPress={() => handleSelect(item)}>
      <CustomText variant="h5" fontFamily={Fonts.light}>
        {item}
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => setIsClicked(true)}>
        <CustomText
          variant="h5"
          fontFamily={Fonts.light}
          style={{color: 'black'}}>
          {selectedValue}
        </CustomText>

        <Icon
          size={RS(20)}
          color="#666666"
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
            <View style={styles.header}>
              <CustomText variant="h4" fontFamily={Fonts.light}>
                Select Week
              </CustomText>
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => item + index.toString()}
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
  },
  dropdownSelector: {
    width: '100%',
    height: RV(40),
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
    backgroundColor: '#fff',
    elevation: 5,
  },
  listContainer: {
    width: '100%',
    height: RV(40),
    justifyContent: 'center',
    paddingLeft: RMS(15),
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.border,
    color: Colors.text,
  },
  header: {
    alignItems: 'center',
    padding: RMS(10),
  },
});

export default CustomPayoutModal;
