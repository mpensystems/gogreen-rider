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

import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import shop from '../../assets/images/shop.png';
import marker from '../../assets/images/marker.png';
import {RS, RV} from '@utils/responsive';

const Markers = ({deliveryLocation, pickupLocation}) => {
  const [deliveryTracksViewChanges, setDeliveryTracksViewChanges] =
    useState(true);
  const [pickupTracksViewChanges, setPickupTracksViewChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeliveryTracksViewChanges(false);
      setPickupTracksViewChanges(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {deliveryLocation && (
        <Marker
          coordinate={deliveryLocation}
          tracksViewChanges={deliveryTracksViewChanges}
          anchor={{x: 0.5, y: 0.5}}>
          <Image source={marker} style={{width: RS(30), height: RV(30)}} />
        </Marker>
      )}

      {pickupLocation && (
        <Marker
          coordinate={pickupLocation}
          tracksViewChanges={pickupTracksViewChanges}
          anchor={{x: 0.5, y: 0.5}}>
          <Image source={shop} style={{width: RS(30), height: RV(30)}} />
        </Marker>
      )}
    </>
  );
};

export default Markers;
