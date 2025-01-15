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

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from '@navigation/Route/StackNavigator';
import {navigationRef, navigate, goBack} from '@navigation/NavigationService';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StepProgressProvider} from 'context/ProgressContext';
import NetInfo from '@react-native-community/netinfo'; // To track internet status
import {setNetworkStatus} from 'redux/slices/networkSlice';
import {useDispatch} from 'react-redux';

const AppNavigationContainer = () => {
  const [currentScreen, setCurrentScreen] = useState(null);

  const dispatch = useDispatch();

  // Monitor the internet connection status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && currentScreen !== 'NoInternetError') {
        dispatch(setNetworkStatus(false));
        navigate('NoInternetError');
        setCurrentScreen('NoInternetError');
      } else if (state.isConnected && currentScreen === 'NoInternetError') {
        dispatch(setNetworkStatus(true));
        if (navigationRef.canGoBack()) {
          goBack();
        } else {
          navigate('Main');
        }
        setCurrentScreen(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentScreen]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        <StepProgressProvider>
          <StackNavigator />
        </StepProgressProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default AppNavigationContainer;
