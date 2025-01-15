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

import React, {createContext, useContext, useState} from 'react';

const MapRefContext = createContext(null);

export const useMapRef = () => useContext(MapRefContext);

export const MapRefProvider = ({children}) => {
  const [mapRef, setMapRef] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  return (
    <MapRefContext.Provider value={{mapRef, setMapRef, mapReady, setMapReady}}>
      {children}
    </MapRefContext.Provider>
  );
};
