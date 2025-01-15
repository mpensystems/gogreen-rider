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

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import DeviceInfo from 'react-native-device-info';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {
  hideModal,
  selectIsModalVisible,
  selectIsOnline,
  setGpsStatus,
  showModal,
} from 'redux/slices/modalSlice';
import {useWs} from './WsProvider';

const LocationContext = createContext(null);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({children}) => {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);
  const isModalVisible = useSelector(selectIsModalVisible);
  const {emit, connectionStatus} = useWs();

  const [location, setLocation] = useState(null);

  const {LocationModule} = NativeModules;

  const checkAndRequestPermission = async () => {
    let permissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (permissionStatus === RESULTS.GRANTED) {
      const gpsEnabled = await DeviceInfo.isLocationEnabled();
      console.log(gpsEnabled, 'GPSENABLED');

      dispatch(setGpsStatus(!gpsEnabled));
      if (gpsEnabled) {
        if (isModalVisible) dispatch(hideModal());
      }
    } else if (permissionStatus === RESULTS.DENIED) {
      const requestResult = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (requestResult === RESULTS.GRANTED) {
        if (isModalVisible) dispatch(hideModal());
      } else if (requestResult === RESULTS.BLOCKED) {
        dispatch(showModal());
      }
    } else if (permissionStatus === RESULTS.BLOCKED) {
      dispatch(showModal());
    }
  };

  const eventListener = useRef(null);

  useEffect(() => {
    const locationServiceEmitter = new NativeEventEmitter(LocationModule);

    const initializeLocationService = async () => {
      try {
        await checkAndRequestPermission();
        console.log('Starting location service...');
        LocationModule?.startLocationService();

        if (!eventListener.current && connectionStatus === 'Connected') {
          eventListener.current = locationServiceEmitter.addListener(
            'LocationUpdate',
            event => {
              const {latitude, longitude} = event;
              setLocation({lat: latitude, lng: longitude});
              console.log('Location received', latitude, longitude);
              emit({
                cmd: 'loc',
                id: 'LOCATIONACK',
                p: {lat: latitude, lng: longitude},
              });
            },
          );
          console.log('Event listener set up for LocationUpdate');
        }
      } catch (error) {
        console.error('Error initializing location service:', error);
      }
    };

    const cleanupListener = () => {
      if (eventListener.current) {
        console.log('CLEANING_UP_LOCATION_SERVICE');
        eventListener.current.remove();
        eventListener.current = null;
        LocationModule?.stopLocationService();
        LocationModule?.removeListeners(1);
      }
    };

    if (isOnline && connectionStatus === 'Connected') {
      initializeLocationService();
    } else if (eventListener?.current) {
      cleanupListener();
    }

    return cleanupListener;
  }, [isOnline, connectionStatus]);

  useEffect(() => {
    const checkListenersCount = async () => {
      try {
        const count = await LocationModule.getListenersCount();
        console.log('Current number of listeners:', count);
      } catch (error) {
        console.error('Error fetching listeners count:', error);
      }
    };

    checkListenersCount();
  }, []);

  return (
    <LocationContext.Provider value={useMemo(() => ({location}), [location])}>
      {children}
    </LocationContext.Provider>
  );
};
