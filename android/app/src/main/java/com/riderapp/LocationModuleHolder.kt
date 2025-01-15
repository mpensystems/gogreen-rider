package com.riderapp

object LocationModuleHolder {
    private var instance: LocationModule? = null

    fun setInstance(module: LocationModule) {
        instance = module
    }

    fun getInstance(): LocationModule? {
        return instance
    }
}
