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
import RiderPersonalInfoForm from '../../screens/onboarding/RiderPersonalInfoForm';
import RiderKycForm from '../../screens/onboarding/RiderKycForm';
import RiderBankDetailsForm from '../../screens/onboarding/RiderBankDetailsForm';
import RiderVehicleForm from '../../screens/onboarding/RiderVehicleForm';
import StepProgressIndicator from '@components/ui/StepProgressIndicator';
import {useStepProgress} from '../../context/ProgressContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingDetails from '../../screens/onboarding/OnboardingDetails';

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  const {currentStep, completedSteps} = useStepProgress();

  const renderStepProgressHeader = () => (
    <StepProgressIndicator
      currentStep={currentStep}
      completedSteps={completedSteps}
    />
  );

  return (
    <Stack.Navigator initialRouteName="OnboardingDetails">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="OnboardingDetails"
        component={OnboardingDetails}
      />
      <Stack.Screen
        name="RiderPersonalInfoForm"
        component={RiderPersonalInfoForm}
        options={{
          headerTitle: renderStepProgressHeader,
        }}
      />
      <Stack.Screen
        name="RiderKycForm"
        component={RiderKycForm}
        options={{
          headerTitle: renderStepProgressHeader,
        }}
      />
      <Stack.Screen
        name="RiderBankDetailsForm"
        component={RiderBankDetailsForm}
        options={{
          headerTitle: renderStepProgressHeader,
        }}
      />
      <Stack.Screen
        name="RiderVehicleForm"
        component={RiderVehicleForm}
        options={{
          headerTitle: renderStepProgressHeader,
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
