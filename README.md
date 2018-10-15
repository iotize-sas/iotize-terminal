# IoTize BLE Terminal example app

This application serves as a simple demonstration of the IoTize API and cordova BLE plugin. This will be made using Ionic 4, a cross-platform framework, based on Cordova and Angular6 technologies.

Here is the reference to install Ionic, and start a project :

[Ionic tutorial](https://ionicframework.com/docs/intro/installation/)

## Creation of the ionic project

For this project, we are going to use an Ionic template, tabs, which is a simple 3 tabs layout template. To create our project, we are going to use the ionic CLI :

    ionic start iotizeTerminal tabs

After the creation of the project, enter the folder and launch the app on a browser, to check that it has been installed correctly using :

    ionic serve

## Installation of IoTize dependencies

We need to install in our project the IoTize API, and the cordova plugin, using npm and ionic CLI

    npm install @iotize/device-client.js --save
    ionic cordova plugin add @iotize/cordova-plugin-iotize-ble

We also need the rxjs-compat dependency

    npm install rxjs-compat

## IoTize device service generation

The IoTize device will be served across the application through a service, that we generate with the command:

    ionic generate service iotize/device