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

import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db;

const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabase({
      name: 'orders.db',
      location: 'default',
    });
    console.log('Database opened successfully');
  }
  return db;
};

export {openDatabase, db};
