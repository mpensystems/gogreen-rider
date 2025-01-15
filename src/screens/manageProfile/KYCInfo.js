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
import ImagePicker from '@components/ui/ImagePicker';
import CustomButton from '@components/ui/CustomButton';
import {RMS, RS, RV} from '@utils/responsive';
import {Colors, Fonts} from '@utils/Constants';
import {goBack} from '@navigation/NavigationService';
import {useStepProgress} from 'context/ProgressContext';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import localStorage from '@utils/localstorage';
import {
  fetchOnboardingDetails,
  getFiles,
  submitOnboardingDetails,
  uploadFiles,
} from '@service/api';
import {handleError} from '@utils/errorHadler';
import {showSuccessToast} from '@utils/successHandler';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectImages,
  selectRider,
  selectRiderDetails,
  setImage,
  setRirderDetails,
} from 'redux/slices/riderSlice';
import {fetchImagesAction, FetchRiderKyc} from 'redux/actions/riderAction';

const KYCInfo = () => {
  const [formValues, setFormValues] = useState(riderDetails || {});

  const {t} = useTranslation();
  const st = localStorage.get('st');

  const rider = useSelector(selectRider);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [selectedIdType, setSelectedIdType] = useState('');

  const [files, setFiles] = useState({
    id_front: null,
    id_back: null,
    utility_bill: null,
    user_photo: null,
    pan: null,
  });

  const {advanceStep, currentStep} = useStepProgress();
  const dispatch = useDispatch();
  const riderDetails = useSelector(selectRiderDetails);
  const images = useSelector(selectImages);

  useEffect(() => {
    if (riderDetails) {
      setFormValues(riderDetails);
    }
  }, [riderDetails]);

  const handleValueChange = item => {
    setSelectedIdType(item);
    setFormValues(prevValues => ({
      ...prevValues,
      photo_id_type: item,
    }));
  };

  const idProof = [
    t('DOCUMENTS_ID_OPTION_AADHARCARD'),
    t('DOCUMENTS_ID_OPTION_PANCARD'),
    t('Voters Id'),
    t('DOCUMENTS_ID_OPTION_PASSPORT'),
  ];

  const placeholder = t('DOCUMENTS_ID_TYPE');

  const handleInputChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClear = name => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: '',
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isFormValid()) {
        const {id_front, id_back, utility_bill, user_photo, pan, ...data} =
          formValues;

        const requestData = {
          ...data,
          mobile: rider.mobile,
          country_code: '+91',
        };
        console.log(requestData, 'REQUESTEDATA');

        // const data = {...formValues, mobile: rider.mobile, country_code: '+91'};
        const response = await submitOnboardingDetails(requestData, st);
        console.log(response, 'RESPONSE');

        if (response?.status === 200) {
          showSuccessToast(null, t);
          const updatedData = response?.data;
          dispatch(setRirderDetails(updatedData)); // This will only update the first_name field
          // advanceStep(4);
          // resetAndNavigate('Main');
          goBack();
        } else {
          handleError(response);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const uploadFile = async (type, uri) => {
    try {
      const formData = new FormData();
      console.log('CALLED_UPLOAD_FILE');

      const fileUri =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');

      // Handle platform-specific file path
      const fileExtension = uri.split('.').pop();
      const mimeType = fileExtension === 'jpg' ? 'image/jpeg' : 'image/png'; // Handle other formats as needed

      formData.append('file', {
        uri: fileUri,
        type: mimeType,
        name: `${type}.${fileExtension}`,
      });
      console.log('CALLED_UPLOAD_FILE_@');

      console.log(formData, 'FORMDATA');
      console.log(st, 'ST');
      console.log(type, 'TYPE');

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
      console.log(error, 'ERROR');

      handleError(error);
      handleClearImages(type);
    }
  };

  const handleClearImages = type => {
    setFormValues(prevValues => ({
      ...prevValues,
      [type]: null, // Clear the specific image type
    }));
  };

  const handleImagePicked = (type, uri) => {
    console.log(type, 'TYPE', uri);

    uploadFile(type, uri);

    if (uri) {
      const imageId = type;
      const base64data = uri;

      dispatch(setImage({imageId, base64data}));
    }
  };

  const isFormValid = () => {
    // Check if required fields are present
    const areRequiredFieldsFilled =
      images.id_front &&
      formValues.aadhar_no &&
      formValues.pan_no &&
      images.utility_bill &&
      images.user_photo &&
      images.pan;

    // Check if the Aadhaar number is valid
    const isAadharValid = aadhar => {
      const aadharRegex = /^\d{12}$/;
      return aadharRegex.test(aadhar);
    };

    // Check if the PAN number is valid
    const isPanValid = pan => {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panRegex.test(pan);
    };

    // Final validation check
    return (
      areRequiredFieldsFilled &&
      isPanValid(formValues.pan_no) &&
      isAadharValid(formValues.aadhar_no)
    );
  };

  useEffect(() => {
    if (
      (!images?.utility_bill && riderDetails?.utility_bill) ||
      (!images?.id_front && riderDetails?.photo_id_front) ||
      (!images?.id_back && riderDetails?.photo_id_back) ||
      (!images?.user_photo && riderDetails?.photo) ||
      (!images?.pan && riderDetails?.pan_copy && st)
    ) {
      const imageIds = [
        {id: riderDetails?.photo_id_front, key: 'id_front'},
        {id: riderDetails?.photo_id_back, key: 'id_back'},
        {id: riderDetails?.utility_bill, key: 'utility_bill'},
        {id: riderDetails?.photo, key: 'user_photo'},
        {id: riderDetails?.pan_copy, key: 'pan'},
      ];
      const token = st;

      dispatch(fetchImagesAction(imageIds, token));
    }
  }, [dispatch, riderDetails]);

  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView
        buttomOffset={62}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.uploadContainer}>
            <View style={styles.row}>
              <View style={styles.number}>
                <CustomText variant="h4" fontFamily={Fonts.light}>
                  1
                </CustomText>
              </View>
              <View style={styles.titleContainer}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {t('DOCUMENTS_PROOF_OF_IDENTITY' || 'Aadhar Card ')}
                </CustomText>
              </View>
            </View>
            <View style={styles.upload}>
              <ImagePicker
                placeholder={t('FRONT_SIDE')}
                onImagePicked={handleImagePicked}
                imageType="id_front"
                // imageUri={images.id_front}
                imageUri={images.id_front}
              />
              <ImagePicker
                placeholder={t('BACK_SIDE')}
                onImagePicked={handleImagePicked}
                imageType="id_back"
                // imageUri={images.id_back}
                imageUri={images.id_back}
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
                  {t('DOCUMENTS_UTILITY_BILL')}
                </CustomText>
                <CustomText
                  style={styles.subtitle}
                  variant="h5"
                  fontFamily={Fonts.light}>
                  {t('DOCUMENTS_UTILITY_BILL_DESCRIPTION')}
                </CustomText>
              </View>
            </View>
            <View style={styles.uploadSingle}>
              <ImagePicker
                placeholder="Front Side"
                onImagePicked={handleImagePicked}
                imageType="utility_bill"
                // imageUri={images.utility_bill}
                imageUri={images.utility_bill}
              />
            </View>
          </View>
          <View style={styles.uploadContainerSingle}>
            <View style={styles.row}>
              <View style={styles.number}>
                <CustomText variant="h4" fontFamily={Fonts.light}>
                  3
                </CustomText>
              </View>
              <View style={styles.titleContainerFullWidth}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {t('DOCUMENTS_PAN_CARD')}
                </CustomText>
              </View>
            </View>
            <View style={styles.uploadSingle}>
              <ImagePicker
                placeholder={t('FRONT_SIDE')}
                onImagePicked={handleImagePicked}
                imageType="pan"
                // imageUri={images.pan}
                imageUri={images.pan}
              />
            </View>
          </View>

          <View style={styles.uploadContainerSingle}>
            <View style={styles.row}>
              <View style={styles.number}>
                <CustomText variant="h4" fontFamily={Fonts.light}>
                  4
                </CustomText>
              </View>
              <View style={styles.titleContainerFullWidth}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {t('SELFIE')}
                </CustomText>
              </View>
            </View>
            <View style={styles.uploadSingle}>
              <ImagePicker
                placeholder={t('FRONT_SIDE')}
                onImagePicked={handleImagePicked}
                imageType="user_photo"
                // imageUri={images.user_photo}
                imageUri={images.user_photo}
              />
            </View>
          </View>
          <View style={styles.uploadContainerSingle}>
            <View style={styles.row}>
              <View style={styles.number}>
                <CustomText variant="h4" fontFamily={Fonts.light}>
                  5
                </CustomText>
              </View>
              <View style={styles.titleContainerFullWidth}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {t('IDENTITY_DOCUMENTATION')}
                </CustomText>
              </View>
            </View>

            <CustomInput
              onChangeText={text => handleInputChange('aadhar_no', text)}
              value={formValues?.aadhar_no}
              placeholder={t('AADHAR_NUMBER')}
              onClear={() => handleClear('aadhar_no')}
            />
            <CustomInput
              onChangeText={text => handleInputChange('pan_no', text)}
              value={formValues?.pan_no}
              placeholder={t('PAN_NUMBER')}
              onClear={() => handleClear('pan_no')}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <CustomButton
            onPress={handleSubmit}
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
    padding: RMS(20),
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: RMS(100),
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
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleContainerFullWidth: {
    flex: 1,
  },
  subtitle: {
    color: '#ccc',
  },
  uploadContainer: {
    width: '100%',
    paddingBottom: RMS(30),
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: RMS(15),
    marginTop: RMS(15),
  },
  uploadContainerSingle: {
    width: '100%',
    paddingBottom: RMS(30),
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: RMS(15),
    marginTop: RMS(15),
  },
  uploadSingle: {
    width: '100%',
  },
  upload: {
    width: '100%',
    flexDirection: 'row',
    gap: RMS(10),
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: RMS(10),
  },
  conditionalUpload: {width: '100%', flexDirection: 'row', gap: RMS(10)},
});

export default KYCInfo;
