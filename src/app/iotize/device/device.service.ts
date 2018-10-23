import { Injectable } from '@angular/core';
import { IoTizeDevice } from '@iotize/device-client.js/device';
import { ComProtocol } from '@iotize/device-client.js/protocol/api';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  isReady = false;
  device: IoTizeDevice;
  connectionPromise = null;

  constructor() {}

  async init(protocol: ComProtocol) {
    this.isReady = false;
    try {
      this.device = IoTizeDevice.create();
      console.log('device created');
      this.connectionPromise = this.connect(protocol);
      console.log('waiting for connection promise');
      await this.connectionPromise;
      this.isReady = true;
    } catch (error) {
      console.error('init failed');
      console.error(error);
      throw new Error('Connection Failed');
    }
  }

  connect(protocol: ComProtocol): Promise<void> {
    return this.device.connect(protocol);
  }

  async disconnect(): Promise<void> {
    try {
      this.isReady = false;
      await this.device.disconnect();
    } catch (error) {
      console.log(error);
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
}
