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

import {db} from './db';
import {
  DELETE_ORDER,
  SELECT_ALL_ORDERS,
  DELETE_ALL_ORDERS,
  INSERT_OR_UPDATE_ORDER,
  UPDATE_BID_CONFIG,
} from './dbQueries';

export const fetchOrders = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        SELECT_ALL_ORDERS,
        [],
        (tx, results) => {
          const orders = [];
          for (let i = 0; i < results.rows.length; i++) {
            orders.push(results.rows.item(i));
          }
          resolve(orders);
        },
        error => {
          console.error('Failed to fetch orders:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertOrder = async booking => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        // INSERT_ORDER,
        INSERT_OR_UPDATE_ORDER,
        [
          booking.bid,
          booking.pickup,
          booking.drops,
          booking.trip_distance,
          booking.status,
          booking.created_at,
          booking.bidConfig,
        ],
        () => {
          console.log('Order inserted successfully');
          resolve();
        },
        error => {
          console.error('Failed to insert order:', error);
          reject(error);
        },
      );
    });
  });
};

export const updateBidConfig = async (bid, newBidConfig) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        UPDATE_BID_CONFIG,
        [newBidConfig, bid],
        () => {
          console.log(`Bid configuration updated successfully for bid: ${bid}`);
          resolve('BOOKING UPDATED SUCCESSSFULL');
        },
        error => {
          console.error(
            `Failed to update bid configuration for bid ${bid}:`,
            error,
          );
          reject(error);
        },
      );
    });
  });
};

export const deleteOrder = async bid => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        DELETE_ORDER,
        [bid],
        () => {
          console.log('Booking deleted successfully');
          resolve('BOOKING DELETED SUCCESSFULY');
        },
        error => {
          console.error('Failed to delete booking:', error);
          reject(error);
        },
      );
    });
  });
};

export const deleteAllBookings = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        DELETE_ALL_ORDERS,
        [],
        () => {
          console.log('All orders deleted successfully');
          resolve('ALL BOOKINGS DELETED SUCCESSFULLY');
        },
        error => {
          console.error('Failed to delete all orders:', error);
          reject(error);
        },
      );
    });
  });
};
