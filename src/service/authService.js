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

import localStorage from '@utils/localstorage';

export const checkSession = async () => {
  try {
    const sessionToken = await localStorage.get('st');
    // const expirationTime = await localStorage.get('expires_at');

    const now = new Date();

    // Add 24 hours (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Format to ISO string if needed, or keep it as a Date object
    const expirationTimeString = expirationTime.toISOString();

    console.log(
      'Session Token:',
      sessionToken,
      'Expiration Time:',
      expirationTime,
    );

    if (!sessionToken || !expirationTimeString) {
      return false; // Return false if either the session token or expiration time is missing
    }



    // const expiryTimestamp = parseInt(expirationTime, 10);

    // Validate the expiration timestamp
    if (isNaN(expirationTime)) {
      console.error('Invalid expiration time:', expirationTime);
      return false; // Return false if expiration time is not a valid number
    }

    const currentTime = Date.now();

    if (currentTime > expirationTime) {
      // Remove expired session
      await localStorage.remove('st');
      await localStorage.remove('expires_at');
      console.log('Session expired. Cleared session data.');
      return false; // Session has expired
    }

    console.log('Session is valid.');
    return true; // Session is still valid
  } catch (error) {
    console.error('Error checking session:', error);
    return false; // Return false on error
  }
};

// Clear session
export const clearSession = async () => {
  try {
    await localStorage.remove('st');
    await localStorage.remove('expiry');
    await localStorage.remove('rider');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};
