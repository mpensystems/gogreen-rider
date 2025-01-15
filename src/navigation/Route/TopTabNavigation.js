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

import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DailyEarning from '../../screens/DailyEarning';
import WeeklyEarning from '../../screens/WeeklyEarning';
import MonthlyEarning from '../../screens/MonthlyEarning';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigation = () => {
  const {t} = useTranslation();
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {backgroundColor: 'white'},
        }}>
        <Tab.Screen name={t('DAILY')} component={DailyEarning} />
        <Tab.Screen name={t('WEEKLY')} component={WeeklyEarning} />
        <Tab.Screen name={t('MONTHLY')} component={MonthlyEarning} />
      </Tab.Navigator>
    </View>
  );
};

export default TopTabNavigation;
