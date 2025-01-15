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
  newBookings: null,
  bidChanges: null,
  bookingList: [],
  currentBooking: [],
};

console.log(initialState, 'INITIALSTATE');

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addNewBooking: (state, action) => {
      state.newBookings = action.payload;
    },
    updateBid: (state, action) => {
      state.bidChanges = action.payload;
    },
    updateBookingList: (state, action) => {
      const {bookings} = action.payload;
      state.bookingList = bookings;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearBookingList: state => {
      state.bookingList = [];
    },
    clearNewBookings: state => {
      state.newBookings = null;
    },
    clearBidChanges: state => {
      state.bidChanges = null;
    },
  },
});

export const {
  addNewBooking,
  updateBid,
  updateBookingList,
  clearBookingList,
  clearNewBookings,
  clearBidChanges,
  setCurrentBooking,
} = bookingSlice.actions;

export const selectNewBookings = state => state.booking.newBookings;
export const selectBidChanges = state => state.booking.bidChanges;
export const selectBookingList = state => state.booking.bookingList;
export const selectCurrentBooking = state => state.booking.currentBooking; // Selector for currentBooking

export default bookingSlice.reducer;
