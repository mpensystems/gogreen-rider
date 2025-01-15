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

export const BASE_URL = 'http://34.93.209.158:8003/v1';

export const RIDER_LOGIN = `${BASE_URL}/initiate-login`;
export const RIDER_VALIDATE_OTP = `${BASE_URL}/validate-otp`;
export const RIDER_RESEND_OTP = `${BASE_URL}/auth/rider-login`;
export const RIDER_FETCH_KYC = `${BASE_URL}/rider/fetch-kyc`;
export const GET_FILES = `${BASE_URL}/rider/view-kyc-doc`;
