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

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import localStorage from '@utils/localstorage.js';
// Import translations
import {bn} from './Locales/bn.js';
import {en} from './Locales/en.js';
import {gu} from './Locales/gu.js';
import {hi} from './Locales/hi.js';
import {kn} from './Locales/kn.js';
import {ml} from './Locales/ml.js';
import {mr} from './Locales/mr.js';
import {or} from './Locales/or.js';
import {pj} from './Locales/pj.js';
import {ta} from './Locales/ta.js';
import {te} from './Locales/te.js';
import {ur} from './Locales/ur.js';

i18n.use(initReactI18next).init({
  fallbackLng: ['en'],
  lng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    bn: {translation: bn},
    en: {translation: en},
    gu: {translation: gu},
    hi: {translation: hi},
    kn: {translation: kn},
    ml: {translation: ml},
    mr: {translation: mr},
    or: {translation: or},
    pj: {translation: pj},
    ta: {translation: ta},
    te: {translation: te},
    ur: {translation: ur},
  },
  react: {
    useSuspense: false,
  },
});

// Handle language persistence
const loadLanguage = async () => {
  try {
    const storedLanguage = await localStorage.get('selectedLanguage');

    if (storedLanguage) {
      console.log(storedLanguage, 'STORED_LANGUAGE');
      console.log(typeof storedLanguage, 'TYPE_OF_STORED_LANGUAGE');

      i18n.changeLanguage(storedLanguage);
    }
  } catch (error) {
    console.error('Error loading language:', error);
  }
};

loadLanguage();

export default i18n;
