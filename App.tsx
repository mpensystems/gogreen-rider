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

import React, {useEffect, useState} from 'react';
import AppNavigationContainer from '@navigation/NavigationContainer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {initDatabase} from 'database/initDatabase';
import Providers from './src/providers/providers';
import 'intl-pluralrules';
import './src/screens/Others/i18n';
import PermissionModal from '@components/ui/PermissionModal';
import useAppState from 'customHook/useAppState';
import {useSelector} from 'react-redux';
import {selectIsModalVisible} from 'redux/slices/modalSlice';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import EmergencyHelp from 'screens/Others/EmergencyHelp';
import GlobalModalProvider from 'providers/GlobalModalProviders';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isModalVisible = useSelector(selectIsModalVisible);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  //used to check the appState
  useAppState();
  const backgroundColor = '#ffffff';
  const isLightBackground = backgroundColor === '#ffffff';

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle={isLightBackground ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor} // Effective only on Android
        translucent={Platform.OS === 'ios'}
        hidden={false}
      />

      {/* On iOS, ensure content doesn't overlap the status bar */}
      {Platform.OS === 'ios' && <View style={styles.iosStatusBar} />}
      <Providers>
        <AppNavigationContainer />
      </Providers>
      <Toast />


      <GlobalModalProvider />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  iosStatusBar: {
    height: Platform.OS === 'ios' ? 44 : 0, 
    backgroundColor: 'transparent',
  },
});

export default App;
