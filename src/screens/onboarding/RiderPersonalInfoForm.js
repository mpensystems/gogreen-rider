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
import {View, StyleSheet} from 'react-native';
import CustomInput from '@components/ui/CustomInput';
import {navigate} from '@navigation/NavigationService';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import CustomButton from '@components/ui/CustomButton';
import {RMS, RV} from '@utils/responsive';
import {useStepProgress} from '../../context/ProgressContext';
import {useTranslation} from 'react-i18next';
import CustomDropdown from '@components/ui/CustomDropdown';
import {Colors} from '@utils/Constants';
import localStorage from '@utils/localstorage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {fetchOnboardingDetails, submitOnboardingDetails} from '@service/api';
import {CITY_STATE_PIN_DATA} from '@utils/CITY_STATE_PIN_DATA';
import CustomText from '@components/ui/CustomText';
import {token_storage} from 'redux/storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectRider,
  selectRiderDetails,
  selectToken,
  setRirderDetails,
} from 'redux/slices/riderSlice';
import CustomDatePicker from '@components/ui/CustomDatePicker';
import {handleError} from '@utils/errorHadler';
import {showSuccessToast} from '@utils/successHandler';
import {FetchRiderKyc} from 'redux/actions/riderAction';

const RiderPersonalInfoForm = () => {
  // const [formValues, setFormValues] = useState({
  //   first_name: '',
  //   last_name: '',
  //   address_line1: '',
  //   address_line2: '',
  //   flat_no: '',
  //   zipcode: '',
  //   city: '',
  //   state: '',
  //   gender: '',
  //   dob: '',
  //   vehicle_no: '',
  //   drivers_license_expiry: '',
  //   vehicle_type: '',
  //   is_electric: '',
  //   fueled_propulsion: '',
  //   bank_ac: '',
  //   bank_ifsc: '',
  //   bank_ac_name: '',
  //   photo_id_type: '',
  //   pan_no: '',
  //   aadhar_no: '',
  // });
  const [formValues, setFormValues] = useState(riderDetails || {});
  const [initialFormValues, setInitialFormValues] = useState('');

  const {t} = useTranslation();
  const {advanceStep, currentStep} = useStepProgress();
  const [selectedGender, setSelectedGender] = useState('');
  const [isZipcodeValid, setIsZipcodeValid] = useState(true);
  const dispatch = useDispatch();
  const riderDetails = useSelector(selectRiderDetails);
  const st = localStorage.get('st');

  const rider = useSelector(selectRider);

  console.log(st, 'STTTTT');
  console.log(rider, 'rider');

  useEffect(() => {
    if (riderDetails) {
      setFormValues(riderDetails);
    }
  }, [riderDetails]);

  const handleInputChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === 'zipcode') {
      const found = CITY_STATE_PIN_DATA.find(item => item.PINCODE == value);
      if (found) {
        setFormValues(prevValues => ({
          ...prevValues,
          city: found.CITY,
          state: found.STATE,
        }));
        setIsZipcodeValid(true);
      } else {
        setFormValues(prevValues => ({
          ...prevValues,
          city: '',
          state: '',
        }));
        setIsZipcodeValid(false);
      }
    }
  };

  const isFormValid = () => {
    return (
      formValues.first_name &&
      formValues.last_name &&
      formValues.address_line1 &&
      formValues.zipcode &&
      formValues.city &&
      formValues.state &&
      formValues.gender &&
      formValues.flat_no &&
      formValues.dob
    );
  };

  const hasFormChanged = () => {
    return JSON.stringify(formValues) !== JSON.stringify(initialFormValues);
  };

  const handleNext = async () => {
    if (!hasFormChanged()) {
      console.log('No changes detected. Skipping submission.');
      navigate('RiderVehicleForm');
      return;
    }
    try {
      if (isFormValid()) {
        const data = {
          ...formValues,
          country_code: '+91',
          mobile: rider?.mobile,
        };
        console.log(data, 'PERSONALFORMDETAILSDATA');

        const response = await submitOnboardingDetails(data, st);

        if (response?.status === 200) {
          const updatedData = response?.data;

          showSuccessToast(null, t);

          navigate('RiderVehicleForm');
        } else {
          handleError(response);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (isFormValid() && currentStep <= 1) {
      console.log(currentStep, 'CURRENTSTEP');

      advanceStep(1);
    }
  }, [formValues, advanceStep]);

  const handleValueChangeGender = gender => {
    setSelectedGender(gender);
    handleInputChange('gender', gender);
  };

  const genderOptions = [
    t('PERSONAL_DETAILS_GENDER_OPTION_0'),
    t('PERSONAL_DETAILS_GENDER_OPTION_1'),
    t('PERSONAL_DETAILS_GENDER_OPTION_2'),
  ];

  const dateChangeHandler = dob => {
    console.log(dob);

    setFormValues(prevValues => ({
      ...prevValues,
      dob: dob,
    }));
  };

  return (
    <CustomSafeAreaView style={styles.container}>
      <KeyboardAwareScrollView buttomOffset={62}>
        <CustomInput
          onChangeText={text => handleInputChange('first_name', text)}
          value={formValues?.first_name}
          placeholder={t('PERSONAL_DETAILS_FIRST_NAME')}
        />
        <CustomInput
          onChangeText={text => handleInputChange('last_name', text)}
          value={formValues?.last_name}
          placeholder={t('PERSONAL_DETAILS_LAST_NAME')}
        />
        <CustomDropdown
          placeholder="Gender"
          data={genderOptions}
          initialValue={formValues?.gender || t('PERSONAL_DETAILS_GENDER')}
          selectedValue={formValues?.gender}
          onValueChange={handleValueChangeGender}
        />

        <CustomDatePicker
          onchangeDate={dateChangeHandler}
          initialDate={formValues?.dob || ''}
          style={{height: RV(50)}}
          placeholder="DOB"
        />
        <CustomInput
          onChangeText={text => handleInputChange('address_line1', text)}
          value={formValues?.address_line1}
          placeholder={t('PERSONAL_DETAILS_ADDRESS_LINE_1')}
        />
        <CustomInput
          onChangeText={text => handleInputChange('address_line2', text)}
          value={formValues?.address_line2}
          placeholder={t('PERSONAL_DETAILS_ADDRESS_LINE_2')}
        />
        <CustomInput
          onChangeText={text => handleInputChange('flat_no', text)}
          value={formValues?.flat_no}
          placeholder={t('PERSONAL_DETAILS_FLAT_NUMBER')}
        />
        <CustomInput
          onChangeText={text => handleInputChange('zipcode', text)}
          value={formValues?.zipcode}
          placeholder={t('PERSONAL_DETAILS_ZIPCODE')}
        />
        {!isZipcodeValid && (
          <CustomText style={{color: 'red'}}>{t('VALID_ZIPCODE')}</CustomText>
        )}
        <CustomInput
          editable={false}
          onChangeText={text => handleInputChange('city', text)}
          value={formValues?.city}
          placeholder={t('PERSONAL_DETAILS_CITY')}
        />
        <CustomInput
          editable={false}
          onChangeText={text => handleInputChange('state', text)}
          value={formValues?.state}
          placeholder={t('PERSONAL_DETAILS_STATE')}
        />
        {/* </CustomSafeAreaView> */}
        <View style={styles.footer}>
          <CustomButton
            onPress={handleNext}
            title={t('CONTINUE')}
            disabled={!isFormValid()}
          />
        </View>
      </KeyboardAwareScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: RMS(5),
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  footer: {
    padding: RMS(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RiderPersonalInfoForm;
