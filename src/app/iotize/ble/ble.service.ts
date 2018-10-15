import { DeviceService } from './../device/device.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  selectedDevice = 'test';
  constructor(public deviceService: DeviceService) { }
}
