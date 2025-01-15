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

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '@utils/Constants';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from './CustomText';

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

const SelfieImagePicker = ({
  onImagePicked,
  title = 'Take a Selfie',
  description = 'Capture your selfie using the front camera',
}) => {
  const [imageUri, setImageUri] = useState(null);

  const handleImageCapture = async () => {
    console.log('Attempting to capture image...');

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to take a selfie.',
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
          setImageUri(image.uri);
          onImagePicked(image);
        } else {
          console.log('No image selected');
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.imagePickerContainer, imageUri && {borderWidth: 0}]}
        onPress={handleImageCapture}>
        {imageUri ? (
          <ImageBackground
            source={{uri: imageUri}}
            style={styles.imagePreview}
            imageStyle={{borderRadius: 10}}>
            <View style={styles.overlay} />
            <View style={styles.retakeContainer}>
              <Icon name="camera-reverse-outline" size={RS(30)} color="#fff" />
              <CustomText
                variant="h6"
                fontFamily={Fonts.light}
                style={styles.retakeText}>
                Retake
              </CustomText>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.subContainer}>
            <CustomText variant="h5" fontFamily={Fonts.semiBold}>
              {description}
            </CustomText>
            <View style={styles.iconContainer}>
              <Icon name="camera-outline" size={RS(40)} color="#227ec8" />
              <CustomText
                variant="h5"
                fontFamily={Fonts.light}
                style={styles.text}>
                Take Selfie
              </CustomText>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: RMS(18),
    marginBottom: RMS(10),
  },
  imagePickerContainer: {
    width: '100%',
    height: RV(170),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#227ec8',
    shadowColor: Colors.border,
    alignSelf: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#eaf2ff',
    alignItems: 'center',
  },
  subContainer: {
    marginTop: RMS(20),
    alignItems: 'center',
  },
  iconContainer: {
    height: RV(40),
    width: RS(130),
    marginTop: RMS(25),
    borderRadius: 13,
    borderColor: '#227ec8',
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#227ec8',
  },
  retakeContainer: {
    position: 'absolute',
    height: RV(40),
    width: RS(100),
    borderRadius: 50,
    backgroundColor: '#227ec8',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    left: RMS(5),
    top: RMS(10),
  },
  retakeText: {
    color: '#fff',
    paddingLeft: RMS(5),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
});

export default SelfieImagePicker;
