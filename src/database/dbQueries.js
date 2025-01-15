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
export const CREATE_ORDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS Bookings (
    bid TEXT PRIMARY KEY,
    pickup TEXT,
    drops TEXT,
    trip_distance REAL,
    status TEXT,
    created_at TEXT,
    bidConfig TEXT
  );
`;

export const INSERT_OR_UPDATE_ORDER = `
 INSERT OR REPLACE INTO Bookings (bid, pickup, drops, trip_distance, status, created_at, bidConfig)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

export const UPDATE_BID_CONFIG = `
  UPDATE Bookings 
  SET 
    bidConfig = ? 
  WHERE 
    bid = ?`;

export const UPDATE_ORDER = `
  UPDATE orders SET title = ?, description = ? WHERE orderId = ?;
`;

export const DELETE_ORDER = `
  DELETE FROM Bookings WHERE bid = ?;
`;

export const SELECT_ALL_ORDERS = `
  SELECT * FROM Bookings;
`;

export const DELETE_ALL_ORDERS = `
  DELETE FROM Bookings;
`;
