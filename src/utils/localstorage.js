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
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'app-storage',
});

const localStorage = {
  set: (key, val) => {
    try {
      const jsonVal = typeof val === 'string' ? val : JSON.stringify(val);
      storage.set(key, jsonVal);
      return true;
    } catch (error) {
      console.error('Error setting item:', error);
      return false;
    }
  },

  get: key => {
    try {
      const value = storage.getString(key);
      if (value === null || value === undefined) return null;

      if (value === 'true') return true;
      if (value === 'false') return false;

      try {
        return value.startsWith('{') || value.startsWith('[')
          ? JSON.parse(value)
          : value;
      } catch (jsonError) {
        console.error(`Error parsing JSON for key ${key}:`, jsonError);
        return value;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },
  clear: () => {
    try {
      const allKeys = storage.getAllKeys();
      allKeys.forEach(key => storage.delete(key));
      console.log('All keys cleared successfully!');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  remove: key => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },

  logStoredValues: () => {
    const allKeys = storage.getAllKeys();
    allKeys.forEach(key => {
      const value = storage.getString(key);
      console.log(`Key: ${key}, Value: ${value}`);
    });
  },
};

export default localStorage;
