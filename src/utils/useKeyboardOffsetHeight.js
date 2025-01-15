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

import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';



export default function useKeyboardOffsetHeight(){
    const [keyboardOffsetHeight, setKeyboardOffsetHeight]  = useState(0);


    useEffect(()=>{
        const keyboardWillAndroidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }

        )

        const keyboardWillAndroidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            e => {
                setKeyboardOffsetHeight(0);
            }

        );

        //For ios keyboard
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }

        )

        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }

        )


        return ()=>{
            keyboardWillAndroidHideListener.remove();
            keyboardWillAndroidShowListener.remove();
            keyboardWillHideListener.remove();
            keyboardWillShowListener.remove();

        };
    },[]);

    return keyboardOffsetHeight;
}