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
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import LiveHeader from '../LiveHeader';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {RMS, RS, RV} from '@utils/responsive';
import {navigate} from '@navigation/NavigationService';
import {fetchOnboardingDetails, getFiles, uploadFiles} from '@service/api';
import {useTranslation} from 'react-i18next';
import {handleError} from '@utils/errorHadler';
import {
  selectRider,
  selectRiderDetails,
  selectToken,
} from 'redux/slices/riderSlice';
import {useDispatch, useSelector} from 'react-redux';
import {FetchRiderKyc} from 'redux/actions/riderAction';

const sections = [
  {title: 'Personal Info', icon: 'account-outline', path: 'PersonalInfoEdit'},
  {title: 'Vehicle Info', icon: 'motorbike', path: 'VehicleInfoEdit'},
  {title: 'Bank Info', icon: 'bank', path: 'BankInfoEdit'},
  {title: 'KYC Info', icon: 'file-document-outline', path: 'KycInfoEdit'},
];

const Profile = () => {
  const [imageUri, setImageUri] = useState({user_photo: ''});
  const [files, setFiles] = useState({user_photo: null});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const rider = useSelector(selectRider);

  const {t} = useTranslation();
  const st = useSelector(selectToken);
  const riderDetails = useSelector(selectRiderDetails);
  const dispatch = useDispatch();
  console.log(riderDetails, 'RIDER_DATA__');

  console.log(st, 'ST_PROFILE');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t('CAMERA_PERMISSION_TITLE'),
            message: t('CAMERA_PERMISSION_MESSAGE'),
            buttonNeutral: t('CAMERA_PERMISSION_BUTTON_LATER'),
            buttonNegative: t('CANCEL'),
            buttonPositive: t('OK'),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const fetchKycData = async () => {
    if (st && !riderDetails) {
      try {
        const response = await dispatch(FetchRiderKyc(st));
        console.log(response, 'RESPONSE_DISPATCH');
        if (response?.status === 200) {
          setImageUri(response.data.photo || '');
          setFiles(prevValues => ({
            ...prevValues,
            user_photo: response.data.photo || '',
          }));
          setDataLoaded(true);
          console.log('KYC data fetched successfully:', response.data);
        } else {
          console.error('Error in fetching KYC:', response);
        }
      } catch (error) {
        console.error('Error in fetchKycData:', error);
      }
    }
  };
  useEffect(() => {
    fetchKycData();
  }, [st]);

  const uploadFile = async (type, uri) => {
    try {
      const formData = new FormData();
      const fileUri =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');
      const fileExtension = uri.split('.').pop();
      const mimeType = fileExtension === 'jpg' ? 'image/jpeg' : 'image/png';

      formData.append('file', {
        uri: fileUri,
        type: mimeType,
        name: `${type}.${fileExtension}`,
      });

      const response = await uploadFiles(formData, st, type);
      if (response?.status === 200) {
        setImageUri({...imageUri, [type]: uri});
        setFiles(prevValues => ({...prevValues, [type]: uri}));
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
    setImageUri(null);
  };

  const handleImageCapture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(t('CAMERA_PERMISSION_TITLE'), t('CAMERA_PERMISSION_MESSAGE'));
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'An error occurred while capturing the image.');
        } else if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          setImageUri({user_photo: image.uri});
          uploadFile('user_photo', image.uri);
        }
      },
    );
  };

  const fetchSingleFile = async (fileId, key) => {
    try {
      const response = await getFiles(fileId, st);

      if (response && response.status === 200) {
        const imageBlob = response.data;

        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve({[key]: base64data});
          };
          reader.readAsDataURL(imageBlob);
        });
      } else {
        console.error(`Error fetching image for ${key}:`, response.status);
        return {[key]: null};
      }
    } catch (error) {
      console.error(`Error occurred while fetching ${key}:`, error);
      return {[key]: null};
    }
  };

  const fetchFileAndSetImageUri = async () => {
    const fileId = rider?.photo;
    const key = 'photo';

    if (!fileId) return;

    try {
      const result = await fetchSingleFile(fileId, key);

      if (result[key]) {
        setImageUri(prev => ({...prev, [key]: result[key]}));
      }
    } catch (error) {
      console.error('Error setting image URI:', error);
    }
  };

  useEffect(() => {
    fetchFileAndSetImageUri();
  }, []);

  return (
    <View style={styles.container}>
      <LiveHeader hideHelp={true} title="Profile" />
      {loading ? ( // Loading indicator
        <ActivityIndicator size="large" color="#0073cf" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerSection}>
            <View style={styles.imageSection}>
              <Image
                source={
                  imageUri?.photo
                    ? {uri: imageUri?.photo}
                    : require('../../assets/images/OIP.jpg')
                }
                style={styles.image}></Image>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    borderColor: '#0073cf',
                    alignItems: 'center',
                  },
                ]}
                onPress={handleImageCapture}>
                <CustomText
                  variant="h5"
                  fontFamily={Fonts.light}
                  style={{color: '#0073cf'}}>
                  {t('CHANGE_PROFILE')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sections List */}
          {sections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contentSection}
              onPress={() => navigate(section.path)}>
              <View style={styles.contentHeaderSection}>
                <View style={styles.iconContainer}>
                  <View style={styles.leftContainer}>
                    <View style={styles.icon}>
                      <Icon
                        name={section.icon}
                        size={RFValue(20)}
                        color="grey"
                      />
                    </View>
                    <CustomText variant="h4" fontFamily={Fonts.light}>
                      {section.title}
                    </CustomText>
                  </View>
                  <Icon name="chevron-right" size={RFValue(20)} color="grey" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.deleteAccount}>
            <CustomText
              variant="h5"
              fontFamily={Fonts.light}
              style={styles.btn}>
              {t('DEACTIVATE_ACCOUNT')}
            </CustomText>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: RMS(20),
  },
  headerSection: {
    height: RV(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    borderWidth: 0.5,
    // borderColor: 'red',
    borderRadius: RMS(100),
    height: RV(120),
    width: RS(120),
    marginBottom: RMS(10),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: RMS(100),
  },
  contentSection: {
    padding: RMS(10),
    marginBottom: RMS(10),
  },
  contentHeaderSection: {
    borderWidth: 1,
    height: RV(50),
    borderColor: Colors.border,
    borderRadius: RMS(10),
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: RMS(5),
  },
  leftContainer: {
    gap: RMS(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAccount: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    padding: RMS(10),
  },
  buttonContainer: {
    width: '50%',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: RMS(50),
    height: RV(30),
    width: RS(35),
  },
  btn: {
    color: '#CD5C5C',
    borderWidth: 0.5,
    padding: RMS(10),
    borderRadius: RMS(5),
    borderColor: '#CD5C5C',
  },
});

export default Profile;
