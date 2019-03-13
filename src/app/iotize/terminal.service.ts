import { FormatHelper } from '@iotize/device-client.js/core';
import { SettingsService } from './../settings/settings.service';
import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { ResultCodeTranslation } from '@iotize/device-client.js/client/api/response';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  isReading = false;
  private refreshTime = 1000;
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = [];

  constructor(public logger: LoggerService,
              public deviceService: DeviceService,
              public settings: SettingsService) {
              }

  async send(data: Uint8Array) {
    try {
      const response = (await this.deviceService.device.service.target.send(data));
      if (response.isSuccess()) {
        if (response.body() === null) {
          this.logger.log('info', 'sent');
          return;
        }
      }
      this.logger.log('error', `Device responded ${ResultCodeTranslation[response.codeRet()]}`);
    } catch (error) {
      if (error.message) {
        this.logger.log('error', error.message);
      } else {
        this.logger.log('error', error);
      }
    }
  }
  sendString(textToSend: string) {

    let data: Uint8Array;
    let suffix = '';

    for (const end of this.endOfLine) {
      if (end === 'CR') {
        suffix += '\r';
      }
      if (end === 'LF') {
        suffix += '\n';
      }
    }
    switch (this.dataType) {
      case 'HEX':
      data = FormatHelper.hexStringToBuffer(textToSend);
      break;
      case 'ASCII':
      data = FormatHelper.toByteBuffer(textToSend + suffix);
      break;
    }
    console.log(`sending: ${textToSend + suffix}`);
    this.send(data);
  }

  async read() {
    try {
      const response = (await this.deviceService.device.service.target.readBytes());
      if (response.isSuccess()) {
        if (response.body() !== null) {
          let responseString = '';
          if (this.dataType === 'ASCII') {
            responseString = FormatHelper.toAsciiString(response.body());
          } else if (this.dataType === 'HEX') {
            responseString = FormatHelper.toHexString(response.body());
          }
          this.logger.log('info', responseString);
                }
        return;
      }
      this.logger.log('error', `Device responded ${ResultCodeTranslation[response.codeRet()]}`);
    } catch (error) {
      if (error.message) {
        this.logger.log('error', error.message);
      } else {
        this.logger.log('error', error);
      }
    }
  }

  launchReadingTask() {
    this.isReading = true;
    console.log('creating reading task observable');
    const timer = interval(this.refreshTime);
    const reading = timer.subscribe(() => {
      if (this.isReading) {
        this.read();
        return;
      }
      console.log('unsubscribing from reading task');
      reading.unsubscribe();
    });
  }

  stopReadingTask() {
    this.isReading = false;
  }
}
