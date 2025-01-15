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

import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Colors} from '@utils/Constants';
import Logo from '@assets/images/GOGREEN.png';
import Geolocation from '@react-native-community/geolocation';
import {checkSession} from '@service/authService';
import {resetAndNavigate} from '@navigation/NavigationService';
import {RV} from '@utils/responsive';
import localStorage from '@utils/localstorage';
import {useDispatch, useSelector} from 'react-redux';
import {setRider, setToken} from 'redux/slices/riderSlice';
import {getActiveTrip} from '@service/api';
import {setTrip, setTripStatus, setTripSubstatus} from 'redux/slices/tripSlice';
import {selectIsConnected} from 'redux/slices/networkSlice';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

const IntroScreen = () => {
  const language = localStorage.get('selectedLanguage');
  const dispatch = useDispatch();
  const isConnected = useSelector(selectIsConnected);

  useEffect(() => {
    const requestAuthorization = async () => {
      try {
        Geolocation.requestAuthorization();
        initApp();
      } catch (error) {
        console.log('Location permission denied.');
      }
    };
    requestAuthorization();
  }, []);

  const fetchActiveTrip = async token => {
    try {
      const response = await getActiveTrip(token);

      if (response?.status === 200) {
        const tripData = response?.data[0];
        dispatch(setTrip(tripData));
        dispatch(setTripSubstatus(tripData?.substatus));
        dispatch(setTripStatus(tripData?.status));
      } else {
        console.log(
          'Failed to fetch active trip:',
          response?.status,
          response?.data,
        );
      }
    } catch (error) {
      console.log('Error in fetchActiveTrip:', error.message);
    }
  };

  useEffect(() => {
    const riderData = localStorage.get('rider');
    const token = localStorage.get('st');
    console.log(token, 'INTROSCREEEN');
    console.log(riderData, 'RIDERDATA');

    if (riderData && token) {
      dispatch(setRider(riderData));
      dispatch(setToken(token));
      fetchActiveTrip(token);
    }
  }, [isConnected]);

  const initApp = async () => {
    try {
      const sessionValid = await checkSession();
      console.log(sessionValid, 'SESSION');

      if (!sessionValid) {
        console.log(language, 'Language_Selected');
        if (!language) {
          resetAndNavigate('Localization');
        } else {
          resetAndNavigate('RiderLogin');
        }
      } else if (sessionValid) {
        resetAndNavigate('Main');
      }
    } catch (error) {
      console.log('Error initializing app:', error);
      resetAndNavigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: RV(250),
    width: RV(250),
    resizeMode: 'contain',
  },
});

export default IntroScreen;
