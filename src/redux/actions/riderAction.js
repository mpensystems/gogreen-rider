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
import {
  GET_FILES,
  RIDER_FETCH_KYC,
  RIDER_LOGIN,
  RIDER_VALIDATE_OTP,
} from 'redux/API';
import {
  setImage,
  setKycVerified,
  setRider,
  setRirderDetails,
  setToken,
} from 'redux/slices/riderSlice';
import localStorage from '@utils/localstorage';

export const RiderInitiateLogin = data => async dispatch => {
  try {
    console.log(data, 'DATA_REDUX');

    const response = await axios.post(RIDER_LOGIN, data);
    console.log('RIDER LOGIN-->', response.data);

    return response;
  } catch (error) {
    console.log('RIDER LOGIN ERROR-->', error);
  }
};

export const RiderValidateOtp = data => async dispatch => {
  try {
    console.log(data, 'RIDER_VALIDATE_OTP');

    const response = await axios.post(RIDER_VALIDATE_OTP, data);
    console.log('RIDER VALIDATE OTP-->', response?.data);

    const riderData = response?.data?.rider;
    const st = response?.data?.st;
    const isKycVerified = response?.data?.rider?.kyc_approved;
    console.log(riderData, 'RIDERDATA');
    console.log(st, 'SSSSTTTT');
    //store tokens and rider data
    if (riderData && st) {
      await localStorage.set('st', st);
      await localStorage.set('rider', riderData);

      // Dispatch rider data
      dispatch(setToken(st));
      dispatch(setKycVerified(isKycVerified));
      dispatch(setRider(riderData));
    }

    return {status: 200, data: response.data};
  } catch (error) {
    console.log('RIDER VALIDATE OTP ERROR-->', error);
    const responseError = error?.response || {
      status: 500,
      message: 'Unknown error occurred',
    };
    return responseError;
  }
};

export const RiderResendOtp = data => async dispatch => {
  try {
    const response = await axios.post(RIDER_LOGIN, data);
    console.log('RIDER RESEND OTP-->', response.data);

    return response;
  } catch (error) {
    console.log('RIDER RESEND OTP ERROR-->', error);
  }
};

export const FetchRiderKyc = token => async dispatch => {
  try {
    const response = await axios.get(RIDER_FETCH_KYC, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.status === 200 && response?.data) {
      dispatch(setRirderDetails(response?.data));
    }
    return {status: response?.status, data: response?.data};
  } catch (error) {
    console.log('RIDER KYC ERROR--->', error);
    const responseError = error?.response || {
      status: 500,
      message: 'Unknown error occurred',
    };
    return responseError;
  }
};

export const fetchImagesAction = (imageIds, token) => async dispatch => {
  console.log(imageIds, 'IMAGE_IDS', token, 'Token');

  try {
    // Create an array of promises to fetch images
    const fetchPromises = imageIds.map(imageId =>
      axios
        .get(`${GET_FILES}/${imageId?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        })
        .then(response => {
          if (response?.status === 200) {
            // Convert Blob to Base64
            const imageBlob = response.data;
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () =>
                resolve({imageId, base64data: reader.result});
              reader.onerror = reject;
              reader.readAsDataURL(imageBlob);
            });
          } else {
            console.error('Error fetching image:', response.status);
            return {imageId, base64data: null}; // Handle error for this image
          }
        })
        .catch(error => {
          console.error(
            `Error occurred while fetching image ${imageId}:`,
            error,
          );
          return {imageId, base64data: null}; // Handle failure gracefully
        }),
    );

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);
    const first5Characters = results.map(({base64data, imageId}) => {
      console.log('Image ID:', imageId); // Log imageId
      return base64data ? base64data.slice(0, 5) : 'No Data';
    });

    results.forEach(({imageId, base64data}) => {
      if (base64data) {
        const {id, key} = imageId;
        dispatch(setImage({imageId: key, base64data}));
      }
    });

    return {status: 200, data: results};
  } catch (error) {
    console.error('Error occurred while fetching images:', error);
    const responseError = error?.response || {
      status: 500,
      message: 'Unknown error occurred',
    };
    return responseError;
  }
};
