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

import {openDatabase} from './db';
import {CREATE_ORDERS_TABLE} from './dbQueries';

export const initDatabase = async () => {
  const db = await openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      CREATE_ORDERS_TABLE,
      [],
      () => {
        console.log('Orders table created successfully');
      },
      (tx, error) => {
        console.error('Failed to create orders table:', error);
      },
    );
  });
};
