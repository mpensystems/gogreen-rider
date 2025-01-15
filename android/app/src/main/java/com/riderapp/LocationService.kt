
package com.riderapp

import android.app.Service
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.location.Location
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments
import android.util.Log
import com.google.android.gms.location.Priority  
import android.content.pm.PackageManager
import android.location.LocationManager


class LocationService : Service() {

    private lateinit var fusedLocationProviderClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private val handler = Handler(Looper.getMainLooper())
    private var reactContext: ReactApplicationContext? = null

    private var locationModule: LocationModule? = null  // Reference to LocationModule

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            locationResult.lastLocation?.let { location ->
                Log.d("LocationCallback", "New location: Latitude: ${location.latitude}, Longitude: ${location.longitude}")
                // sendLocationToReactNative(location)
                // Log.d("LOCATION MODULE",locationModule.toString())
            LocationModuleHolder.getInstance()?.onLocationUpdate(location.latitude, location.longitude)


            }
        }
    }

    private val locationRunnable: Runnable = object : Runnable {
        override fun run() {
            requestLocationUpdates()
            handler.postDelayed(this, 30000) // 30 seconds
        }
    }

    companion object {
        const val CHANNEL_ID = "LocationServiceChannel"
        const val NOTIFICATION_ID = 1
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("GoGreen")
            .setContentText("Online")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()

        startForeground(NOTIFICATION_ID, notification)
        handler.post(locationRunnable)

    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Location Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    // private fun requestLocationUpdates() {
    //     locationRequest = LocationRequest.Builder(30000L)
    //         .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
    //         .build()

    //     fusedLocationProviderClient.requestLocationUpdates(
    //         locationRequest,
    //         locationCallback,
    //         Looper.getMainLooper()
    //     )
    // }



    private fun requestLocationUpdates() {
    // Check if permissions are granted
    if (checkLocationPermissions()) {
        // Check if GPS is enabled
        if (isGPSEnabled()) {
            locationRequest = LocationRequest.Builder(30000L)
                .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
                .build()

            fusedLocationProviderClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } else {
            Log.e("LocationService", "GPS is disabled.")
            handleLocationFailure("GPSDISABLED")
        }
    } else {
        Log.e("LocationService", "Location permissions are not granted.")
        handleLocationFailure("LOCATIONPERMISSIONDISABLED")
    }
}


private fun checkLocationPermissions(): Boolean {
    // Check if location permissions are granted
    val fineLocationPermission = checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    val coarseLocationPermission = checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
    return fineLocationPermission || coarseLocationPermission
}

private fun isGPSEnabled(): Boolean {
    val locationManager = getSystemService(LOCATION_SERVICE) as LocationManager
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
}


private fun handleLocationFailure(reason: String) {
    Log.e("LocationService", "Location retrieval failed: $reason")
    // Notify React Native of the error
    locationModule?.onLocationError(reason)
}





    override fun onDestroy() {
        super.onDestroy()
        fusedLocationProviderClient.removeLocationUpdates(locationCallback)
        handler.removeCallbacks(locationRunnable)
        reactContext = null
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }


private fun sendLocationToReactNative(location: Location) {
    Log.d("LocationService", "Sending location to React Native: Latitude: ${location.latitude}, Longitude: ${location.longitude}")
    locationModule?.onLocationUpdate(location.latitude, location.longitude)

}



    fun setReactContext(context: ReactApplicationContext) {
        reactContext = context
        locationModule = LocationModule(context)
    }
}


