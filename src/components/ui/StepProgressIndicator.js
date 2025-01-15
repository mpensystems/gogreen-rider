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
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '@utils/Constants';
import {RMS, RS, RV} from '@utils/responsive';

const StepProgressIndicator = ({currentStep, completedSteps}) => {
  const stepTitles = ['1', '2', '3', '4'];

  console.log(currentStep, 'CURRENTSTEP');
  console.log(completedSteps, 'COMPLETEDSTEPS');

  return (
    <View style={styles.stepContainer}>
      {stepTitles.map((title, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        console.log(isActive, 'ISACTIVE');
        console.log(isCompleted, 'ISCOMPLETED');

        const isCompleted = completedSteps.includes(stepNumber);

        return (
          <View key={stepNumber} style={styles.stepItem}>
            <View style={styles.stepIndicatorContainer}>
              {isCompleted ? (
                <Icon name="checkmark" color="green" size={RFValue(20)} />
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
            {stepNumber !== 4 && (
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
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    width: RV(22),
    height: RV(22),
    borderRadius: RV(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'green',
  },
  stepNumber: {
    fontSize: RFValue(14),
    color: 'grey',
  },
  stepLine: {
    height: RV(2),
    width: RS(50),
    backgroundColor: '#E0E0E0',
    marginHorizontal: RMS(5),
  },
});

export default StepProgressIndicator;
