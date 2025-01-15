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

import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera} from 'react-native-image-picker';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {RMS, RS, RV} from '@utils/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
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

const OrderVerification = ({onImagePicked}) => {
  const {t} = useTranslation();
  const [images, setImages] = useState([]);

  const handleImageCapture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to take a photo.',
      );
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        cameraType: 'front',
        includeBase64: false,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'An error occurred while capturing the image.');
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          const newImageType = `Item Image ${images.length + 1}`;

          const updatedImages = [
            ...images,
            {type: newImageType, uri: imageUri},
          ];
          setImages(updatedImages);
          onImagePicked(newImageType, imageUri);
        }
      },
    );
  };

  const handleRetake = async index => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to take a photo.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        cameraType: 'front',
        includeBase64: false,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'An error occurred while capturing the image.');
        } else if (response.assets && response.assets.length > 0) {
          const newImageUri = response.assets[0].uri;

          setImages(prevImages => {
            const updatedImages = [...prevImages];
            updatedImages[index].uri = newImageUri;
            onImagePicked(updatedImages[index].type, newImageUri);
            return updatedImages;
          });
        }
      },
    );
  };

  useEffect(() => {
    if (images.length > 0) {
      onImagePicked(images[images.length - 1]);
    }
  }, [images]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageHeader}>
          <View style={styles.iconContainer}>
            <Icon name="camera-outline" size={RFValue(25)} color="#555555" />
          </View>
          <CustomText
            variant="h4"
            style={styles.imageHeaderText}
            fontFamily={Fonts.light}>
            {t('TAKE_PHOTO_OF_ITEMS')}
          </CustomText>
        </View>
        <View style={styles.imageButtonContainer}>
          {images.length !== 0 &&
            images.map((imagesObj, index) => (
              <View key={index} style={styles.imagePreviewContainer}>
                <View style={styles.imagePreviewWrapper}>
                  <Image
                    source={{uri: imagesObj.uri}}
                    style={styles.imagePreview}
                  />
                </View>
                <View style={styles.imageInfoContainer}>
                  <CustomText variant="h5" fontFamily={Fonts.light}>
                    {t('ITEM_PHOTO')} {index + 1}
                  </CustomText>
                  <View style={styles.uploadedInfoContainer}>
                    <Icon
                      name="check-circle"
                      color="green"
                      size={RFValue(20)}
                    />
                    <CustomText
                      variant="h5"
                      style={styles.uploadedText}
                      fontFamily={Fonts.light}>
                      {t('UPLOADED')}
                    </CustomText>
                  </View>
                </View>
                <View style={styles.retakeButtonContainer}>
                  <Icon name="camera-outline" color="grey" size={RFValue(15)} />
                  <TouchableOpacity
                    onPress={() => handleRetake(index)}
                    activeOpacity={0.7}>
                    <CustomText variant="h5" fontFamily={Fonts.light}>
                      {t('RETAKE')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          <CustomButton
            onPress={handleImageCapture}
            backgroundColor="#007fbf"
            title={
              images && images.length !== 0
                ? t('TAKE MORE PHOTOS')
                : t('TAKE_PHOTO_OF_ITEMS_CAPS')
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    borderWidth: 1,
    marginTop: RMS(50),
    borderColor: Colors.border,
    padding: RMS(10),
    borderRadius: RMS(5),
    flexDirection: 'column',
  },
  imagePreview: {
    width: RS(100),
    height: RV(80),
    borderRadius: RMS(5),
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
    marginBottom: RMS(10),
  },
  imageHeaderText: {
    color: Colors.text,
  },
  imageButtonContainer: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: RMS(10),
  },
  iconContainer: {
    borderRadius: RMS(50),
    height: RV(30),
    width: RS(35),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    gap: RMS(10),
    alignItems: 'center',
    flex: 1,
    paddingBottom: RMS(10),
  },
  imagePreviewWrapper: {
    height: RV(80),
    width: RS(100),
    borderRadius: RMS(5),
  },
  imageInfoContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  uploadedInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(3),
  },
  uploadedText: {
    color: 'green',
  },
  retakeButtonContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    height: RV(25),
    width: RS(80),
    alignItems: 'center',
    justifyContent: 'center',
    gap: RMS(5),
    borderColor: Colors.border,
    borderRadius: RMS(5),
  },
});

export default OrderVerification;
