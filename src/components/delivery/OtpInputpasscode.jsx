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
import React, {useRef, useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {RMS, RS} from '@utils/responsive';

const OtpInputpasscode = ({onOtpFilled}) => {
  const et1 = useRef(null);
  const et2 = useRef(null);
  const et3 = useRef(null);
  const et4 = useRef(null);
  const et5 = useRef(null);
  const et6 = useRef(null);

  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [f3, setF3] = useState('');
  const [f4, setF4] = useState('');
  const [f5, setF5] = useState('');
  const [f6, setF6] = useState('');

  useEffect(() => {
    const otp = f1 + f2 + f3 + f4 + f5 + f6;
    const allFilled = [f1, f2, f3, f4, f5, f6].every(
      field => field.length === 1,
    );

    if (allFilled) {
      onOtpFilled(otp);
    }
  }, [f1, f2, f3, f4, f5, f6]);

  const handleInputChange = (setter, nextField, prevField, value) => {
    setter(value);
    if (value.length === 1 && nextField) {
      nextField.current.focus();
    } else if (value.length === 0 && prevField) {
      prevField.current.focus();
    }
  };

  const handleKeyPress = (event, setter, currentField, prevField) => {
    if (event.nativeEvent.key === 'Backspace' && !currentField.current.value) {
      if (prevField) {
        setter('');
        prevField.current.focus();
      }
    }
  };

  return (
    <View style={styles.otpView}>
      <TextInput
        ref={et1}
        value={f1}
        style={[
          styles.inputView,
          {borderColor: f1.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF1, et2, null, txt)}
        onKeyPress={event => handleKeyPress(event, setF1, et1, null)}
      />
      <TextInput
        ref={et2}
        value={f2}
        style={[
          styles.inputView,
          {borderColor: f2.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF2, et3, et1, txt)}
        onKeyPress={event => handleKeyPress(event, setF2, et2, et1)}
      />
      <TextInput
        ref={et3}
        value={f3}
        style={[
          styles.inputView,
          {borderColor: f3.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF3, et4, et2, txt)}
        onKeyPress={event => handleKeyPress(event, setF3, et3, et2)}
      />
      <TextInput
        ref={et4}
        value={f4}
        style={[
          styles.inputView,
          {borderColor: f4.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF4, et5, et3, txt)}
        onKeyPress={event => handleKeyPress(event, setF4, et4, et3)}
      />
      <TextInput
        ref={et5}
        value={f5}
        style={[
          styles.inputView,
          {borderColor: f5.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF5, et6, et4, txt)}
        onKeyPress={event => handleKeyPress(event, setF5, et5, et4)}
      />
      <TextInput
        ref={et6}
        value={f6}
        style={[
          styles.inputView,
          {borderColor: f6.length >= 1 ? 'grey' : '#000'},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF6, null, et5, txt)}
        onKeyPress={event => handleKeyPress(event, setF6, et6, et5)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  otpView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputView: {
    width: RS(35),
    height: RS(50),
    borderBottomWidth: RMS(2.5),
    borderBottomColor: '#666666',
    margin: RMS(3),
    textAlign: 'center',
    fontSize: RMS(35),
    fontWeight: '700',
    color: 'black',
  },
});

export default OtpInputpasscode;
