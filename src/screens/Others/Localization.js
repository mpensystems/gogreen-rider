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
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {RMS} from '@utils/responsive';
import CustomButton from '@components/ui/CustomButton';
import {resetAndNavigate} from '@navigation/NavigationService';
import {useTranslation} from 'react-i18next';
import localStorage from '@utils/localstorage';

const Localization = () => {
  const {i18n} = useTranslation();
  const [selectedValue, setSelectedValue] = useState('en');

  const languages = [
    {name: 'English', nativeName: 'English', languageCode: 'en'},
    {name: 'Hindi', nativeName: 'हिन्दी', languageCode: 'hi'},
    {name: 'Bengali', nativeName: 'বাংলা', languageCode: 'bn'},
    {name: 'Telugu', nativeName: 'తెలుగు', languageCode: 'te'},
    {name: 'Kannada', nativeName: 'ಕನ್ನಡ', languageCode: 'kn'},
    {name: 'Marathi', nativeName: 'मराठी', languageCode: 'mr'},
    {name: 'Tamil', nativeName: 'தமிழ்', languageCode: 'ta'},
    {name: 'Urdu', nativeName: 'اردو', languageCode: 'ur'},
    {name: 'Gujarati', nativeName: 'ગુજરાતી', languageCode: 'gu'},
    {name: 'Malayalam', nativeName: 'മലയാളം', languageCode: 'ml'},
    {name: 'Odia', nativeName: 'ଓଡ଼ିଆ', languageCode: 'or'},
  ];

  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const savedLanguage = await localStorage.get('selectedLanguage');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
          setSelectedValue(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading selected language:', error);
      }
    };
    loadSelectedLanguage();
  }, [i18n]);

  const handlePress = async value => {
    console.log(value, 'HANDLE_PRESS');
    if (value !== selectedValue) {
      setSelectedValue(value);
      i18n.changeLanguage(value);
      try {
        await localStorage.set('selectedLanguage', value);
      } catch (error) {
        console.error('Error saving selected language:', error);
      }
    }
  };

  const handlePressContinue = async () => {
    // resetAndNavigate('RiderLogin');
    if (selectedValue === 'en') {
      setSelectedValue('en');
      i18n.changeLanguage('en');
      await localStorage.set('selectedLanguage', 'en');
    }
    resetAndNavigate('Auth', {screen: 'RiderLogin'});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.body,
        selectedValue === item.languageCode && styles.selectedBody,
      ]}
      onPress={() => handlePress(item.languageCode)}>
      <View
        style={[
          styles.outer,
          selectedValue === item.languageCode && styles.selectedOuter,
        ]}>
        {selectedValue === item.languageCode && <View style={styles.inner} />}
      </View>
      <View style={styles.languageInfo}>
        <CustomText
          variant="h5"
          fontFamily={Fonts.light}
          style={
            selectedValue === item.languageCode ? styles.selectedText : null
          }>
          {item.name}
        </CustomText>
        <CustomText
          style={
            selectedValue === item.languageCode ? styles.selectedSubtitle : null
          }>
          {item.nativeName}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText
          variant="h1"
          fontFamily={Fonts.light}
          style={styles.titleText}>
          Choose App Language
        </CustomText>
        <CustomText
          variant="h5"
          fontFamily={Fonts.light}
          style={styles.subtitleText}>
          Choose the language you want to see in the entire app
        </CustomText>
      </View>

      <FlatList
        data={languages}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.flatListContent}
      />
      <CustomButton onPress={handlePressContinue} title="Continue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RMS(10),
    gap: RMS(20),
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    gap: RMS(5),
    padding: RMS(10),
    width: '100%',
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    color: 'grey',
    textAlign: 'center',
  },
  body: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: RMS(30),
    gap: RMS(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: RMS(15),
  },
  selectedBody: {
    backgroundColor: '#e0ffe0',
  },
  outer: {
    width: RMS(24),
    height: RMS(24),
    borderRadius: RMS(12),
    borderWidth: 2,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RMS(10),
    marginBottom: RMS(10),
  },
  selectedOuter: {
    borderColor: 'green',
  },
  inner: {
    width: RMS(12),
    height: RMS(12),
    borderRadius: RMS(6),
    backgroundColor: 'green',
  },
  languageInfo: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: RMS(10),
  },
  selectedText: {
    color: 'green',
  },
  selectedSubtitle: {
    color: 'green',
  },
  flatListContent: {
    width: '100%',
  },
});

export default Localization;
