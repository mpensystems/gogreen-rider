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

import {View, StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {Colors} from '@utils/Constants';
import MapViewComponent from '@components/map/MapViewComponent';
import {RMS, RV} from '@utils/responsive';
import {handleFitToPath} from '@components/map/mapUtils';
import {useMapRef} from 'context/MapRefContext';


const LiveMap = ({
  deliveryLocation,
  deliveryPersonLocation,
  hasAccepted,
  hasPickedUp,
  pickupLocation,
}) => {
  const {mapRef, setMapRef , mapReady} = useMapRef();


  useEffect(() => {
    if (mapRef && mapReady ) {
      handleFitToPath(
        mapRef,
        deliveryLocation,
        pickupLocation,
        hasPickedUp,
        hasAccepted,
        deliveryPersonLocation,
      );
    }

  }, [mapRef,mapReady, deliveryPersonLocation, hasAccepted, hasPickedUp]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        mapRef={mapRef}
        setMapRef={setMapRef}
        hasAccepted={hasAccepted}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
        deliveryPersonLocation={deliveryPersonLocation}
        hasPickedUp={hasPickedUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    width: '100%',
    minHeight: RV(400),
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    bordercolor: Colors.border,
  },
  fitButton: {
    position: 'absolute',
    bottom: RMS(10),
    right: RMS(10),
    padding: RMS(5),
    backgroundColor: '#fff',
    borderWidth: 0.8,
  },
});

export default LiveMap;
