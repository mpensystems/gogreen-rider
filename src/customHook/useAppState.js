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

import {useEffect, useRef} from 'react';
import {AppState, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {hideModal, selectIsOnline, setGpsStatus} from 'redux/slices/modalSlice';
import DeviceInfo from 'react-native-device-info';

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log(isOnline, 'ISONLINE');

        if (isOnline) {
          // Check for location permission
          const permissionStatus = await check(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );

          if (permissionStatus === RESULTS.GRANTED) {
            // Check if GPS is enabled
            const isLocationEnabled = await DeviceInfo.isLocationEnabled();
            if (isLocationEnabled) {
              console.log('GPS is enabled');
              dispatch(hideModal());
              dispatch(setGpsStatus(false));
            } else {
              console.log('GPS is not disabled');
              dispatch(setGpsStatus(true));
            }
          }
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [isOnline]);
};

export default useAppState;
