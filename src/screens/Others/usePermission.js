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

import {useState, useEffect, useCallback} from 'react';
import {Alert, Linking} from 'react-native';
import {request, check, RESULTS} from 'react-native-permissions';

const usePermission = permissionType => {
  const [permissionStatus, setPermissionStatus] = useState(null);

  //checking permission status
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  //handling block status
  useEffect(() => {
    if (permissionStatus === RESULTS.BLOCKED) {
      handleBlockedPermission();
    }
  }, [permissionStatus]);

  const checkPermissionStatus = useCallback(async () => {
    try {
      const status = await check(permissionType);
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  }, [permissionType]);

  const checkAndRequestPermission = async () => {
    try {
      if (permissionStatus === RESULTS.GRANTED) {
        return permissionStatus;
      }
      const status = await request(permissionType);
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleBlockedPermission = () => {
    Alert.alert(
      'Permission Blocked',
      'You have blocked this permission. Please go to settings and enable it to use this feature.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setPermissionStatus(null);
          },
        },
        {
          text: 'Go to settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  return {permissionStatus, checkAndRequestPermission};
};

export default usePermission;
