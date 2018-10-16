import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { UartSettings } from '@iotize/device-client.js/device/model';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  public BAUD_RATES: Array<number> = [110, 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200,
                                187500, 230400, 460800, 921600, 1843200, 3686400];
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = [];

  _settings: UartSettings;
  settings: UartSettings;
  baudRate = 187500;

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

  send(data: Uint8Array) {
    this.deviceService.device.service.target.send(data);
    throw new Error('Not implemented yet');
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
      this.logger.log('error', error);
    }
  }

  async setUARTSettings(): Promise<void> {
    try {
      this.deviceService.device.service.target.postDisconnect();

      const response = await this.deviceService.device.service.target.setUARTSettings(this._settings);

      if (response.isSuccess()) {
        this.deviceService.device.service.target.postConnect();
        return;
      }
      throw new Error('setUARTSettings response failed');

    } catch (error) {
      this.logger.log('error', error);
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

  validateChanges() {}

  settingsHasChanged(): boolean {
    const props = Object.getOwnPropertyNames(this._settings);
    for (let prop in props) {
      if (this.settings[prop] !== this._settings[prop]) {
        return false;
      }
    }
    return true;
  }
}
