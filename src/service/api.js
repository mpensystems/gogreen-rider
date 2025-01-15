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

import axios from 'axios';
import {BASE_URL} from './config';

export const submitOnboardingDetails = async (data, token) => {
  try {
    console.log(data, 'ONBOARDING_DATA');

    const response = await axios.post(`${BASE_URL}/rider/update-kyc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response, 'RESPONSE_ONBOARDING');
    return response;
  } catch (error) {
    console.error('SUBMIT DATA ERROR-->', error);
    return error;
  }
};

export const fetchOnboardingDetails = async token => {
  console.log(token, 'TOKEN_FETCH');

  try {
    const response = await axios.get(`${BASE_URL}/rider/fetch-kyc`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(response, 'FETCH_RESPONSE_ONBOARDING');
    return response;
  } catch (error) {
    console.error('FETCH DATA ERROR-->', error);
    return error;
  }
};

export const uploadFiles = async (data, token, type) => {
  console.log(data, token, type, 'DATA AND TOKEN');

  try {
    const response = await axios.post(
      `${BASE_URL}/rider/upload-kyc-doc`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'doc-type': type,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response, 'FETCH_RESPONSE_ONBOARDING');
    return response;
  } catch (error) {
    console.log(error, 'UPLOAD_FILES_ERROR');

    return error?.response;
  }
};

export const getFiles = async (data, token) => {
  console.log(data, token, 'DATA AND TOKEN');

  try {
    const response = await axios.get(`${BASE_URL}/rider/view-kyc-doc/${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.log(error?.response, 'GET_FILES_ERROR');

    return error?.response;
  }
};

export const acceptBooking = async data => {
  console.log(data?.token, 'TOKEN_FETCH');
  console.log(data, 'DATA_ACCEPT_BOOKING');

  const geoLoc = {lat: data?.currentLoc?.lat, lng: data?.currentLoc?.lng};

  try {
    const response = await axios.post(
      `${BASE_URL}/bookings/${data.bid}/accept`,
      {lat: geoLoc.lat, lng: geoLoc.lng},
      {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      },
    );

    console.log(response, 'RIDER_DATA_RESPONSE');
    return response;
  } catch (error) {
    console.error(
      'RIDER DATA ERROR-->',
      error.response ? error.response.data : error.message,
    );
    return error;
  }
};

export const getActiveTrip = async token => {
  console.log(token, 'TOKEN');

  try {
    const response = await axios.get(`${BASE_URL}/trips/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response?.data, 'GET_ACTIVE_TRIP');
    return response;
  } catch (error) {
    console.error('GET ACTIVE ERROR-->', error);
    return {
      status: error.response?.status,
      data: error.response?.data || error.message,
    };
  }
};

export const setStatus = async data => {
  console.log(data?.token, 'TOKEN_FETCH');
  console.log(data, 'DATA_SETSTATUS');
  const {tid, status, substatus} = data;

  const geoLoc = {lat: data?.currentLoc?.lat, lng: data?.currentLoc?.lng};

  try {
    const response = await axios.post(
      `${BASE_URL}/trips/${tid}/set/${status}/${substatus}`,
      {lat: geoLoc.lat, lng: geoLoc.lng, otp: data?.otp},
      {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      },
    );

    console.log(response, 'RIDER_DATA_RESPONSE');
    return response;
  } catch (error) {
    console.error('SET STATUS ERROR-->', error.response.data);
    return error?.response?.data;
  }
};
