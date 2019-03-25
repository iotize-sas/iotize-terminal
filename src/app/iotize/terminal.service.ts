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

  readBytesNumber = 0;
  errorCount = 0;

  readingTaskOn = false;
  private readingData = false;
  private refreshTime = 500;
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
          this.logger.log('info', 'sent: ');
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
  async sendString(textToSend: string) {

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
    await this.send(data);
    this.errorCount = 0;
    this.readBytesNumber = 0;
    await this.readAllTargetData();
    this.logger.log('error', `Error count: ${this.errorCount}, total read bytes: ${this.readBytesNumber}`);
  }

  async readAllTargetData() {
    console.log('reading ' + Date.now());
    this.readingData = true;
    try {
      const response = (await this.deviceService.device.service.target.readBytes());
      if (response.isSuccess()) {
        let responseBody = response.body();
        if (responseBody instanceof Uint8Array && responseBody.length !== 0) {
          let responseString = '';
          if (this.dataType === 'ASCII') {
            responseString = FormatHelper.toAsciiString(response.body());
          } else if (this.dataType === 'HEX') {
            responseString = FormatHelper.toHexString(response.body());
          }
          this.logger.log('info', responseString);
          this.readBytesNumber += response.body().length;
          await this.readAllTargetData();
        } else {
          this.readingData = false;
        }
        return;
      }

      this.logger.log('error', `Device responded ${ResultCodeTranslation[response.codeRet()]}`);
    } catch (error) {
      console.error(JSON.stringify(error));
      console.table(error);
      this.errorCount++;
      if (error.message) {
        this.logger.log('error', error.message);
      } else {
        this.logger.log('error', error);
      }

      await this.readAllTargetData();
    }
  }

  // launchReadingTask() {
  //   this.readingTaskOn = true;
  //   this.readingData = false;
  //   console.log('creating reading task observable');
  //   const timer = interval(this.refreshTime);
  //   const reading = timer.subscribe(async () => {
  //     if (this.readingTaskOn) {
  //       if (!this.readingData) {
  //         await this.readAllTargetData();
  //       }
  //       return;
  //     }
  //     console.log('unsubscribing from reading task');
  //     reading.unsubscribe();
  //   });
  // }

  stopReadingTask() {
    this.readingTaskOn = false;
  }
}
