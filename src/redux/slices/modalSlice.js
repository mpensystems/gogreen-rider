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

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isModalVisible: false,
  isGpsEnabled: false,
  isPermissionGranted: false,
  isOnline: false,
  isDeliveryOnProcess: false,
  isOrderAvailable: false,
  isDutyStarted: false,
  isMapLoaded: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: state => {
      state.isModalVisible = true;
    },
    hideModal: state => {
      state.isModalVisible = false;
    },
    setGpsStatus: (state, action) => {
      state.isGpsEnabled = action.payload; // true or false
    },
    setPermissionStatus: (state, action) => {
      state.isPermissionGranted = action.payload; // true or false
    },
    setIsOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setIsDeliveryOnProcess: (state, action) => {
      state.isDeliveryOnProcess = action.payload;
    },
    setIsOrderAvailable: (state, action) => {
      state.isOrderAvailable = action.payload;
    },
    setIsDutyStarted: (state, action) => {
      state.isDutyStarted = action.payload;
    },
  },
});

// Selectors
export const selectIsModalVisible = state => state.modal.isModalVisible;
export const selectIsGpsEnabled = state => state.modal.isGpsEnabled;
export const selectIsPermissionGranted = state =>
  state.modal.isPermissionGranted;
export const selectIsOnline = state => state.modal.isOnline;
export const selectIsDeliveryOnProcess = state =>
  state.modal.isDeliveryOnProcess;
export const selectIsOrderAvailable = state => state.modal.isOrderAvailable;
export const selectISDutyStarted = state => state.modal.isDutyStarted;

// Export actions and reducer
export const {
  showModal,
  hideModal,
  setGpsStatus,
  setPermissionStatus,
  setIsOnlineStatus,
  setIsDeliveryOnProcess,
  setIsOrderAvailable,
  setIsDutyStarted,
} = modalSlice.actions;
export default modalSlice.reducer;
