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
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomButton from '@components/ui/CustomButton';
import {navigate} from '@navigation/NavigationService';
import {useStepProgress} from '../../context/ProgressContext';
import {useTranslation} from 'react-i18next';
import CustomBackButton from '@components/ui/CustomBackButton.js';
import localStorage from '@utils/localstorage';
const OnboardingDetails = () => {
  const {currentStep, completedSteps, advanceStep} = useStepProgress();
  const {t} = useTranslation();

  useEffect(() => {
    const loadProgress = () => {
      const savedStep = localStorage.get('currentStep');
      console.log(parseInt(savedStep), 'SAVEDSTEP');
      console.log(currentStep, 'CURREM');
      console.log(completedSteps, 'COMPLETED_STEPS');

      if (savedStep) {
        advanceStep(parseInt(savedStep));
      }
    };
    loadProgress();
  }, [advanceStep]);

  const navigateToForm = step => {
    if (step === 1) {
      navigate('RiderPersonalInfoForm');
    } else if (step === 2) {
      navigate('RiderVehicleForm');
    } else if (step === 3) {
      navigate('RiderBankDetailsForm');
    } else if (step === 4) {
      navigate('RiderKycForm');
    }
  };

  const stepTitles = [
    {
      step: 1,
      title: t('PERSONAL_DETAILS_TITLE'),
      description: t('PERSONAL_DETAILS_DESCRIPTION'),
      icon: 'lock-closed-sharp',
    },
    {
      step: 2,
      title: t('VEHICLE_DETAILS_TITLE'),
      description: t('VEHICLE_DETAILS_DESCRIPTION'),
      icon: 'lock-closed-sharp',
    },
    {
      step: 3,
      title: t('BANK_DETAILS_TITLE'),
      description: t('BANK_DETAILS_DESCRIPTION'),
      icon: 'lock-closed-sharp',
    },
    {
      step: 4,
      title: t('DOCUMENTS_TITLE'),
      description: t('DOCUMENTS_DESCRIPTION'),
      icon: 'lock-closed-sharp',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <CustomBackButton />
        </View>

        <CustomText
          variant="h3"
          fontFamily={Fonts.light}
          style={{color: 'white'}}>
          {t('WELCOME')}
        </CustomText>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>
        <View style={styles.borderContainer}>
          <View style={styles.border} />
          <CustomText variant="h5" fontFamily={Fonts.light}>
            {t('COMPLETE_STEPS')}
          </CustomText>
          <View style={styles.border} />
        </View>

        {/* Step Items */}
        {stepTitles.map(({step, title, description, icon}) => (
          <TouchableOpacity
            key={step}
            style={styles.detailsContainer}
            onPress={() => navigateToForm(step)}
            disabled={step > currentStep}>
            {console.log(step, 'STEP')}
            {console.log(currentStep, 'CURRENTSTEP')}
            <View style={styles.iconContainer}>
              {completedSteps.includes(step) ? (
                <Icon name="checkmark" color="green" size={RFValue(25)} />
              ) : step === currentStep ? (
                <CustomText variant="h2" fontFamily={Fonts.light}>
                  {step}
                </CustomText>
              ) : (
                <Icon name={icon} color="#D3D3D3" size={RFValue(22)} />
              )}
            </View>
            <View style={styles.title}>
              <CustomText variant="h5" fontFamily={Fonts.light}>
                {title}
              </CustomText>
              <CustomText
                style={{color: 'grey'}}
                variant="h6"
                fontFamily={Fonts.light}>
                {description}
              </CustomText>
            </View>
            <Icon
              name="chevron-forward-sharp"
              color="grey"
              size={RFValue(20)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={t('CONTINUE')}
          onPress={() => navigateToForm(currentStep)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: RV(100),
    gap: RMS(10),
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: RMS(20),
  },
  body: {
    padding: RMS(20),
  },
  borderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RMS(50),
  },
  border: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginHorizontal: RMS(10),
  },
  detailsContainer: {
    marginTop: RV(20),
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: RMS(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    height: RV(50),
    width: RS(50),
    borderRadius: RMS(100),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    padding: RMS(10),
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: RMS(20),
    paddingBottom: RV(30),
  },
});

export default OnboardingDetails;
