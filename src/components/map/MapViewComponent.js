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

import React, {useEffect, useState} from 'react';
import MapView, {Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {ActivityIndicator, LogBox, View} from 'react-native';
import {GOOGLE_MAP_API_URL} from '@service/config';
import Markers from './Markers';
import {customMapStyle} from '@utils/CustomMap';
import {handleFitToPath} from './mapUtils';
import {getPoints} from './getPoints';
import {Colors} from '@utils/Constants';
import {useMapRef} from 'context/MapRefContext';
import {useSelector} from 'react-redux';
import {
  selectTrip,
  selectTripStatus,
} from 'redux/slices/tripSlice';
import {useRoute} from '@react-navigation/native';

const MapViewComponent = ({
  mapRef,
  hasAccepted,
  setMapRef,
  deliveryPersonLocation,
  deliveryLocation,
  pickupLocation,
  hasPickedUp,
}) => {
  const {setMapReady} = useMapRef();
  const [loading, setLoading] = useState(true);
  const trip = useSelector(selectTrip);
  const route = useRoute();
  console.log(trip, 'TRIP_ACCEPT_BOOKING');
  console.log(route.name, 'ROUTENAME');

  const [loadingDirections, setLoadingDirections] = useState(true);
  const activeTripStatus = useSelector(selectTripStatus);

  useEffect(() => {
    if (
      trip &&
      (activeTripStatus === 'way-to-pickup' ||
        activeTripStatus === 'way-to-drop')
    ) {
      setLoadingDirections(false);
    } else {
      setLoadingDirections(false);
    }
  }, [trip]);

  useEffect(() => {
    LogBox.ignoreLogs([
      'MapViewDirections Error: Error on GMAPS route request: NOT_FOUND',
    ]);
  }, []);

  return (
    <View style={{flex: 1}}>
      {(loading || loadingDirections) && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{position: 'absolute', top: '50%', left: '50%', zIndex: 1}}
        />
      )}

      <MapView
        ref={setMapRef}
        style={{flex: 1}}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        followsUserLocation={true}
        mapType="standard"
        rotateEnabled={false}
        tiltEnabled={false}
        onLayout={() => {
          handleFitToPath(
            mapRef,
            deliveryLocation,
            pickupLocation,
            hasPickedUp,
            hasAccepted,
            deliveryPersonLocation,
          );
        }}
        onMapReady={() => {
          console.log('Map is ready');
          setMapReady(true);
          setLoading(false);
        }}>
        {console.log('CALLED MAP VIEW COMPONENT')}

        {route.name === 'AcceptBooking' && (
          <Polyline
            coordinates={getPoints([pickupLocation, deliveryLocation])}
            strokeColor={Colors.text}
            strokeWidth={5}
            geodesic={true}
            lineDashPattern={[10, 20]}
          />
        )}
        {console.log(trip, 'DELIVERY_PERSON_LOCATION')}

        {trip &&
          activeTripStatus === 'way-to-pickup' &&
          deliveryPersonLocation &&
          pickupLocation &&
          deliveryPersonLocation?.latitude &&
          deliveryPersonLocation?.longitude &&
          pickupLocation?.latitude &&
          pickupLocation?.longitude && (
            <MapViewDirections
              origin={deliveryPersonLocation}
              mode="WALKING"
              destination={pickupLocation}
              apikey={GOOGLE_MAP_API_URL}
              strokeColor="#2871F2"
              strokeWidth={4}
              onError={err => console.log(err)}
            />
          )}

        {trip &&
          activeTripStatus === 'way-to-drop' &&
          deliveryPersonLocation &&
          deliveryLocation &&
          deliveryPersonLocation?.latitude &&
          deliveryPersonLocation?.longitude &&
          deliveryLocation?.latitude &&
          deliveryLocation?.longitude && (
            <MapViewDirections
              origin={deliveryPersonLocation}
              mode="WALKING"
              destination={deliveryLocation}
              apikey={GOOGLE_MAP_API_URL}
              strokeColor="#4285F4"
              strokeWidth={4}
              onError={err => console.log(err)}
            />
          )}

        <Markers
          deliveryPersonLocation={deliveryPersonLocation}
          deliveryLocation={deliveryLocation}
          pickupLocation={pickupLocation}
        />
      </MapView>
    </View>
  );
};

export default MapViewComponent;
