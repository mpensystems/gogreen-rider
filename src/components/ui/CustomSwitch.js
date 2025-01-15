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

import {RMS} from '@utils/responsive';
import {screenWidth} from '@utils/screenDimensions';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectIsOnline,
  setIsDeliveryOnProcess,
  setIsDutyStarted,
  setIsOnlineStatus,
} from 'redux/slices/modalSlice';
import localStorage from '@utils/localstorage';
import {
  setAuthMessageAck,
  setLocationAck,
} from 'redux/slices/riderSlice';
import {selectTrip} from 'redux/slices/tripSlice';

const CustomSwitch = () => {
  const animation = useSharedValue(0);
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);
  const tripData = useSelector(selectTrip);

  const switchWidth = screenWidth * 0.26;
  const circleWidth = switchWidth * 0.25;
  const translateXDistance = switchWidth - circleWidth - 6;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: animation.value}],
    };
  });

  const {t} = useTranslation();

  useEffect(() => {
    console.log('CUSTOM SWITCH CALLED');
  }, []);

  const toggleSwitch = async () => {
    if (tripData) {
      dispatch(setIsDeliveryOnProcess(true));
    } else if (animation.value === 0) {
      animation.value = withTiming(translateXDistance, {duration: 500});
      dispatch(setIsOnlineStatus(true));
      localStorage.set('isOnline', true);
      dispatch(setIsDutyStarted(true));
    } else {
      animation.value = withTiming(0, {duration: 500});
      dispatch(setIsOnlineStatus(false));
      localStorage.set('isOnline', false);
      dispatch(setIsDutyStarted(false));
      dispatch(setAuthMessageAck(null));
      dispatch(setLocationAck(null));
    }
  };

  useEffect(() => {
    const online = localStorage.get('isOnline');

    console.log(
      'Retrieved from local storage:',
      online,
      'Type:',
      typeof online,
    );

    if (online !== null) {
      const isOnlineBoolean = online === true;

      dispatch(setIsOnlineStatus(isOnlineBoolean));
      console.log('Converted to boolean:', isOnlineBoolean);

      animation.value = isOnlineBoolean
        ? withTiming(translateXDistance, {duration: 500})
        : withTiming(0, {duration: 500});
    }
  }, [isOnline]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.subContainer,
          {backgroundColor: isOnline ? 'green' : 'white'},
        ]}
        onPress={toggleSwitch}>
        {isOnline ? (
          <Text style={[styles.text, styles.textLeft, {color: 'white'}]}>
            {t('ONLINE')}
          </Text>
        ) : (
          <Text style={[styles.text, styles.textRight, {color: 'lightgrey'}]}>
            {t('OFFLINE')}
          </Text>
        )}
        <Animated.View
          style={[
            styles.circle,
            animatedStyle,
            {backgroundColor: isOnline ? 'white' : 'lightgrey'},
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: 0,
  },
  subContainer: {
    position: 'relative',
    borderRadius: RMS(30),
    borderWidth: 0.3,
    height: '100%',
    width: '100%',
    borderColor: 'grey',
    justifyContent: 'center',
    padding: 0,
  },
  circle: {
    backgroundColor: 'lightgrey',
    borderRadius: RMS(100),
    height: '80%',
    width: '25%',
    position: 'absolute',
    margin: RMS(3),
  },
  text: {
    position: 'absolute',
    fontSize: RFValue(13),
    fontWeight: 'bold',
  },
  textLeft: {
    left: RMS(20),
  },
  textRight: {
    right: RMS(20),
  },
});

export default CustomSwitch;
