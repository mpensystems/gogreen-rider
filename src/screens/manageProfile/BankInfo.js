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

import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import CustomText from '@components/ui/CustomText';
import CustomInput from '@components/ui/CustomInput';
import {Colors, Fonts} from '@utils/Constants';
import CustomSafeAreaView from '@components/ui/CustomSafeAreaView';
import CustomButton from '@components/ui/CustomButton';
import ImagePicker from '@components/ui/ImagePicker';
import {RMS, RS, RV} from '@utils/responsive';
import {goBack} from '@navigation/NavigationService';
import {useStepProgress} from 'context/ProgressContext';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {SuccessToast} from 'react-native-toast-message';
import {
  fetchOnboardingDetails,
  submitOnboardingDetails,
  uploadFiles,
} from '@service/api';
import {handleError} from '@utils/errorHadler';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectImages,
  selectRider,
  selectRiderDetails,
  selectToken,
  setImage,
  setRirderDetails,
} from 'redux/slices/riderSlice';
import {showSuccessToast} from '@utils/successHandler';
import {fetchImagesAction, FetchRiderKyc} from 'redux/actions/riderAction';

const RiderBankDetailsForm = () => {
  const [formValues, setFormValues] = useState(riderDetails || {});
  const {t} = useTranslation();

  const st = useSelector(selectToken);

  const rider = useSelector(selectRider);
  const riderDetails = useSelector(selectRiderDetails);
  const images = useSelector(selectImages);
  const dispatch = useDispatch();

  const [files, setFiles] = useState({
    cancelled_cheque: null,
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const dataFetchedRef = useRef(false);
  console.log(riderDetails, 'RIDER_BANK_INFO))');
  console.log(images.cancelledCheque);

  useEffect(() => {
    if (riderDetails) {
      setFormValues(riderDetails);
    }
  }, [riderDetails]);

  const handleInputChange = (name, value) => {
    console.log(value, 'IMGE');

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

  const handleImagePicked = (type, uri) => {
    console.log(uri, 'URIIIIII');
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

  const isFormValid = () => {
    return (
      formValues.bank_ac && formValues.bank_ifsc && formValues.bank_ac_name
      // riderDetails.bank_ac && riderDetails.bank_ifsc && riderDetails.bank_ac_name
    );
  };

  const handleSubmit = async () => {
    try {
      if (isFormValid()) {
        const {cancelled_cheque, ...data} = formValues;

        const requestData = {
          ...data,
          mobile: rider.mobile,
          country_code: '+91',
        };
        console.log(data, 'DATAA');

        const response = await submitOnboardingDetails(requestData, st);

        if (response?.status === 200) {
          // advanceStep(3);
          const updatedData = response?.data;
          dispatch(setRirderDetails(updatedData)); // This will only update the first_name field
          // dispatch(setRiderDetailField({ key: name, value: value }));  // This will only update the first_name field

          goBack();

          // navigate('RiderKycForm');
          SuccessToast(null, t);
          console.log('Form Values:', formValues);
          showSuccessToast(null, t);
        } else {
          console.log(response.data, 'ERROR_SIDE');

          handleError(response);
        }
      }
    } catch (error) {
      console.log(error, 'ERROR_CATCH');

      handleError(error);
    }
  };

  useEffect(() => {
    if (!images?.cancelled_cheque && riderDetails?.cancelled_cheque) {
      const imageIds = [
        {id: riderDetails?.cancelled_cheque, key: 'cancelled_cheque'},
      ];
      const token = st;

      dispatch(fetchImagesAction(imageIds, token));
    }
  }, [dispatch, riderDetails]);

  return (
    <CustomSafeAreaView>
      <KeyboardAwareScrollView
        buttomOffset={62}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <CustomInput
            onChangeText={text => handleInputChange('bank_ac', text)}
            value={formValues?.bank_ac}
            // value={riderDetails?.bank_ac}
            placeholder={t('BANK_DETAILS_ACCOUNT_NUMBER')}
            onClear={() => handleClear('bank_ac')}
          />
          <CustomInput
            onChangeText={text => handleInputChange('bank_ifsc', text)}
            value={formValues?.bank_ifsc}
            // value={riderDetails?.bank_ifsc}
            placeholder={t('BANK_DETAILS_IFSC_CODE')}
            onClear={() => handleClear('bank_ifsc')}
          />
          <CustomInput
            onChangeText={text => handleInputChange('bank_ac_name', text)}
            value={formValues?.bank_ac_name}
            // value={formValues?.bank_ac_name}
            placeholder={t('BANK_DETAILS_ACCOUNT_HOLDER_NAME')}
            onClear={() => handleClear('bank_ac_name')}
          />

          {/* Uncomment this section if needed */}
          <View style={styles.uploadContainerSingle}>
            <View style={styles.row}>
              <View style={styles.number}>
                <CustomText variant="h4" fontFamily={Fonts.light}>
                  1
                </CustomText>
              </View>
              <View style={styles.titleContainerFullWidth}>
                <CustomText variant="h5" fontFamily={Fonts.light}>
                  {t('BANK_DETAILS_CANCELLED_CHEQUE')}
                </CustomText>
              </View>
            </View>
            <View style={styles.upload}>
              <ImagePicker
                placeholder={t('BANK_DETAILS_UPLOAD_CANCELLED_CHEQUE')}
                onImagePicked={handleImagePicked}
                imageType="cancelled_cheque"
                imageUri={images.cancelled_cheque}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Footer placed outside the scroll view */}
      <View style={styles.footer}>
        <CustomButton
          onPress={handleSubmit}
          title={t('CONTINUE')}
          disabled={!isFormValid()}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
  },
  container: {
    padding: RMS(10),
  },
  footer: {
    padding: RMS(10),
    justifyContent: 'center',
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
  uploadContainerSingle: {
    width: '100%',
    paddingBottom: RMS(30),
    borderColor: Colors.border,
    marginBottom: RMS(15),
    marginTop: RMS(15),
  },
  upload: {
    flexDirection: 'row',
    gap: RMS(10),
  },
});

export default RiderBankDetailsForm;
