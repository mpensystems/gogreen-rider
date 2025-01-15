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
  trip: null,
  status: null,
  substatus: null,
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTrip: (state, action) => {
      state.trip = action.payload;
    },
    setTripStatus: (state, action) => {
      state.status = action.payload;
    },
    setTripSubstatus: (state, action) => {
      state.substatus = action.payload;
    },
  },
});

export const {setTrip, setTripStatus, setTripSubstatus} = tripSlice.actions;

export const selectTrip = state => state.trip.trip;
export const selectTripStatus = state => state.trip.status;
export const selectTripSubstatus = state => state.trip.substatus;

export default tripSlice.reducer;
