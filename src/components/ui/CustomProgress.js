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
import {View, StyleSheet} from 'react-native';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '@utils/Constants';

const StepProgressIndicator = ({currentStep, completedSteps, stepTitles}) => {
  return (
    <View style={styles.stepContainer}>
      {stepTitles.map((title, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        const isCompleted = completedSteps.includes(stepNumber);

        return (
          <View key={stepNumber} style={styles.stepItem}>
            <View style={styles.stepIndicatorContainer}>
              {isCompleted ? (
                <Icon name="checkmark" color="green" size={RFValue(16)} />
              ) : (
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={[
                    styles.stepNumber,
                    {color: isActive ? 'green' : 'grey'},
                  ]}>
                  {title}
                </CustomText>
              )}
            </View>
            {stepNumber !== stepTitles.length && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor:
                      currentStep > stepNumber ? 'green' : '#E0E0E0',
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'green',
  },
  stepNumber: {
    fontSize: RFValue(12),
    color: 'grey',
  },
  stepLine: {
    height: 2,
    width: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 3,
  },
});

export default StepProgressIndicator;
