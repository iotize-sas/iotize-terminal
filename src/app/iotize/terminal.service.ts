import { FormatHelper } from '@iotize/device-client.js/core';
import { SettingsService } from './../settings/settings.service';
import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ResultCodeTranslation } from '@iotize/device-client.js/client/api/response';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  readingTaskOn = false;
  private readingData = false;
  private refreshTime = 500;
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = [];
  timer: Observable<number> = null;
  readingTaskSubscription: Subscription = null;

  constructor(public logger: LoggerService,
    public deviceService: DeviceService,
    public settings: SettingsService) {
  }

  async send(data: Uint8Array) {
    try {
      const response = (await this.deviceService.device.service.target.send(data));
      if (response.isSuccess()) {
        if (response.body().byteLength === 0) {
          this.logger.log('info', 'sent: ');
          return;
        }
      } else {
        this.logger.log('error', `Device responded ${ResultCodeTranslation[response.codeRet()]}`);
      }
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

  async readAllTargetData() {
    this.readingData = true;
    try {
      const response = (await this.deviceService.device.service.target.readBytes());
      if (response.isSuccess()) {
        let responseBody = response.body();
        if (responseBody.byteLength > 0) {
          let responseString = '';
          if (this.dataType === 'ASCII') {
            responseString = FormatHelper.toAsciiString(responseBody);
          } else if (this.dataType === 'HEX') {
            responseString = FormatHelper.toHexString(responseBody);
          }
          this.logger.log('info', responseString);
          await this.readAllTargetData();
        } else {
          this.readingData = false;
        }
        return;
      } else {
        this.logger.log('error', `Device responded ${ResultCodeTranslation[response.codeRet()]}`);
      }
    } catch (error) {
      this.readingData = false;
      if (error.message) {
        this.logger.log('error', error.message);
      } else {
        this.logger.log('error', error);
      }
    }
  }

  launchReadingTask() {
    this.readingTaskOn = true;
    console.log('creating reading task observable');
    this.timer = interval(this.refreshTime).pipe(takeWhile(() => this.readingTaskOn));
    this.readingTaskSubscription = this.timer.subscribe(() => {
      if (!this.readingData) {
        this.readAllTargetData();
      }
    }, _ => console.error(_),
    () => console.log('Timer completed'));
  }

  stopReadingTask() {
    this.readingTaskOn = false;
  }
}
