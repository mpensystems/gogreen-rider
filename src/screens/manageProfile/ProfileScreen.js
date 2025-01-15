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

import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RMS, RS, RV} from '@utils/responsive';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {selectRider, selectToken} from 'redux/slices/riderSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getFiles} from '@service/api';
import profile from '../../assets/images/OIP.jpg';
import {navigate, resetAndNavigate} from '@navigation/NavigationService';
import {clearSession} from '@service/authService';
import {useTranslation} from 'react-i18next';
import localStorage from '@utils/localstorage';
import {setIsOnlineStatus} from 'redux/slices/modalSlice';

const ProfileScreen = () => {
  const rider = useSelector(selectRider);
  const [imageUri, setImageUri] = useState({photo: ''});
  const st = useSelector(selectToken);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleManageProfile = () => {
    navigate('Profile');
  };

  const handleChangeLanguage = () => {
    navigate('Localization');
  };

  const handleLogout = async () => {
    await clearSession();
     localStorage.set('isOnline', false);
    dispatch(setIsOnlineStatus(false));
    localStorage.clear();

    resetAndNavigate('Auth', {screen: 'RiderLogin'});
  };

  const fetchSingleFile = async (fileId, key) => {
    try {
      const response = await getFiles(fileId, st);

      // console.log(response,"RESPONSE_IMAGE");

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
        console.log(`Error fetching image for ${key}:`, response.status);
        return {[key]: null}; 
      }
    } catch (error) {
      console.log(`Error occurred while fetching ${key}:`, error);
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
      console.log('Error setting image URI:', error);
    }
  };

  useEffect(() => {
    fetchFileAndSetImageUri();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headSection}>
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={imageUri?.photo ? {uri: imageUri?.photo} : profile}
              style={styles.image}
            />
          </View>
          <View style={styles.name}>
            <CustomText variant="h4" fontFamily={Fonts.light}>
              {rider?.first_name}
              {rider?.last_name}
            </CustomText>
            <View
              style={{flexDirection: 'row', alignItems: 'center', gap: RMS(5)}}>
              {rider?.kyc_verified === 'approved' ? (
                <>
                  <Icon
                    name="account-check-outline"
                    color="green"
                    size={RFValue(20)}
                  />
                  <CustomText
                    style={{color: 'grey'}}
                    variant="h5"
                    fontFamily={Fonts.light}>
                    {t('KYC_VERIFIED')}
                  </CustomText>
                </>
              ) : (
                <>
                  <Icon
                    name="account-remove-outline"
                    color="darkred"
                    size={RFValue(20)}
                  />

                  <CustomText
                    style={{color: 'grey'}}
                    variant="h5"
                    fontFamily={Fonts.light}>
                    {t('KYC_NOT_VERIFIED')}
                  </CustomText>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.addressContainer}>
          <View style={styles.phoneNumber}>
            <Icon name="cellphone" size={RFValue(21)} color="grey" />
            <CustomText variant="h5" fontFamily={Fonts.light}>
              {rider?.mobile}
            </CustomText>
          </View>
          <View style={styles.area}>
            <Icon name="map-marker-outline" size={RFValue(21)} color="grey" />
            <CustomText variant="h5" fontFamily={Fonts.light}>
              Mumbai
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.mainSection}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleManageProfile}
          accessibilityLabel="Manage Profile">
          <View style={styles.iconContainers}>
            <Icon
              name="account-outline"
              color={Colors.text}
              size={RFValue(20)}
            />
          </View>
          <View style={styles.btnContent}>
            <CustomText variant="h4" fontFamily={Fonts.light}>
              {t('MANAGE_PROFILE')}
            </CustomText>
            <Icon name="chevron-right" color="grey" size={RFValue(20)} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleChangeLanguage}
          accessibilityLabel="Change Language">
          <View style={styles.iconContainers}>
            <Icon
              name="google-translate"
              color={Colors.text}
              size={RFValue(20)}
            />
          </View>
          <View style={styles.btnContent}>
            <CustomText variant="h4" fontFamily={Fonts.light}>
              {t('CHANGE_LANGUAGE')}
            </CustomText>
            <Icon name="chevron-right" color="grey" size={RFValue(20)} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogout}
          accessibilityLabel="Logout">
          <View style={styles.iconContainers}>
            <Icon name="logout" color={Colors.text} size={RFValue(20)} />
          </View>
          <View style={styles.btnContent}>
            <CustomText variant="h4" fontFamily={Fonts.light}>
              {t('LOGOUT')}
            </CustomText>
            <Icon name="chevron-right" color="grey" size={RFValue(20)} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RMS(15),
    backgroundColor: '#fff',
  },
  headSection: {
    height: RV(150),
    width: '100%',
    borderWidth: 1,
    borderRadius: RMS(10),
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  infoContainer: {
    borderBottomWidth: 0.5,
    height: RV(80),
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: RMS(10),
    gap: RMS(10),
  },
  imageContainer: {
    height: RV(60),
    width: RS(60),
    borderRadius: RMS(100),
  },
  image: {
    height: RV(60),
    width: RS(60),
    borderRadius: RMS(100),
  },
  addressContainer: {
    gap: RMS(10),
    padding: RMS(10),
    flex: 1,
  },
  phoneNumber: {
    flexDirection: 'row',
    alignContent: 'center',
    gap: RMS(10),
  },
  area: {
    flexDirection: 'row',
    gap: RMS(10),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
    marginVertical: RMS(10),
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: RMS(10),
    height: RV(50),
    padding: RMS(10),
  },
  iconContainers: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RMS(8),
    borderRadius: 100,
    backgroundColor: Colors.backgroundSecondary,
  },
  mainSection: {
    marginTop: RMS(50),
  },
  btnContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProfileScreen;
