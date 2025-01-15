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
import NoInternetError from '@components/ui/NoInternet';
import OrderVerification from '@components/ui/OrderVerification';
import OtpScreenDelivery from '../../screens/OtpScreenDelivery';
import PersonalInfo from '../../screens/manageProfile/PersonalInfo';
import BankInfo from '../../screens/manageProfile/BankInfo';
import VehicleInfo from '../../screens/manageProfile/VehicleInfo';
import KYCInfo from '../../screens/manageProfile/KYCInfo';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import AcceptBooking from '../../screens/AcceptBooking';
import PickupLocation from '../../screens/PickupLocation';
import PickOrder from '../../screens/PickOrder';
import DeliveredOrder from '../../screens/DeliveredOrder';
import DeliveryComplete from '../../screens/DeliveryComplete';
import DeliverySuccess from '../../screens/DeliverySuccess';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HelpScreen from '../../screens/HelpScreen';
import ReturnToPickup from '../../screens/ReturnToPickup';
import TripHistory from '../../screens/TripHistory';
import RiderVehicleForm from '../../screens/onboarding/RiderVehicleForm';
import Profile from '../../screens/manageProfile/Profile';
import BottomNavigation from './BottomTabNavigation';
import ProfileScreen from '../../screens/manageProfile/ProfileScreen';
import Localization from '../../screens/Others/Localization';
import OtpScreenPickup from '../../screens/OtpScreenPickup';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomNavigation} />
      <Stack.Screen
        name="AcceptBooking"
        options={{
          headerShown: false,
          presentation: 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
        component={AcceptBooking}
      />
      <Stack.Screen
        name="PickupLocation"
        options={{
          headerShown: false,
          presentation: 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_bottom',
        }}
        component={PickupLocation}
      />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="PickOrder"
        component={PickOrder}
      />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="DeliveredOrder"
        component={DeliveredOrder}
      />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="DeliveryComplete"
        component={DeliveryComplete}
      />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="DeliverySuccess"
        component={DeliverySuccess}
      />
      <Stack.Screen name="NoInternetError" component={NoInternetError} />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="OrderVerification"
        component={OrderVerification}
      />
      <Stack.Screen name="OtpScreenDelivery" component={OtpScreenDelivery} />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Personal Info',
          headerStyle: {
            height: 80,
            borderBottomWidth: 0.5,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            letterSpacing: 1,
            alignSelf: 'center',
          },
        }}
        name="PersonalInfoEdit"
        component={PersonalInfo}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Bank Info',
          headerStyle: {
            height: 80,
            borderBottomWidth: 0.5,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            letterSpacing: 1,
            alignSelf: 'center',
          },
        }}
        name="BankInfoEdit"
        component={BankInfo}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Vehicle Info',
          headerStyle: {
            height: 80,
            borderBottomWidth: 0.5,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            letterSpacing: 1,
            alignSelf: 'center',
          },
        }}
        name="VehicleInfoEdit"
        component={VehicleInfo}
      />
      <Stack.Screen
        name="KycInfoEdit"
        component={KYCInfo}
        options={{
          headerShown: true,
          headerTitle: 'KYC Info',
          headerStyle: {
            height: 80,
            borderBottomWidth: 0.5,
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            letterSpacing: 1,
            alignSelf: 'center',
          },
        }}
      />

      <Stack.Screen name="OnboardingStack" component={OnboardingStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animationEnabled: false,
        }}
        name="ReturnToPickup"
        component={ReturnToPickup}
      />
      <Stack.Screen name="TripHistory" component={TripHistory} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Localization" component={Localization} />
      <Stack.Screen name="OtpScreenPickup" component={OtpScreenPickup} />
      <Stack.Screen name="RiderVehicleForm" component={RiderVehicleForm} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
