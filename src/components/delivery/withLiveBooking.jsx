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

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {RMS} from '@utils/responsive';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {resetAndNavigate} from '@navigation/NavigationService';
import {hocStyles} from '../../utils/GlobalStyles';
import {useSelector} from 'react-redux';
import {
  selectTrip,
  selectTripStatus,
  selectTripSubstatus,
} from 'redux/slices/tripSlice';
import LiveMap from '../../screens/LiveMap';
import {useLocation} from 'context/LocationContext';

const withLiveBooking = WrappedComponent => {
  const WithLiveBooking = props => {
    const activeTrip = useSelector(selectTrip);
    const activeTripStatus = useSelector(selectTripStatus);
    const activeTripSubStatus = useSelector(selectTripSubstatus);

    const {location} = useLocation();

    const handleContinuePress = () => {
      switch (activeTripStatus) {
        case 'way-to-pickup':
          if (activeTripSubStatus === 'routing') {
            resetAndNavigate('PickupLocation');
          } else if (activeTripSubStatus === 'arrived-at-pickup') {
            resetAndNavigate('PickOrder');
          }
          break;
        case 'way-to-drop':
          if (activeTripSubStatus === 'routing') {
            resetAndNavigate('DeliveredOrder');
          } else if (activeTripSubStatus === 'arrived-at-drop') {
            resetAndNavigate('DeliveryComplete');
          }
          break;
        case 'delivered':
          if (activeTripSubStatus === 'all-good') {
            resetAndNavigate('DeliverySuccess');
          } else if (activeTripSubStatus === 'physical-damage') {
            resetAndNavigate('DeliverySuccess');
          } else if (activeTripSubStatus === 'contents-spilled') {
            resetAndNavigate('DeliverySuccess');
          } else if (activeTripSubStatus === 'water-damage') {
            resetAndNavigate('DeliverySuccess');
          } else if (activeTripStatus === 'other') {
            resetAndNavigate('DeliverySuccess');
          }
          break;
        case 'way-to-return':
          if (activeTripSubStatus === 'routing') {
            resetAndNavigate('ReturnToPickup');
          }
          break;
        case 'returned':
          if (activeTripSubStatus === 'routing') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'rider-change-of-heart') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'customer-change-of-heart') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'too-big') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'restricted-item') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'insufficient-packaging') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'drop-to-far') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'insufficient-fuel') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'recipient-not-available') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'recipient-location-embargo') {
            resetAndNavigate('ReturnToPickup');
          } else if (activeTripSubStatus === 'other') {
            resetAndNavigate('ReturnToPickup');
          }
          break;
        case 'drop-canceled':
          resetAndNavigate('Main');
          break;
        default:
          resetAndNavigate('Main');
          break;
      }
    };

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        {activeTripStatus && (
          <View
            style={[
              hocStyles.dashboard,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: RMS(10),
              },
            ]}>
            <View style={styles.flexRow}>
              <View style={styles.mapContainer}>
                <View style={styles.mapContainer}>
                  {location?.lat &&
                  location?.lng &&
                  activeTrip?.pickup_geo?.lat &&
                  activeTrip?.pickup_geo?.lng &&
                  activeTripStatus !== 'delivered' ? (
                    <LiveMap
                      deliveryLocation={null}
                      deliveryPersonLocation={{
                        latitude: location?.lat,
                        longitude: location?.lng,
                      }}
                      hasAccepted={true}
                      hasPickedUp={false}
                      pickupLocation={{
                        latitude: activeTrip?.pickup_geo.lat,
                        longitude: activeTrip?.pickup_geo.lng,
                      }}
                    />
                  ) : (
                    <ActivityIndicator size="large" color="green" />
                  )}
                </View>
              </View>
              <View style={{width: '68%'}}>
                <CustomText variant="h5" fontFamily={Fonts.bold}>
                  Your trip is in progress!
                </CustomText>
              </View>
            </View>

            <TouchableOpacity onPress={handleContinuePress} style={styles.btn}>
              <CustomText
                variant="h7"
                style={{color: Colors.secondary}}
                fontFamily={Fonts.light}>
                Continue
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return WithLiveBooking;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: RMS(10),
    borderRadius: 15,
    paddingVertical: RMS(5),
  },
  btn: {
    flexShrink: 1,
    paddingHorizontal: RMS(10),
    paddingVertical: RMS(10),
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0.6,
  },

  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    height: RMS(80),
    width: RMS(100),
    overflow: 'hidden',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Shadow for Android
    elevation: 3,
  },
});

export default withLiveBooking;
