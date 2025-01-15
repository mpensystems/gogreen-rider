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

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  closeBottomSheet,
  selectBottomSheetVisible,
} from '../../redux/slices/bottomSheetSlice';
import {RMS, RS, RV} from '@utils/responsive';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTranslation} from 'react-i18next';

const EmergencyHelp = () => {
  const isVisible = useSelector(selectBottomSheetVisible);
  const dispatch = useDispatch();
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const {t} = useTranslation();

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={() => dispatch(closeBottomSheet())}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} />
        <Animated.View
          style={[styles.container, {transform: [{translateY: slideAnim}]}]}>
          <View style={styles.headerSection}>
            <CustomText variant="h5" fontFamily={Fonts.light}>
              {t('EMERGENCY_HELP')}
            </CustomText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => dispatch(closeBottomSheet())}>
              <CustomText variant="h3" fontFamily={Fonts.light}>
                x
              </CustomText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.contentSection}
            onPress={() => Linking.openURL('tel:123456789')}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Icon
                  name="plus-circle-outline"
                  color="#CD5C5C"
                  size={RFValue(20)}
                />
              </View>
              <View style={styles.textContainer}>
                <CustomText fontFamily={Fonts.light} variant="h5">
                  {t('CALL_AMBULANCE')}
                </CustomText>
                <CustomText fontFamily={Fonts.light} variant="h6">
                  {t('FOR_MEDICAL_EMERGENCIES')}
                </CustomText>
              </View>
              <Icon name="chevron-right" color="grey" size={RFValue(20)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contentSection}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Icon name="phone-in-talk" color="#CD5C5C" size={RFValue(20)} />
              </View>
              <View style={styles.textContainer}>
                <CustomText fontFamily={Fonts.light} variant="h5">
                  {t('CALL_SHOP_HELPLINE')}
                </CustomText>
                <CustomText fontFamily={Fonts.light} variant="h6">
                  {t('TALK_TO_EMERGENCY_TEAM')}
                </CustomText>
              </View>
              <Icon name="chevron-right" color="grey" size={RFValue(20)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contentSection}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Icon
                  name="police-station"
                  color="#CD5C5C"
                  size={RFValue(20)}
                />
              </View>
              <View style={styles.textContainer}>
                <CustomText fontFamily={Fonts.light} variant="h5">
                  {t('CALL_POLICE')}
                </CustomText>
                <CustomText fontFamily={Fonts.light} variant="h6">
                  {t('FOR_REPORTING_CRIME')}
                </CustomText>
              </View>
              <Icon name="chevron-right" color="grey" size={RFValue(20)} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: RMS(20),
    paddingHorizontal: RMS(20),
    elevation: 5,
  },
  headerSection: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.border,
    paddingBottom: RMS(10),
  },
  contentSection: {
    paddingTop: RMS(10),
    paddingBottom: RMS(10),
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RMS(10),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: RMS(30),
  },
  iconContainer: {
    width: RS(30),
    height: RV(30),
    backgroundColor: '#ededed',
    borderRadius: RMS(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmergencyHelp;
