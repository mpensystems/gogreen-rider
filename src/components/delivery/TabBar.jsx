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

import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';

const TabBar = ({selectedTab, onTabChange}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, selectedTab === 'available' && styles.activeTab]}
        onPress={() => onTabChange('available')}>
        <CustomText
          variant="h8"
          fontFamily={Fonts.semiBold}
          style={[
            styles.tabText,
            selectedTab === 'available'
              ? styles.activeTabText
              : styles.inactiveTabText,
          ]}>
          Available
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    width: '80%',
    margin: 10,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tabText: {
    color: Colors.text,
  },
  activeTabText: {
    colors: '#fff',
  },
  inactiveTabText: {
    color: Colors.disabled,
  },
});

export default TabBar;
