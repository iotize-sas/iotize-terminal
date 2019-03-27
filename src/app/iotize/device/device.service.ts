import { Injectable } from '@angular/core';
import { IoTizeDevice } from '@iotize/device-client.js/device';
import { ComProtocol } from '@iotize/device-client.js/protocol/api';
import { Events } from '@ionic/angular';
import { BLEComProtocol } from '@iotize/cordova-plugin-iotize-ble';
import { Tap, SessionState } from "@iotize/device-client.js/device";
import { NFCComProtocol } from '../../../../plugins/cordova-plugin-iotize-device-com-nfc/src/www';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  isReady = false;
  device: IoTizeDevice;
  connectionPromise = null;
  connectedId = 0;
  username = '';
  password = '';

  constructor(public events: Events) { }
  // constructor(public settings: SettingsService) { }

  async init(protocol: ComProtocol) {
    this.isReady = false;
    try {
      this.device = IoTizeDevice.create();
      console.log('device created');
      this.connectionPromise = this.connect(protocol);
      console.log('waiting for connection promise');
      await this.connectionPromise;
      this.connectedId = (await this.device.service.interface.getCurrentProfileId()).body();
      console.log(await this.getSerialNumber());
      this.isReady = true;
      this.events.publish('connected');
    } catch (error) {
      console.error('init failed');
      console.error(error);
      throw new Error('Connection Failed: ' + (error.message? error.message : error));
    }
  }

  async NFCLoginAndBLEPairing(deviceAddress: string){

    try {
      //start a communication session in NFC
      await this.init(new NFCComProtocol());
      
      //enable NFC auto login
      await this.device.encryption(true);
      
      //check the user login
      let sessionState: SessionState = await this.device.refreshSessionState()
      console.log(`NFCLoginAndBLEPairing in NFC:  ` + JSON.stringify(sessionState)); 
      
      //connect to the device in BLE
      let bleCom : ComProtocol= new BLEComProtocol(deviceAddress)

      //start the BLE communication with the device
      this.device.useComProtocol(bleCom);
      await  this.device.connect()
      
      //check the connection
      sessionState = await this.device.refreshSessionState();
      console.log(`NFCLoginAndBLEPairing in BLE:  `+ JSON.stringify(sessionState));
    } catch (err) {
    console.error("Can't connect to TAP, try again" + JSON.stringify(err));
    console.error(err);
    }
   
  }

  connect(protocol: ComProtocol): Promise<void> {
    return this.device.connect(protocol);
  }

  async disconnect(): Promise<void> {
    try {
      this.isReady = false;
      await this.device.disconnect();
      this.events.publish('disconnected');
    } catch (error) {
      console.log(error);
      this.events.publish('disconnected');
      throw (error);
    }
  }

  async getSerialNumber(): Promise<string> {
    return (await this.device.service.device.getSerialNumber()).body();
  }

  clear() {
    this.isReady = false;
    this.device = null;
  }

  async login(): Promise<boolean> {
    try {
      console.log('trying to log as ', this.username);
      const logSuccess = await this.device.login(this.username, this.password);
      this.connectedId = (await this.device.service.interface.getCurrentProfileId()).body();
      return logSuccess;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<boolean> {
    try {
      await this.device.logout();
    } catch (error) {
      return false;
    }
    try {
      this.connectedId = (await this.device.service.interface.getCurrentProfileId()).body();
      return true;
    } catch (error) {
      return false;
    }
  }
}
