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
  Linking,
  Platform,
} from 'react-native';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconm from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Fonts} from '@utils/Constants';
import ConfirmationModal from './CustomConfirmationModal';

const CustomAccordionDropOrder = ({
  geoLoc,
  data,
  placeholder,
  selectedValue,
  onValueChange,
}) => {
  const [expandedSectionIndex, setExpandedSectionIndex] = useState(null);
  const [iscallModalVisible, setIsCallModalVisible] = useState(false);
  // Toggle the expansion of a section
  const toggleSection = sectionIndex => {
    setExpandedSectionIndex(prevIndex =>
      prevIndex === sectionIndex ? null : sectionIndex,
    );
  };

  const handleCall = () => {
    setIsCallModalVisible(true);
  };

  const handleConfirmCall = () => {
    setIsCallModalVisible(false);
  };

  const handleCancelCall = () => {
    setIsCallModalVisible(false);
  };

  const openGoogleMapsNavigation = (latitude, longitude) => {
    const googleMapsNavigationURL = `google.navigation:q=${latitude},${longitude}&mode=d`;

    if (Platform.OS === 'android') {
      Linking.openURL(googleMapsNavigationURL).catch(err =>
        console.error('Error opening map', err),
      );
    } else {
      const appleMapsURL = `maps://?daddr=${latitude},${longitude}&dirflg=d`;
      Linking.openURL(appleMapsURL).catch(err =>
        console.error('Error opening map', err),
      );
    }
  };

  return (
    <View style={styles.container}>
      {data?.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          {/* Section Header */}
          <TouchableOpacity
            style={styles.dropdownSelector}
            onPress={() => toggleSection(sectionIndex)}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                {gap: 10}, // This replaces `gap` for spacing between children
              ]}>
              <View style={styles.iconContainer}>
                <Iconm size={RS(25)} color="#555555" name={section.icon} />
              </View>
              <View>
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.light}
                  style={styles.sectionTitle}>
                  {section.title}
                </CustomText>
              </View>
            </View>
            <Icon
              size={RS(25)}
              color="#ccc"
              name={
                expandedSectionIndex === sectionIndex
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
            />
          </TouchableOpacity>

          {expandedSectionIndex === sectionIndex && (
            <View style={styles.dropDownArea}>
              {section?.data?.map((item, index) => (
                <View key={index} style={styles.listContainer}>
                  {typeof item === 'string' ? (
                    <CustomText
                      variant="h5"
                      fontFamily={Fonts.light}
                      style={{color: '#666666'}}>
                      {item}
                    </CustomText>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}>
                      <CustomText
                        variant="h5"
                        fontFamily={Fonts.light}
                        style={{color: '#666666'}}>
                        {item.label} :
                      </CustomText>
                      <CustomText variant="h5" fontFamily={Fonts.light}>
                        {item.value}
                      </CustomText>
                    </View>
                  )}
                </View>
              ))}

              {/* Address Section */}
              {section.address && (
                <View style={styles.addressContainer}>
                  <View style={styles.addressContent}>
                    <CustomText
                      variant="h5"
                      fontFamily={Fonts.light}
                      style={{color: '#666666'}}>
                      {section?.address?.line1} {section?.address?.line2}{' '}
                      {section?.address?.house},{section?.address?.landmark}{' '}
                      {section?.address?.district} {section?.address?.city}{' '}
                      {section?.address?.state}
                    </CustomText>
                  </View>

                  {/* Call & Map Buttons */}
                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall()}>
                      <Iconm name="phone" size={25} color="#0073cf" />
                      <CustomText
                        variant="h4"
                        fontFamily={Fonts.light}
                        style={{color: '#0073cf'}}>
                        Call
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton2}
                      onPress={() =>
                        openGoogleMapsNavigation(geoLoc?.lat, geoLoc?.lng)
                      }>
                      <Icon name="navigate-sharp" size={25} color="white" />
                      <CustomText
                        variant="h4"
                        fontFamily={Fonts.light}
                        style={{color: 'white'}}>
                        Map
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      <ConfirmationModal
        visible={iscallModalVisible}
        onConfirm={handleConfirmCall}
        onCancel={handleCancelCall}
        message="Are you sure you want to call the customer?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownSelector: {
    width: '100%',
    height: RV(50),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: Colors.border,
    alignSelf: 'center',
    marginTop: RMS(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: RMS(15),
    paddingRight: RMS(15),
  },
  dropDownArea: {
    width: '100%',
    borderRadius: 10,
    marginTop: RMS(5),
    backgroundColor: Colors.backgroundSecondary,
    shadowColor: Colors.border,
    borderWidth: 0.5,
    borderColor: Colors.border,
    zIndex: 1,
  },
  listContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: RMS(10),
    paddingLeft: RMS(15),
    color: Colors.text,
  },
  sectionTitle: {
    color: Colors.text,
  },
  addressContainer: {
    flexDirection: 'column',
    borderWidth: 0.1,
    borderColor: Colors.border,
  },
  addressContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: RV(80),
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.4,
    borderColor: '#007fbf',

    height: RV(45),
    borderRadius: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
    width: '50%',
    borderRightWidth: 0.3,
    borderRightColor: Colors.border,
  },
  actionButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
    width: '50%',
    backgroundColor: '#007fbf',
  },
  iconContainer: {
    borderRadius: RMS(50),
    height: RV(30),
    width: RS(35),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomAccordionDropOrder;
