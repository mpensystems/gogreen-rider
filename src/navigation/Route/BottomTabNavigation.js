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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RFValue} from 'react-native-responsive-fontsize';
import {RMS, RS, RV} from '@utils/responsive';
import TopTabNavigation from './TopTabNavigation';
import home from '../../assets/icons/ihome.png';
import history from '../../assets/icons/history.png';
import Filledhome from '../../assets/icons/ohome.png';
import historyfilled from '../../assets/icons/historyfilled.png';
import more from '../../assets/icons/more.png';
import morefilled from '../../assets/icons/morefilled.png';
import DeliveryDashboard from '../../screens/DeliveryDashboard';
import {Image, Platform, View, StyleSheet} from 'react-native';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import DeliveryHeader from '@components/delivery/DeliveryHeader';
import ProfileScreen from '../../screens/manageProfile/ProfileScreen';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();

// Helper function to generate styles dynamically
const getIconStyle = focused => ({
  tintColor: focused ? 'green' : 'grey',
  ...styles.icon,
});

// Separate components for Tab Icons
const HomeIcon = ({focused}) => (
  <Image
    source={focused ? Filledhome : home}
    resizeMode="contain"
    style={getIconStyle(focused)}
  />
);

const HistoryIcon = ({focused}) => (
  <Image
    source={focused ? historyfilled : history}
    resizeMode="contain"
    style={getIconStyle(focused)}
  />
);

const MoreIcon = ({focused}) => (
  <Image
    source={focused ? morefilled : more}
    resizeMode="contain"
    style={getIconStyle(focused)}
  />
);

const BottomNavigation = ({navigation}) => {
  const {t} = useTranslation();

  const screenOptions = {
    headerShown: false,
    tabBarLabelStyle: {
      fontSize: RFValue(10),
      fontWeight: 'bold',
      color: 'grey',
    },
    tabBarStyle: {
      paddingTop: Platform.OS === 'ios' ? 5 : 10,
      paddingBottom: Platform.OS === 'ios' ? 20 : 5,
      backgroundColor: 'white',
      height: Platform.OS === 'android' ? 50 : 80,
    },
  };

  const renderLabel = label => (
    <View style={styles.label}>
      <CustomText variant="h6" fontFamily={Fonts.light}>
        {label}
      </CustomText>
    </View>
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="DeliveryStack"
        component={DeliveryDashboard}
        options={{
          tabBarIcon: HomeIcon,
          tabBarLabel: t('DELIVERY_FEEDS'),
        }}
      />
      <Tab.Screen
        name="History"
        component={TopTabNavigation}
        options={{
          tabBarIcon: HistoryIcon,
          tabBarLabel: t('EARNINGS'),
          headerShown: true,
          header: () => <DeliveryHeader />,
        }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{
          tabBarIcon: MoreIcon,
          tabBarLabel: t('MORE'),
          headerShown: true,
          header: () => <DeliveryHeader />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: RV(25),
    width: RS(30),
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: RMS(6),
  },
});

export default BottomNavigation;
