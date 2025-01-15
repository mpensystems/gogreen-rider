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

import React from 'react';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {BASE_URL, SOCKET_URL} from '@service/config';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsOnline} from 'redux/slices/modalSlice';
import {
  addNewBooking,
  updateBid,
  updateBookingList,
} from 'redux/slices/bookingSlice';
import {
  selectToken,
  setAuthMessageAck,
  setLocationAck,
} from 'redux/slices/riderSlice';

import localStorage from '@utils/localstorage';

const WSContext = createContext(undefined);

export const WSProvider = ({children}) => {
  const [socketAccessToken, setSocketAccessToken] = useState(null);
  const [wsAuth, setWsAuth] = useState(null);
  const socket = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const isOnline = useSelector(selectIsOnline);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  console.log(token, 'TOKEN');

  const [listenerCount, setListenerCount] = useState({
    open: 0,
    message: 0,
    close: 0,
    error: 0,
  });

  const incrementListenerCount = eventType => {
    setListenerCount(prevCount => ({
      ...prevCount,
      [eventType]: prevCount[eventType] + 1,
    }));
  };

  const getAuthToken = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/rider-ws-auth`,
        {
          headers: {
            Authorization: `Bearer ${socketAccessToken}`,
          },
        },
      );
      const {auth} = response.data;
      localStorage.set('authKey', auth);
      setWsAuth(auth);
    } catch (error) {
      console.error('Failed to fetch auth token:', error);
    }
  };

  //getting SESSION TOKEN (st)
  useEffect(() => {
    if (token) {
      setSocketAccessToken(token);
      console.log('TOKEN', token);
    }
  }, [token]);

  //getting AUTHTOKEN
  useEffect(() => {
    if (socketAccessToken && isOnline && !wsAuth) {
      getAuthToken();
      console.log('CALLED GET TOKEN');
    }
  }, [socketAccessToken, isOnline, wsAuth]);

  const isOnlineRef = useRef(isOnline);

  useEffect(() => {
    isOnlineRef.current = isOnline; // Update ref whenever isOnline changes
  }, [isOnline]);

  const connectWebSocket = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return; // Exit if WebSocket is already connected
    }

    if (socketAccessToken && wsAuth && isOnline) {
      console.log('SOCKET_WEB_CONNECT', isOnline);

      socket.current = new WebSocket(SOCKET_URL);

      socket.current.onopen = () => {
        incrementListenerCount('open');
        setConnectionStatus('Connected');
        console.log('WebSocket connection established.');
        console.log('SOCKET_WEB_CONNECT', isOnline);

        const authMessage = JSON.stringify({
          cmd: 'auth',
          id: 'AUTHACK',
          p: {
            auth: wsAuth,
            st: socketAccessToken,
          },
        });
        socket.current.send(authMessage);
      };

      socket.current.onmessage = event => {
        incrementListenerCount('message');
        const data = JSON.parse(event.data);
        handleMessage(data);
        if (data?.cmd === 'ack' && data?.id === 'AUTHACK') {
          dispatch(setAuthMessageAck(true));
        }
        if (data?.cmd === 'ack' && data?.id === 'LOCATIONACK') {
          dispatch(setLocationAck(true));
        }
      };

      socket.current.onclose = () => {
        if (isOnlineRef.current) {
          incrementListenerCount('close');

          setConnectionStatus('Disconnected');
          console.log('WebSocket connection closed.');
          console.log(isOnline, 'ISONLINESSSSSS');
          console.log(typeof isOnline, 'Type of isOnline');

          console.log('Attempting to reconnect...');
          setTimeout(connectWebSocket, 5000);
        } else {
          console.log('Not reconnecting due to offline status.');
        }
      };

      socket.current.onerror = error => {
        console.error('WebSocket error:', error);

        if (isOnlineRef.current && socketAccessToken && wsAuth) {
          incrementListenerCount('error');

          console.log('CALLED_ON_ERROR');
        }
      };
    }
  };

  useEffect(() => {
    console.log('Current WebSocket listener counts:', listenerCount);
  }, [listenerCount]);

  useEffect(() => {
    if (isOnline && socketAccessToken && wsAuth) {
      console.log('ISONLINE_CONNECT', isOnline);
      connectWebSocket();
    } else if (!isOnline && socket.current) {
      console.log('Closing WebSocket connection due to offline status.');
      socket.current.close();
    }

    // Cleanup function
    return () => {
      if (socket.current && !isOnlineRef.current) {
        console.log('Cleaning up WebSocket connection.');
        socket.current.close();
        setWsAuth('');
        // dispatch(setToken(''));
        dispatch(setAuthMessageAck(null));
        dispatch(setLocationAck(null));
      }
    };
  }, [socketAccessToken, wsAuth, isOnline]);

  const handleMessage = data => {
    switch (data.cmd) {
      case 'new-booking':
        // console.log('NEW BOOKING',data);
        handleNewBooking(data.p);
        break;
      case 'bid-change':
        // console.log('BID CHANGE');
        handleBidChange(data.p);
        break;
      case 'booking-list':
        // console.log('BOOKING LIST');
        handleBookingList(data.p);
        break;
      case 'ack':
        console.log('ACK', data);
        // handleBookingList(data.p);
        break;
      case 'error':
        if (data?.error_code === 'ER408') {
          console.log('CALLED AUTH TOKEN AGAIN');

          getAuthToken();
        }
        break;
      default:
        console.log('Unknown command received:', data);
    }
  };

  const emit = message => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. Message not sent:', message);
    }
  };

  const handleNewBooking = booking => {
    // console.log('New booking received:', booking);
    console.log('New booking received:');

    dispatch(addNewBooking(booking));
  };

  const handleBidChange = bidChange => {
    // console.log('Bid change received:', bidChange);
    console.log('Bid change received:');

    dispatch(updateBid(bidChange));
  };

  const handleBookingList = bookingListData => {
    console.log('Booking list received:', bookingListData);
    // console.log('Booking list received:');

    const {h3i, bookings} = bookingListData;
    dispatch(updateBookingList({h3i, bookings}));
  };

  const socketService = {
    connectionStatus,
    messages,
    emit,
  };

  return (
    <WSContext.Provider value={socketService}>{children}</WSContext.Provider>
  );
};

export const useWs = () => {
  const socketService = useContext(WSContext);
  if (!socketService) {
    throw new Error('useWs must be used within a WSProvider');
  }
  return socketService;
};
