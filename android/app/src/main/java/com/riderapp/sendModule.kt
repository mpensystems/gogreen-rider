package com.riderapp

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule

class SendModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {



    private var listenerCount = 0

    override fun getName(): String {
        return "SendModule"
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }
        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }

      @ReactMethod
    fun triggerEvent() {
        // Example of sending an event
        // val params = Arguments.createMap().apply {
        //     putString("eventProperty", "someValue")
        // }


          val params = Arguments.createMap().apply {
                putDouble("latitude", 1234345.33)
                putDouble("longitude", 3243.34534)
            }
        sendEvent(reactApplicationContext, "EventReminder", params)
    }
}
