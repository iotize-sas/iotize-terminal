# IoTize BLE Terminal example app

iotize-terminal is a simple demonstration App showing how to use Iotize Device API in a Cordova based app. 

This sample is based on a tabs based Ionic 4 App. 
[Ionic tutorial](https://ionicframework.com/docs/intro/installation/)


## Installation of IoTize Device API

IoTize Device API and the cordova plugin, using npm and ionic CLI

    npm install @iotize/device-client.js --save
    ionic cordova plugin add @iotize/cordova-plugin-iotize-ble

## IoTize Device service generation

In this example DeviceService class gives access to a global instance of IotizeDevice object enabling the communication between the app and the device through the API. 
Please refer to the [API documentation center](http://developer.iotize.com/content/device-api/quick-start/) to learn more about the API and its usage.

## Building Ionic App for ios

If you are using XCode 9+, you might get a warning saying that the swift version used is 2.x, and that XCode 9+ can't build the app. You can change this by opening the iOS platform's xcodeproj file, access build settings (within the project file) and select "Swift 3" in the Swift Language Version selector.