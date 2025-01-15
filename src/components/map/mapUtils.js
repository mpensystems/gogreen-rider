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

export const handleFitToPath = (
  mapRef,
  deliveryLocation,
  pickupLocation,
  hasPickedUp,
  hasAccepted,
  deliveryPersonLocation,
) => {
  let coordinates = [];

  if ((hasPickedUp || hasAccepted) && deliveryPersonLocation) {
    coordinates.push({
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
    });
  }

  if (pickupLocation) {
    coordinates.push({
      latitude: pickupLocation.latitude,
      longitude: pickupLocation.longitude,
    });
  }

  if (deliveryLocation) {
    coordinates.push({
      latitude: deliveryLocation.latitude,
      longitude: deliveryLocation.longitude,
    });
  }

  if (mapRef && coordinates.length > 0) {
    // Fit the camera to the path
    mapRef.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
    });

    if (hasPickedUp || hasAccepted) {
      const bearing = calculateBearing(
        deliveryPersonLocation,
        deliveryLocation || pickupLocation,
      );

      mapRef.animateCamera(
        {
          center: deliveryPersonLocation,
          heading: bearing,
          zoom: 16,
        },
        {duration: 1000},
      );
    }
  }
};

// // Helper function to calculate bearing between two points
const calculateBearing = (start, end) => {
  const startLat = start.latitude * (Math.PI / 180);
  const startLng = start.longitude * (Math.PI / 180);
  const endLat = end.latitude * (Math.PI / 180);
  const endLng = end.longitude * (Math.PI / 180);

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360;
};

// export const handleFitToPath = (
//   mapRef,
//   deliveryLocation,
//   pickupLocation,
//   hasPickedUp,
//   hasAccepted,
//   deliveryPersonLocation,
// ) => {
//   let coordinates = [];

//   if ((hasPickedUp || hasAccepted) && deliveryPersonLocation) {
//     coordinates.push({
//       latitude: deliveryPersonLocation.latitude,
//       longitude: deliveryPersonLocation.longitude,
//     });
//   }

//   if (pickupLocation) {
//     coordinates.push({
//       latitude: pickupLocation.latitude,
//       longitude: pickupLocation.longitude,
//     });
//   }

//   if (deliveryLocation) {
//     coordinates.push({
//       latitude: deliveryLocation.latitude,
//       longitude: deliveryLocation.longitude,
//     });
//   }

//   if (mapRef && coordinates.length > 0) {
//     // Fit the camera to the path
//     mapRef.fitToCoordinates(coordinates, {
//       edgePadding: {
//         top: 50,
//         right: 50,
//         bottom: 50,
//         left: 50,
//       },
//       animated: true,
//     });

//     // If the delivery person is moving, calculate the bearing and set camera orientation
//     if (hasPickedUp || hasAccepted) {
//       const bearing = calculateBearing(
//         deliveryPersonLocation,
//         deliveryLocation || pickupLocation,
//       );

//       // Animate the camera to set bearing (rotation) and flatten pitch
//       mapRef.animateCamera(
//         {
//           center: deliveryPersonLocation,
//           heading: bearing,
//           pitch: 0, // Set pitch to 0 for flat view
//           zoom: 17, // Set desired zoom level
//         },
//         {duration: 1000},
//       );
//     }
//   }
// };
