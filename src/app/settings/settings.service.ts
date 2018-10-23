import { interval } from 'rxjs';
import { DeviceService } from './../iotize/device/device.service';
import { LoggerService } from './../iotize/logger.service';
import { Injectable } from '@angular/core';
import { UartSettings } from '@iotize/device-client.js/device/model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public BAUD_RATES: Array<number> = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200,
    187500, 230400, 460800, 921600];
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = [];

  _settings: UartSettings; // real settings
  settings: UartSettings; // displayed settings

  constructor(public logger: LoggerService,
    public deviceService: DeviceService) {
    this._settings = {
      physicalPort: 'USB',
      stopBit: 'ONE',
      parity: 'NONE',
      dataBitsLength: 8,
      handshake: 'NONE',
      handshakeDelimiter: 'NONE',
      timeout: 50,
      baudRate: 187500,
      ofs: 0
    };
    this.settings = Object.assign({}, this._settings);
  }

  async getUARTSettings(): Promise<void> {
    try {
      const response = await this.deviceService.device.service.target.getUARTSettings();

      if (response.isSuccess()) {
        this._settings = response.body();
        this.settings = Object.assign({}, this._settings);
        return;
      }
      throw new Error('getUARTSettings response failed');
      
    } catch (error) {
      throw error;
    }
  }

  async setUARTSettings(): Promise<void> {
    try {
      console.log('>>>>>>> logging as admin');
      // await this.deviceService.device.login('admin', 'admin');
      console.log('>>>>>>> disconnecting');
      await this.deviceService.device.service.target.postDisconnect();

      console.log('>>>>>>> waiting after disconnect');

      console.log('>>>>>>> setUARTSettings');
      const response = await this.deviceService.device.service.target.setUARTSettings(this._settings);
      if (response.isSuccess()) {
        console.log('>>>>>>> connecting');
        await this.deviceService.device.service.target.postConnect();
        return;
      } else {

        throw new Error('setUARTSettings response failed');
      }

    } catch (error) {
      this.logger.log('error', error);
      throw (error);
    }
  }

  // These are to be able to bind ofs to a select button
  // otherwise a 0 value automatically sets itself as undefined

  get ofs() {
    return this.settings.ofs.toString();
  }

  set ofs(value: string) {
    this.settings.ofs = Number(value);
  }

  async applyChanges() {
    // REAL IMPLEMENTATION
    try {
      this._settings = Object.assign({}, this.settings);
      await this.setUARTSettings();
    } catch (error) {
      this.logger.log('error', error);
      throw (error);
    }

    // MOCKED IMPLEMENTATION
    // console.log('mocked TerminalService.applyChanges');
    // return new Promise<void>((resolve) => {
    //   setTimeout(() => {
    //     this._settings = Object.assign({}, this.settings);
    //     this.logger.log('info', 'resolved');
    //     console.log('resolved');
    //     resolve();
    //   }, 2000);
    // });
  }

  discardChanges() {
    this.settings = Object.assign({}, this._settings);
  }

  settingsHasChanged(): boolean {

    for (const prop in this._settings) {
      if (this.settings[prop] !== this._settings[prop]) {
        return true;
      }
    }
    return false;
  }
}
