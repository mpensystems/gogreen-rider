

package com.riderapp

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap

class LocationModule(private val reactContext: ReactApplicationContext) 
    : ReactContextBaseJavaModule(reactContext) {

    private var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null
    private var listenersCount = 0

    init {
        LocationModuleHolder.setInstance(this)  // Register this module instance
    }

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun startLocationService() {
        if (listenersCount > 0) {  // Start service only if listeners exist
            Log.d("LocationModule", "Starting LocationService...")
            val serviceIntent = Intent(reactContext, LocationService::class.java)
            reactContext.startService(serviceIntent)
        } else {
            Log.d("LocationModule", "No listeners registered. Skipping service start.")
        }
    }

    @ReactMethod
    fun stopLocationService() {
        val serviceIntent = Intent(reactContext, LocationService::class.java)
        reactContext.stopService(serviceIntent)
        Log.d("LocationModule", "Location service stopped.")
    }

    @ReactMethod
    fun addListener(eventName: String) {
        listenersCount++
        Log.d("LocationModule", "Listener added. Total listeners: $listenersCount")

        if (listenersCount == 1) {
            // Initialize event emitter only on first listener
            eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            startLocationService()  // Start service when the first listener is added
        }
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenersCount -= count
        if (listenersCount <= 0) {
            listenersCount = 0
            eventEmitter = null
            stopLocationService()  // Stop service when no listeners remain
        }
        Log.d("LocationModule", "Listeners removed. Remaining listeners: $listenersCount")
    }

    @ReactMethod
    fun getListenersCount(promise: Promise) {
        promise.resolve(listenersCount)
    }

    fun onLocationError(errorMessage: String) {
        // Emit location error to React Native
        val params: WritableMap = Arguments.createMap()
        params.putString("error", errorMessage)
        eventEmitter?.emit("locationError", params)
    }

    fun onLocationUpdate(latitude: Double, longitude: Double) {
        Log.d("LocationModule", "Location update received: ($latitude, $longitude)")

        if (listenersCount > 0) {
            val params = Arguments.createMap().apply {
                putDouble("latitude", latitude)
                putDouble("longitude", longitude)
            }
            eventEmitter?.emit("LocationUpdate", params)
        }
    }
}
