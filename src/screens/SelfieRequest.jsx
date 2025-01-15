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
import {View, StyleSheet, Image, SafeAreaView, ScrollView} from 'react-native';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import SelfieIcon from '../../assets/images/selfieIcon.jpg';
import {RMS, RV} from '@utils/responsive';
import CustomButton from '@components/ui/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';

const SelfieRequest = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <CustomText variant="h2" fontFamily={Fonts.bold}>
                It's time for a selfie!
              </CustomText>
            </View>

            <View style={styles.imageWrapper}>
              <Image
                source={SelfieIcon}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.tipContainer}>
            <View style={styles.iconWrapper}>
              <Icon
                name="lightbulb-on-outline"
                color="green"
                size={RFValue(30)}
              />
            </View>
            <View style={styles.tipTextContainer}>
              <CustomText
                variant="h5"
                fontFamily={Fonts.bold}
                style={styles.tipTitle}>
                Quick Tip
              </CustomText>
              <CustomText
                variant="h5"
                fontFamily={Fonts.light}
                style={styles.tipBody}>
                Ensure that your face is clearly visible.
              </CustomText>
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton title="Click a selfie" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    padding: RMS(16),
  },
  header: {
    alignItems: 'center',
    marginBottom: RMS(20),
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RMS(20),
  },
  image: {
    height: RV(300),
    width: RV(300),
    borderRadius: RV(150),
    borderColor: Colors.border,
    borderWidth: 1,
  },
  bottomContainer: {
    paddingHorizontal: RMS(16),
    paddingBottom: RMS(20),
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RMS(15),
    borderColor: Colors.border,
    padding: RMS(10),
    marginBottom: RMS(20),
  },
  iconWrapper: {
    marginRight: RMS(10),
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    color: 'green',
  },
  tipBody: {
    color: Colors.text,
  },
  buttonWrapper: {
    paddingBottom: RMS(20),
  },
});

export default SelfieRequest;
