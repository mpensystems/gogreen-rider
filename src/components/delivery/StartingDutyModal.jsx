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
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import {RMS, RV} from '@utils/responsive';
import React, {useRef, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectISDutyStarted,
  selectIsOnline,
  setIsDutyStarted,
  setIsOnlineStatus,
} from 'redux/slices/modalSlice';
import {selectAuthMessageAck, selectLocationAck} from 'redux/slices/riderSlice';
import localStorage from '@utils/localstorage';
import {useTranslation} from 'react-i18next';
import {selectTrip} from 'redux/slices/tripSlice';

const StartingDutyModal = () => {
  const screenWidth = Dimensions.get('window').width;
  const barWidth = screenWidth * 0.6;

  const translateX = useRef(new Animated.Value(-barWidth)).current;
  const isDutyStarted = useSelector(selectISDutyStarted);

  const dispatch = useDispatch();

  const isOnline = useSelector(selectIsOnline);
  const authAck = useSelector(selectAuthMessageAck);
  const locationAck = useSelector(selectLocationAck);
  const activeTrip = useSelector(selectTrip);
  const {t} = useTranslation();

  useEffect(() => {
    if (isOnline && authAck !== null && locationAck !== null) {
      dispatch(setIsDutyStarted(false));
    }
  }, [isOnline, authAck, locationAck]);

  // Handle timeout if neither condition is true after 1 minute
  useEffect(() => {
    if (isOnline && !activeTrip) {
      const timeout = setTimeout(() => {
        if (authAck === null && locationAck === null) {
          Alert.alert(t('TIMEOUT'), t('TIMEOUT_MESSAGE'), [
            {
              text: t('OK'),
              onPress: () =>
                dispatch(
                  setIsDutyStarted(false),
                  dispatch(
                    setIsOnlineStatus(false),
                    localStorage.set('isOnline', false),
                  ),
                ),
            },
          ]);
        }
      }, 60000);

      return () => clearTimeout(timeout);
    }
  }, [isDutyStarted, authAck, locationAck, isOnline, activeTrip]);

  useEffect(() => {
    if (isDutyStarted) {
      const startAnimation = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: screenWidth,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -barWidth,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      };

      startAnimation();
    }

    return () => translateX.stopAnimation();
  }, [isDutyStarted, screenWidth, barWidth, translateX]);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isDutyStarted}
      onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <CustomText variant="h3" fontFamily={Fonts.light}>
            {t('STARTING_DUTY')}
          </CustomText>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.movingBar,
                {width: barWidth, transform: [{translateX}]},
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: '100%',
    padding: RMS(20),
    backgroundColor: 'white',
    borderTopLeftRadius: RMS(20),
    borderTopRightRadius: RMS(20),
    alignItems: 'center',
    gap: RMS(20),
  },
  progressBarBackground: {
    width: '100%',
    height: RV(4),
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  movingBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 4,
  },
  loadingText: {
    marginTop: RMS(10),
    fontSize: 16,
  },
});

export default StartingDutyModal;
