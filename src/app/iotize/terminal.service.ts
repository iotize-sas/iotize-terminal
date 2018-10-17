import { SettingsService } from './../settings/settings.service';
import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  constructor(public logger: LoggerService,
              public deviceService: DeviceService,
              public settings: SettingsService) {
              }

  send(data: Uint8Array) {
    this.deviceService.device.service.target.send(data);
    throw new Error('Not implemented yet');
  }
}
