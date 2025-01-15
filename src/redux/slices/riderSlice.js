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
  rider: {},
  riderDetails: null,
  isKycVerified: null,
  st: null,
  authMessageAck: null,
  locationAck: null,
  images: {},
};

export const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    setRider: (state, action) => {
      state.rider = action.payload;
    },
    setToken: (state, action) => {
      state.st = action.payload;
    },
    setRirderDetails: (state, action) => {
      state.riderDetails = action.payload;
    },
    setRiderDetailField: (state, action) => {
      const {key, value} = action.payload;
      if (state.riderDetails) {
        state.riderDetails[key] = value;
      }
    },
    removeToken: (state, action) => {
      state.st = null;
    },
    setKycVerified: (state, action) => {
      state.isKycVerified = action.payload;
    },
    setAuthMessageAck: (state, action) => {
      state.authMessageAck = action.payload;
    },
    setLocationAck: (state, action) => {
      state.locationAck = action.payload;
    },
    setImage: (state, action) => {
      const {imageId, base64data} = action.payload;
      state.images[imageId] = base64data;
    },
    clearImages: state => {
      state.images = {};
    },
  },
});

export const {
  setRider,
  setToken,
  removeToken,
  setKycVerified,
  setAuthMessageAck,
  setLocationAck,
  setRirderDetails,
  setImage,
  clearImages,
  setRiderDetailField,
} = riderSlice.actions;

export const selectRider = state => state.rider.rider;
export const selectToken = state => state.rider.st;
export const selectKycVerified = state => state.rider.isKycVerified;
export const selectAuthMessageAck = state => state.rider.authMessageAck;
export const selectLocationAck = state => state.rider.locationAck;
export const selectRiderDetails = state => state.rider.riderDetails;
export const selectImages = state => state.rider.images;
export const selectImageById = (state, imageId) => state.rider.images[imageId];

export default riderSlice.reducer;
