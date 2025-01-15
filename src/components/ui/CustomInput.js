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
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {RMS, RS, RV} from '@utils/responsive';

const CustomInput = ({
  onClear,
  left,
  right = true,
  value,
  maxLength,
  editable = true,
  style,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (value?.length === 0) {
      setIsFocused(false);
    }
  };

  return (
    <View style={[styles.container, !editable && styles.readOnly]}>
      {left}
      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.placeholder,
            (isFocused || value?.length > 0) && styles.placeholderFocused,
          ]}>
          {placeholder}
        </Text>
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholder=""
          value={value}
          editable={editable}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
      {value?.length > 0 && right && !editable && (
        <TouchableOpacity onPress={onClear} style={styles.icon}>
          {editable && (
            <Icon name="close-circle-sharp" size={RS(16)} color="#ccc" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RMS(10),
    borderWidth: 0.5,
    width: '100%',
    marginVertical: RV(10),
    backgroundColor: '#fff',
    shadowOffset: {width: RS(1), height: RV(1)},
    shadowOpacity: 0.6,
    shadowRadius: RMS(2),
    shadowColor: Colors.border,
    borderColor: Colors.border,
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    height: RV(50),
    fontFamily: Fonts.semiBold,
    fontSize: RMS(12),
    paddingVertical: RV(15),
    paddingHorizontal: RS(10),
    color: Colors.text,
    borderColor: 'transparent',
  },
  placeholder: {
    position: 'absolute',
    left: RS(10),
    top: RV(15),
    fontSize: RMS(12),
    color: '#ccc',
    transition: 'all 0.2s ease',
  },
  placeholderFocused: {
    top: RV(0),
    fontSize: RMS(10),
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RS(10),
  },
  readOnly: {
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
});

export default CustomInput;
