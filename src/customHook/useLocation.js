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

import {useState} from 'react';
import {check, request, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {permission} from '@utils/Permission';
import {Alert} from 'react-native';

const useLocation = () => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const checkAndRequestPermission = async () => {
    try {
      const status = await check(permission.location);
      if (status === RESULTS.GRANTED) {
        setPermissionStatus(status);
        setIsPermissionDenied(false);
        return status;
      }

      const requestStatus = await request(permission.location);
      setPermissionStatus(requestStatus);

      if (requestStatus !== RESULTS.GRANTED) {
        setIsPermissionDenied(true); // Permission is denied
      } else {
        setIsPermissionDenied(false);
      }

      return requestStatus;
    } catch (error) {
      console.error('Error checking or requesting permission:', error);
      return null;
    }
  };

  const getLocation = async () => {
    try {
      await checkAndRequestPermission();

      if (permissionStatus !== RESULTS.GRANTED) {
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);
        },
        error => {
          console.error('Error getting location:', error.code, error.message);
          Alert.alert('Error', 'Unable to retrieve location.');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error in getLocation:', error);
      Alert.alert(
        'Error',
        'Something went wrong while trying to access the location.',
      );
    }
  };

  return {
    location,
    getLocation,
    permissionStatus,
    isPermissionDenied,
  };
};

export default useLocation;
