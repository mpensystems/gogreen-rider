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
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';
import {RV} from '@utils/responsive';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from './CustomText';
import {useTranslation} from 'react-i18next';

// Function to request camera permission for Android
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

const ImagePicker = ({placeholder, onImagePicked, imageType, imageUri}) => {
  const {t} = useTranslation();

  const handleImageCapture = async () => {
    console.log('Attempting to capture image...');

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to capture an image.',
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
        console.log('Camera response:', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'An error occurred while capturing the image.');
        } else if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          // setImageUri(image.uri);
          console.log(imageType, 'IMAGETYPE');
          console.log(image.uri, 'IMAGEURI');

          onImagePicked(imageType, image.uri);
        } else {
          console.log('No image selected');
        }
      },
    );
  };

  const clearImage = () => {};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainContainer}
        onPress={handleImageCapture}>
        {imageUri ? (
          <ImageBackground
            source={{uri: imageUri}}
            style={styles.imagePreview}
            imageStyle={{borderRadius: 10}}>
            <View style={styles.overlay} />
            <View style={styles.retakeContainer}>
              <Icon
                name="camera-reverse-outline"
                size={RFValue(30)}
                color="#fff"
              />
              <CustomText
                variant="h6"
                fontFamily={Fonts.light}
                style={styles.retakeText}>
                {t('RETAKE')}
              </CustomText>
            </View>
          </ImageBackground>
        ) : (
          <>
            <Icon
              name="arrow-up-circle-outline"
              size={RFValue(30)}
              color="green"
            />
            <CustomText
              variant="h5"
              fontFamily={Fonts.light}
              style={{color: 'green'}}>
              {placeholder}
            </CustomText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  mainContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: RV(100),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  retakeContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  retakeText: {
    color: '#fff',
    paddingLeft: RFValue(5),
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ImagePicker;
