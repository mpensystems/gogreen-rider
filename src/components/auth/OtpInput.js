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

import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {RMS, RS, RV} from '@utils/responsive';

const OtpInput = ({onOtpFilled}) => {
  const et1 = useRef();
  const et2 = useRef();
  const et3 = useRef();
  const et4 = useRef();
  const et5 = useRef();
  const et6 = useRef();

  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [f3, setF3] = useState('');
  const [f4, setF4] = useState('');
  const [f5, setF5] = useState('');
  const [f6, setF6] = useState('');

  useEffect(() => {
    const allFilled = [f1, f2, f3, f4, f5, f6].every(
      field => field.length === 1,
    );
    const otp = `${f1}${f2}${f3}${f4}${f5}${f6}`;

    onOtpFilled(otp);
  }, [f1, f2, f3, f4, f5, f6, onOtpFilled]);

  const handleInputChange = (setter, nextField, value) => {
    setter(value);
    if (value.length >= 1 && nextField) {
      nextField.current.focus();
    }
  };

  const handleKeyPress = (setter, prevField, value, key) => {
    if (key === 'Backspace' && value.length === 0 && prevField) {
      prevField.current.focus();
    } else if (key === 'Backspace' && value.length > 0) {
      setter('');
    }
  };

  return (
    <View style={styles.otpView}>
      <TextInput
        selectionColor="black"
        ref={et1}
        value={f1}
        style={[
          styles.inputView,
          {borderColor: f1.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF1, et2, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF1, null, f1, nativeEvent.key)
        }
      />
      <TextInput
        selectionColor="black"
        ref={et2}
        value={f2}
        style={[
          styles.inputView,
          {borderColor: f2.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF2, et3, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF2, et1, f2, nativeEvent.key)
        }
      />
      <TextInput
        selectionColor="black"
        ref={et3}
        value={f3}
        style={[
          styles.inputView,
          {borderColor: f3.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF3, et4, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF3, et2, f3, nativeEvent.key)
        }
      />
      <TextInput
        selectionColor="black"
        ref={et4}
        value={f4}
        style={[
          styles.inputView,
          {borderColor: f4.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF4, et5, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF4, et3, f4, nativeEvent.key)
        }
      />
      <TextInput
        selectionColor="black"
        ref={et5}
        value={f5}
        style={[
          styles.inputView,
          {borderColor: f5.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF5, et6, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF5, et4, f5, nativeEvent.key)
        }
      />
      <TextInput
        selectionColor="black"
        ref={et6}
        value={f6}
        style={[
          styles.inputView,
          {borderColor: f6.length >= 1 ? 'black' : '#000', borderWidth: 1},
        ]}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={txt => handleInputChange(setF6, null, txt)}
        onKeyPress={({nativeEvent}) =>
          handleKeyPress(setF6, et5, f6, nativeEvent.key)
        }
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
    width: RS(40),
    height: RV(40),
    borderWidth: RMS(0.5),
    borderRadius: RMS(10),
    margin: RMS(5),
    textAlign: 'center',
    fontSize: RMS(19),
    fontWeight: '700',
    color: 'black',
  },
});

export default OtpInput;
