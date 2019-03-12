import { DeviceService } from './../iotize/device/device.service';
import { LoggerService } from './../iotize/logger.service';
import { Injectable } from '@angular/core';
import { UartSettings } from '@iotize/device-client.js/device/model';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public BAUD_RATES: Array<number> = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200,
    187500, 230400, 460800, 921600];

  _settings: UartSettings; // real settings
  settings: UartSettings; // displayed settings

  constructor(public logger: LoggerService,
    public deviceService: DeviceService,
    public events: Events) {
    this._settings = {
      physicalPort: UartSettings.PhysicalPort.USB,
      stopBit: UartSettings.StopBit.ONE,
      bitParity: UartSettings.BitParity.NONE,
      dataBitsLength: UartSettings.DataBitsLength._7,
      handshakeValue: UartSettings.Handshake.NONE,
      handshakeDelimiter: UartSettings.HandshakeDelimiter.NONE,
      timeout: 50,
      baudRate: 187500,
      ofs: false,
      slv: 0
    };
    this.settings = Object.assign({}, this._settings);
    this.eventSubscribe();
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
      await this.deviceService.device.service.target.disconnect();

      console.log('>>>>>>> waiting after disconnect');

      console.log('>>>>>>> setUARTSettings');
      const response = await this.deviceService.device.service.target.setUARTSettings(this._settings);
      if (response.isSuccess()) {
        console.log('>>>>>>> connecting');
        await this.deviceService.device.service.target.connect();
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
    this.settings.ofs = Boolean(value);
  }

  get physicalPort() {
    return this.settings.physicalPort.toString();
  }
  set physicalPort(value) {
    this.settings.physicalPort = Number(value);
  }
  get handshakeValue() {
    return this.settings.handshakeValue.toString();
  }
  set handshakeValue(value) {
    this.settings.handshakeValue = Number(value);
  }
  get handshakeDelimiter() {
    return this.settings.handshakeDelimiter.toString();
  }
  set handshakeDelimiter(value) {
    this.settings.handshakeDelimiter = Number(value);
  }
  get dataBitsLength() {
    return this.settings.dataBitsLength.toString();
  }
  set dataBitsLength(value) {
    this.settings.dataBitsLength = Number(value);
  }
  get bitParity() {
    return this.settings.bitParity.toString();
  }
  set bitParity(value) {
    this.settings.bitParity = Number(value);
  }
  get stopBit() {
    return this.settings.stopBit.toString();
  }
  set stopBit(value) {
    this.settings.stopBit = Number(value);
  }

  async applyChanges() {
    // REAL IMPLEMENTATION
    try {
      this._settings = Object.assign({}, this.settings);
      await this.setUARTSettings();
    } catch (error) {
      this.logger.log('error', error);
      throw new Error('can\'t apply settings');
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

  eventSubscribe() {
    this.events.subscribe('connected', () => this.getUARTSettings());
  }
}
