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
import {View, StyleSheet, Platform, Image} from 'react-native';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import CustomButton from '@components/ui/CustomButton';
import ImagePicker from '@components/ui/ImagePicker';
import CustomDropdown from '@components/ui/CustomDropdown';
import {RMS, RS, RV} from '@utils/responsive';
import {Colors, Fonts} from '@utils/Constants';
import {navigate} from '@navigation/NavigationService';
import {useStepProgress} from 'context/ProgressContext';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import CustomDatePicker from '@components/ui/CustomDatePicker';
import {token_storage} from 'redux/storage';
import localStorage from '@utils/localstorage';
import {
  fetchOnboardingDetails,
  getFiles,
  submitOnboardingDetails,
  uploadFiles,
} from '@service/api';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectImages,
  selectRider,
  selectRiderDetails,
  selectToken,
  setImage,
  setRirderDetails,
} from 'redux/slices/riderSlice';
import {handleError} from '@utils/errorHadler';
import {showSuccessToast} from '@utils/successHandler';
import {fetchImagesAction, FetchRiderKyc} from 'redux/actions/riderAction';

const RiderVehicleForm = () => {
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
  //   // rc_front: '',
  //   // rc_back: '',
  //   // license_front: '',
  //   // license_back: '',
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
  //   pan: '',
  // });

  const [formValues, setFormValues] = useState(riderDetails || {});
  const [files, setFiles] = useState({
    rc_front: null,
    rc_back: null,
    license_front: null,
    license_back: null,
  });

  const {advanceStep, currentStep} = useStepProgress();
  const {t} = useTranslation();
  const st = localStorage.get('st');

  const [selectedVehicleType, setSelectedVehicleType] = useState('');
 
  const rider = useSelector(selectRider);
  const riderDetails = useSelector(selectRiderDetails);
  const images = useSelector(selectImages);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (riderDetails) {
      setFormValues(riderDetails);
      setSelectedVehicleType(riderDetails?.vehicle_type);
    }
  }, [riderDetails]);

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
    const fetchOnboardingData = async () => {
      if (dataLoaded) return;
      try {
        const response = await fetchOnboardingDetails(st);
        console.log(response, 'FETCHCCC');

        if (response.status === 200) {
          const initialData = {
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            address_line1: response.data.address_line1 || '',
            address_line2: response.data.address_line2 || '',
            flat_no: response.data.flat_no || '',
            zipcode: response.data.zipcode || '',
            city: response.data.city || '',
            state: response.data.state || '',
            gender: response.data.gender || '',
            dob: response.data.dob || '',
            vehicle_no: response.data.vehicle_no || '',
            // rc_front: response.data.rc_copy_front || '',
            // rc_back: response.data.rc_copy_back || '',
            // license_front: response.data.drivers_license_front || '',
            // license_back: response.drivers_license_front || '',
            drivers_license_expiry: response.data.drivers_license_expiry || '',
            vehicle_type: response.data.vehicle_type || '',
            is_electric: response.data.is_electric || '',
            fueled_propulsion: response.data.fueled_propulsion || '',
            bank_ac: response.data.bank_ac || '',
            bank_ifsc: response.data.bank_ifsc || '',
            bank_ac_name: response.data.bank_ac_name || '',
            // cancelled_cheque: response.data.cancelled_cheque || '',
            photo_id_type: response.data.photo_id_type || '',
            pan_no: response.data.pan_no || '',
            aadhar_no: response.data.aadhar_no || '',
            // id_front: response.data.photo_id_front,
            // id_back: response.data.photo_id_back || '',
            // utility_bill: response.data.utility_bill || '',
            // user_photo: response.data.photo || '',
            pan: response.data.pan_copy || '',
          };
          setFormValues(initialData);
          setFiles(prevValues => ({
            ...prevValues,
            rc_front: response.data.rc_copy_front || '',
            rc_back: response.data.rc_copy_back || '',
            license_front: response.data.drivers_license_front || '',
            license_back: response.data.drivers_license_back || '',
          }));
          setSelectedVehicleType(response?.data?.vehicle_type);
          setDataLoaded(true);
          setInitialFormValues(initialData);
        } else {
          handleError(response);
        }
      } catch (error) {
        handleError(error);
      }
    };

    // fetchOnboardingData();
  }, [st]);

  const handleInputChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClear = field => {
    setFormValues(prevValues => ({
      ...prevValues,
      [field]: '',
    }));
  };
  // console.log(formValues,"FORMVALUES");

  const hasFormChanged = () => {
    return JSON.stringify(formValues) !== JSON.stringify(initialFormValues);
  };
  const handleSubmit = async () => {
    if (!hasFormChanged()) {
      console.log('No changes detected. Skipping submission.');
      navigate('RiderBankDetailsForm');
      return;
    }
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
          showSuccessToast(null, t);
          const updatedData = response?.data;
          dispatch(setRirderDetails(updatedData));
          // advanceStep(2);
          navigate('RiderBankDetailsForm');
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

  console.log(formValues,"FORMVALUES_VEHICLE");
  

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

  useEffect(() => {
    if (isFormValid() && currentStep <= 2) {
      advanceStep(2);
    }
    
  }, [formValues, advanceStep]);

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

      // Handle platform-specific file path
      const fileUri =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');

      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: `${type}.jpg`,
      });

      console.log('CALLED_UPLOAD_FILE_@');

      const response = await uploadFiles(formData, st, type);
      console.log(response?.data,"VEHICLE_UPLOAD_IMAGE_RESPONSE");
      
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
    if ((!images?.rc_back && riderDetails?.rc_copy_back) || (!images?.rc_front && riderDetails?.rc_copy_front) || (!images?.license_front && riderDetails?.drivers_license_front) || (!images?.license_back && riderDetails?.drivers_license_back) ) {
      const imageIds = [
        {id: riderDetails?.rc_copy_back, key: 'rc_back'},
        {id: riderDetails?.rc_copy_front, key: 'rc_front'},
        {id: riderDetails?.drivers_license_front, key: 'license_front'},
        {id: riderDetails?.drivers_license_back, key: 'license_back'},
      ];
      const token = st; // Replace with your actual token

      dispatch(fetchImagesAction(imageIds, token));
    }
  }, [dispatch,riderDetails]);

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
                placeholder={t('VEHICLE_DETAILS_VEHICLE_NUMBER')}
                // onClear={() => handleClear('vehicle_no')}
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

export default RiderVehicleForm;
