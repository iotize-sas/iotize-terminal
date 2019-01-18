import { FormatHelper } from '@iotize/device-client.js/core';
import { SettingsService } from './../settings/settings.service';
import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  isReading = false;
  private refreshTime = 1000;
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = ['CR','LF'];
  public responseString = "";

  constructor(public logger: LoggerService,
              public deviceService: DeviceService,
              public settings: SettingsService) {
              }

  async sendAndReceive(data: Uint8Array) {

    let i = 1;
    let globaltime = 0;
    while (i) {
      this.responseString = "";
      let sendingtime = Date.now();
      let response = (await this.deviceService.device.service.target.send(data));
      sendingtime = (Date.now() - sendingtime);

      if (response.isSuccess()) {
        if (response.body() === null) {

          //read
          let counter = 0;
          let notanswered = true;
          let answertime = 0;
          while (notanswered && (counter < 10)) {
            await sleep(10);
            counter++;
            let localanswertime = Date.now();
            response = (await this.deviceService.device.service.target.read());
            if (response.isSuccess()) {
              if (response.body() !== null) {
                localanswertime = Date.now() - localanswertime;
                answertime += localanswertime;
                this.responseString = FormatHelper.toAsciiString(response.body());
                if (((this.responseString.length - 2) >= 0) &&
                  (this.responseString[this.responseString.length - 2] == '>')) {
                  globaltime += (answertime + sendingtime) - (10*counter);
                  this.logger.log('info', "sending " + i + " :" + sendingtime + " anwser: " + answertime + " average: " + (globaltime/i));                  
                  notanswered = false;
                }
              }
              else {
                this.logger.log('error', "read with null body and error code :" + response.codeRet());
              }
            }            
          }
          if (counter >= 10){
            this.logger.log('error', "reception missed"  + this.responseString);
          }
        }
        else {
          this.logger.log('error', "send error with code " + response.codeRet());
        }
      }
      else {
        this.logger.log('info', "sending " + i + "error");
      }

      await sleep(1000);
      i++;
    }
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
      this.logger.log('error', 'response failed');
    } catch (error) {
      this.logger.log('error', error);
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
    
    this.sendAndReceive(data);
  }

  async read() {
    try {
      const response = (await this.deviceService.device.service.target.read());
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
      this.logger.log('error', 'response failed');
    } catch (error) {
      this.logger.log('error', error);
    }
  }

  launchReadingTask() {
    this.isReading = true;
    return;
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
