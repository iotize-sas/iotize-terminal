import { Injectable } from '@angular/core';
import { IoTizeDevice } from '@iotize/device-client.js/device';
import { ComProtocol } from '@iotize/device-client.js/protocol/api';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  isReady = false;
  device: IoTizeDevice;
  connectionPromise: Promise<void>;

  constructor() { }


  async init(protocol: ComProtocol) {
    this.isReady = false;
    try {
      this.device = IoTizeDevice.create();
      console.log('device created');
      this.connectionPromise = this.connect(protocol);
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

  disconnect(): Promise<void> {
    return this.device.disconnect();
  }
}
