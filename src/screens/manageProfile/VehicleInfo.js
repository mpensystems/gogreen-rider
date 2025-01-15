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
import {View, StyleSheet, Platform} from 'react-native';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import CustomButton from '@components/ui/CustomButton';
import ImagePicker from '@components/ui/ImagePicker';
import CustomDropdown from '@components/ui/CustomDropdown';
import {RMS, RS, RV} from '@utils/responsive';
import {Colors, Fonts} from '@utils/Constants';
import {goBack} from '@navigation/NavigationService';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import CustomDatePicker from '@components/ui/CustomDatePicker';
import localStorage from '@utils/localstorage';
import {
  fetchOnboardingDetails,
  submitOnboardingDetails,
  uploadFiles,
} from '@service/api';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectImages,
  selectRider,
  selectRiderDetails,
  setImage,
  setRirderDetails,
} from 'redux/slices/riderSlice';
import {handleError} from '@utils/errorHadler';
import {showSuccessToast} from '@utils/successHandler';
import {fetchImagesAction, FetchRiderKyc} from 'redux/actions/riderAction';

const VehicleInfo = () => {
  const [formValues, setFormValues] = useState(riderDetails || {});

  const [files, setFiles] = useState({
    rc_front: null,
    rc_back: null,
    license_front: null,
    license_back: null,
  });

  const {t} = useTranslation();
  const st = localStorage.get('st');

  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const rider = useSelector(selectRider);
  const riderDetails = useSelector(selectRiderDetails);
  const images = useSelector(selectImages);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useDispatch();

  const vehicleTypeOptions = [
    t('VEHICLE_DETAILS_VEHICLE_OPTION_0'), // Electric Bike
    t('VEHICLE_DETAILS_VEHICLE_OPTION_1'), // Petrol Bike
    t('VEHICLE_DETAILS_VEHICLE_OPTION_2'), // Bicycle
    t('VEHICLE_DETAILS_VEHICLE_OPTION_3'), // Horse
    t('VEHICLE_DETAILS_VEHICLE_OPTION_4'), // Segway
    t('VEHICLE_DETAILS_VEHICLE_OPTION_5'), // Hoverboard
    t('VEHICLE_DETAILS_VEHICLE_OPTION_6'), // Other
  ];

  useEffect(() => {
    if (riderDetails) {
      setFormValues(riderDetails);
      setSelectedVehicleType(riderDetails?.vehicle_type);
    }
  }, [riderDetails]);

  const handleInputChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isFormValid()) {
        const {rc_front, rc_back, license_front, license_back, ...data} =
          formValues;

        const requestData = {
          ...data,
          mobile: rider.mobile,
          country_code: '+91',
        };

        console.log(requestData, 'ONBOARDING_VEHICLE_DETAILS');

        const response = await submitOnboardingDetails(requestData, st);
        console.log(response, 'RESPONSE_PERSONALDETAILS');

        if (response?.status === 200) {
          const updatedData = response?.data;
          dispatch(setRirderDetails(updatedData));
          showSuccessToast(null, t);

          goBack();
        } else {
          handleError(response);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleImagePicked = (type, uri) => {
    console.log(uri, 'URIIIIII');
    console.log(type, 'TYPE', uri, 'URI');

    uploadFile(type, uri);

    setFormValues(prevValues => ({
      ...prevValues,
      [type]: uri,
    }));
    if (uri) {
      const imageId = type;
      const base64data = uri;

      dispatch(setImage({imageId, base64data}));
    }
  };

  const handleValueChange = value => {
    setSelectedVehicleType(value);
    console.log('VEHICLE_TYPE', value);

    handleInputChange('vehicle_type', value);
  };

  const isFormValid = () => {
    const isElectricOrPetrol =
      selectedVehicleType === t('VEHICLE_DETAILS_VEHICLE_OPTION_0') || // Electric Bike
      selectedVehicleType === t('VEHICLE_DETAILS_VEHICLE_OPTION_1'); // Petrol Bike

    // Check if required fields for electric or petrol bikes are filled
    const requiredFieldsFilled =
      formValues.vehicle_no &&
      formValues.rc_copy_front &&
      formValues.drivers_license_front &&
      formValues.drivers_license_expiry &&
      formValues.vehicle_type;

    if (isElectricOrPetrol) {
      return requiredFieldsFilled;
    }

    return selectedVehicleType !== '';
  };

  const onchangeDate = date => {
    setFormValues(prevValues => ({
      ...prevValues,
      drivers_license_expiry: date,
    }));
    console.log(date);
  };

  const uploadFile = async (type, uri) => {
    try {
      const formData = new FormData();
      console.log('CALLED_UPLOAD_FILE');

      const fileUri =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');

      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: `${type}.jpg`,
      });

      console.log('CALLED_UPLOAD_FILE_@');

      const response = await uploadFiles(formData, st, type);
      if (response?.status === 200) {
        dispatch(FetchRiderKyc(st));
        showSuccessToast(t('Image have been submitted successfully!'), t);
      } else {
        console.log(response.error.data, 'UPLOAD_FILES_ERROR');

        handleError(response);
        handleClearImages(type);
      }
    } catch (error) {
      handleError(error);
      handleClearImages(type);
    }
  };

  const handleClearImages = type => {
    setFormValues(prevValues => ({
      ...prevValues,
      [type]: null,
    }));
  };

  useEffect(() => {
    if (
      (!images?.rc_back && riderDetails?.rc_copy_back) ||
      (!images?.rc_front && riderDetails?.rc_copy_front) ||
      (!images?.license_front && riderDetails?.drivers_license_front) ||
      (!images?.license_back && riderDetails?.drivers_license_back)
    ) {
      const imageIds = [
        {id: riderDetails?.rc_copy_back, key: 'rc_back'},
        {id: riderDetails?.rc_copy_front, key: 'rc_front'},
        {id: riderDetails?.drivers_license_front, key: 'license_front'},
        {id: riderDetails?.drivers_license_back, key: 'license_back'},
      ];
      const token = st;

      dispatch(fetchImagesAction(imageIds, token));
    }
  }, [dispatch, riderDetails]);

  return (
    <CustomSafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        buttomOffset={62}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <CustomDropdown
            placeholder={t('VEHICLE_DETAILS_VEHICLE_TYPE')}
            data={vehicleTypeOptions}
            initialValue={
              formValues?.vehicle_type || t('VEHICLE_DETAILS_VEHICLE_TYPE')
            }
            selectedValue={formValues?.vehicle_type}
            onValueChange={handleValueChange}
          />

          {(selectedVehicleType === t('VEHICLE_DETAILS_VEHICLE_OPTION_0') ||
            selectedVehicleType === t('VEHICLE_DETAILS_VEHICLE_OPTION_1')) && (
            <>
              <CustomInput
                onChangeText={text => handleInputChange('vehicle_no', text)}
                value={formValues.vehicle_no}
                // value={riderDetails.vehicle_no}

                placeholder={t('VEHICLE_DETAILS_VEHICLE_NUMBER')}
              />

              <View style={styles.uploadContainerSingle}>
                <View style={styles.row}>
                  <View style={styles.number}>
                    <CustomText variant="h4" fontFamily={Fonts.light}>
                      1
                    </CustomText>
                  </View>
                  <View style={styles.titleContainerFullWidth}>
                    <CustomText variant="h5" fontFamily={Fonts.light}>
                      {t('VEHICLE_DETAILS_RC_COPY')}
                    </CustomText>
                    <CustomText
                      style={styles.subtitle}
                      variant="h5"
                      fontFamily={Fonts.light}>
                      {t('VEHICLE_DETAILS_MANDATORY')}
                    </CustomText>
                  </View>
                </View>
                <View style={styles.upload}>
                  <ImagePicker
                    placeholder={t('FRONT_SIDE')}
                    onImagePicked={handleImagePicked}
                    imageType="rc_front"
                    // imageUri={formValues.rc_front}
                    imageUri={images.rc_front}
                  />
                  <ImagePicker
                    placeholder={t('BACK_SIDE')}
                    onImagePicked={handleImagePicked}
                    imageType="rc_back"
                    // imageUri={formValues.rc_back}
                    imageUri={images.rc_back}
                  />
                </View>
              </View>

              <View style={styles.uploadContainerSingle}>
                <View style={styles.row}>
                  <View style={styles.number}>
                    <CustomText variant="h4" fontFamily={Fonts.light}>
                      2
                    </CustomText>
                  </View>
                  <View style={styles.titleContainerFullWidth}>
                    <CustomText variant="h5" fontFamily={Fonts.light}>
                      {t('LICENSE_TITLE')}
                    </CustomText>
                    <CustomText
                      style={styles.subtitle}
                      variant="h5"
                      fontFamily={Fonts.light}>
                      {t('LICENSE_MANDATORY')}
                    </CustomText>
                  </View>
                </View>
                <View style={styles.upload}>
                  <ImagePicker
                    placeholder={t('FRONT_SIDE')}
                    onImagePicked={handleImagePicked}
                    imageType="license_front"
                    // imageUri={formValues.license_front}
                    imageUri={images.license_front}
                  />
                  <ImagePicker
                    placeholder={t('FRONT_SIDE')}
                    onImagePicked={handleImagePicked}
                    imageType="license_back"
                    // imageUri={formValues.license_back}
                    imageUri={images.license_back}
                  />
                </View>
                <View style={styles.dateContainer}>
                  <CustomDatePicker
                    initialDate={formValues.drivers_license_expiry}
                    // initialDate={riderDetails.drivers_license_expiry}

                    style={{height: RV(50)}}
                    placeholder={t('LICENSE_EXPIRY')}
                    onchangeDate={onchangeDate}
                  />
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.footer}>
          <CustomButton
            title={t('CONTINUE')}
            onPress={handleSubmit}
            disabled={!isFormValid()}
          />
        </View>
      </KeyboardAwareScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: RMS(5),
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: RMS(20),
  },
  number: {
    height: RV(25),
    width: RS(25),
    backgroundColor: 'lightgrey',
    borderRadius: RMS(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RMS(10),
  },
  titleContainerFullWidth: {
    flex: 1,
  },
  subtitle: {
    color: '#ccc',
  },
  uploadContainerSingle: {
    width: '100%',
    paddingBottom: RMS(30),
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: RMS(15),
    marginTop: RMS(15),
  },
  upload: {
    flexDirection: 'row',
    gap: RMS(10),
    paddingRight: RMS(10),
  },
  dateContainer: {
    flexDirection: 'row',
    gap: RMS(10),
    paddingTop: RMS(10),
  },
  footer: {
    padding: RMS(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleInfo;
