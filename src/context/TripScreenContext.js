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

import React, {createContext, useContext, useRef} from 'react';
import {Animated, Dimensions} from 'react-native';
import {navigationRef} from '@navigation/NavigationService';

const MinimizeScreenContext = createContext(null);

export const useMinimizeScreen = () => useContext(MinimizeScreenContext);

export const MinimizeScreenProvider = ({children}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const closeScreen = targetScreen => {
    console.log('CALLED CLOSE SCREEN');

    Animated.timing(translateY, {
      toValue: Dimensions.get('window').height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigationRef.navigate(targetScreen);

      translateY.setValue(0);
    });
  };

  return (
    <MinimizeScreenContext.Provider value={{closeScreen, translateY}}>
      {children}
    </MinimizeScreenContext.Provider>
  );
};
