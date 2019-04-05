import { Injectable } from '@angular/core';
import { IoTizeDevice } from '@iotize/device-client.js/device';
import { ComProtocol } from '@iotize/device-client.js/protocol/api';
import { Events } from '@ionic/angular';

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
      this.isReady = true;
      this.events.publish('connected');
    } catch (error) {
      console.error('init failed');
      console.error(error);
      throw new Error('Connection Failed: ' + (error.message? error.message : error));
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
      if (logSuccess) {
        this.events.publish('logged-in');
      }
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
