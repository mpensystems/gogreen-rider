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
import React, {useEffect} from 'react';
import {RMS, RS, RV} from '@utils/responsive';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';

const CustomSwipeableButton = ({
  title = 'Swipe to Confirm',
  handleNavigation,
  isOnline = true,
  isKycApproved = true,
}) => {
  const X = useSharedValue(0);
  const maxSlide = RS(250);

  const resetSwipePosition = () => {
    setTimeout(() => {
      X.value = withSpring(0);
    }, 1000);
  };

  const onNavigation = () => {
    handleNavigation();
    resetSwipePosition();
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: e => {
      if (isOnline && isKycApproved) {
        X.value = Math.min(Math.max(0, e.translationX), maxSlide);
      }
    },
    onEnd: () => {
      if (X.value > maxSlide * 0.7) {
        X.value = withSpring(maxSlide);
        runOnJS(onNavigation)();
      } else {
        runOnJS(resetSwipePosition)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: X.value}],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(X.value, [0, maxSlide], [1, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateX: interpolate(
          X.value,
          [0, maxSlide],
          [0, 100],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  useEffect(() => {
    return () => {
      X.value = 0;
    };
  }, [X]);

  const buttonBackgroundColor = isOnline ? 'green' : 'grey';
  const iconColor = isOnline ? 'green' : 'lightgrey';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.buttonContainer,
          {backgroundColor: buttonBackgroundColor},
        ]}>
        <PanGestureHandler onGestureEvent={animatedGestureHandler}>
          <Animated.View style={[styles.sliderContainer, animatedStyle]}>
            <Icon
              name="chevron-triple-right"
              color={iconColor}
              size={RFValue(28)}
            />
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={[styles.textContainer, textStyle]}>
          <CustomText
            variant="h4"
            fontFamily={Fonts.light}
            style={{color: 'white'}}>
            {title}
          </CustomText>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: RV(50),
    paddingLeft: RMS(10),
    paddingRight: RMS(10),
    justifyContent: 'center',
    borderRadius: RMS(10),
    position: 'relative',
    overflow: 'hidden',
  },
  sliderContainer: {
    width: RS(50),
    height: RV(40),
    position: 'absolute',
    left: RMS(5),
    backgroundColor: 'white',
    borderRadius: RMS(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomSwipeableButton;
