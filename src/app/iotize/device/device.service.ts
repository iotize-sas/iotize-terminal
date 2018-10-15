import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  isReady = false;
  // device: IoTizeDevice;
  connectionPromise: Promise<void>;

  constructor() { }
}
