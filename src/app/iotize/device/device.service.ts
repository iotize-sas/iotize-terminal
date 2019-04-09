import { Injectable } from '@angular/core';
import { IoTizeDevice, SessionState } from '@iotize/device-client.js/device';
import { ComProtocol } from '@iotize/device-client.js/protocol/api';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  isReady = false;
  device: IoTizeDevice;
  connectionPromise = null;
  username = '';
  password = '';
  session?: SessionState = null;

  get isLogged(): boolean {
    if (this.session) {
      return this.session.name !== 'anonymous';
    }
    return false;
  }

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
      await this.checkSessionState();
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
      await this.checkSessionState();
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
      if (logSuccess) {
        await this.checkSessionState();
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
      await this.checkSessionState();
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async checkSessionState() {
    if (!this.device.isConnected()) {
      this.session = null;
      return;
    }
    const previouslyConnectedProfile = this.session? this.session.name : '';
    this.session = await this.device.refreshSessionState();
    if (previouslyConnectedProfile !== ''){ // not the first sessionState
      if (this.session.name === 'anonymous') {
        this.events.publish('logged-out');
      } else if (previouslyConnectedProfile !== this.session.name){
        this.events.publish('logged-in', this.session.name);
      }
    } 
  }
}
