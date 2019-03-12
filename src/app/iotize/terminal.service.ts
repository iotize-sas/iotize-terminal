import { FormatHelper } from '@iotize/device-client.js/core';
import { SettingsService } from './../settings/settings.service';
import { DeviceService } from './device/device.service';
import { LoggerService } from './logger.service';
import { Injectable } from '@angular/core';
import { ModbusOptions, VariableFormat } from '@iotize/device-client.js/device/model';
import { ResultCode } from '@iotize/device-client.js/client/api/response';
import { NumberConverter } from '@iotize/device-client.js/client/impl';

export interface ModbusReadAnswer {
  firstAddress: number;
  dataArray: Uint8Array;
  format: VariableFormat;
  objectType: ModbusOptions.ObjectType;
}

export class ModbusTerminalOptions implements ModbusOptions {
  constructor(options: ModbusOptions) {
    this.address = options.address;
    this.slave = options.slave;
    this.format = options.format;
    this.length = options.length;
    this.objectType = options.objectType;
  }
  address: number;
  slave: number;
  format: VariableFormat;
  length: number;
  objectType: ModbusOptions.ObjectType;

  get objectTypeString(): string {
    return ModbusOptions.ObjectType[this.objectType];
  }
  get formatString(): string {
    return VariableFormat[this.format];
  }
}

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  displayMode: 'HEX' | 'DEC' = 'HEX';
  isReading = false;
  private refreshTime = 1000;
  dataType: 'ASCII' | 'HEX' = 'ASCII';
  endOfLine: Array<string> = [];

  modbusOptions = new ModbusTerminalOptions({
    address: 0,
    slave: 1,
    format: VariableFormat._16_BITS,
    length: 1,
    objectType: ModbusOptions.ObjectType.DEFAULT
  });

  constructor(public logger: LoggerService,
    public deviceService: DeviceService,
    public settings: SettingsService) {
  }

  async sendNumber(data: number) {
    const dataArray: Uint8Array = NumberConverter.uint16Instance().encode(data);
    return this.modBusWrite(dataArray, this.modbusOptions);
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
  // sendString(textToSend: string) {

  //   let data: Uint8Array;
  //   let suffix = '';

  //   for (const end of this.endOfLine) {
  //     if (end === 'CR') {
  //       suffix += '\r';
  //     }
  //     if (end === 'LF') {
  //       suffix += '\n';
  //     }
  //   }
  //   switch (this.dataType) {
  //     case 'HEX':
  //     data = FormatHelper.hexStringToBuffer(textToSend);
  //     break;
  //     case 'ASCII':
  //     data = FormatHelper.toByteBuffer(textToSend + suffix);
  //     break;
  //   }
  //   console.log(`sending: ${textToSend + suffix}`);
  //   return this.send(data);
  // }

  // async read() {
  //   try {
  //     const response = (await this.deviceService.device.service.target.readBytes());
  //     if (response.isSuccess()) {
  //       if (response.body() !== null) {
  //         let responseString = '';
  //         if (this.dataType === 'ASCII') {
  //           responseString = FormatHelper.toAsciiString(response.body());
  //         } else if (this.dataType === 'HEX') {
  //           responseString = FormatHelper.toHexString(response.body());
  //         }
  //         this.logger.log('info', responseString);
  //               }
  //       return;
  //     }
  //     this.logger.log('error', 'response failed');
  //   } catch (error) {
  //     this.logger.log('error', error);
  //   }
  // }

  // launchReadingTask() {
  //   this.isReading = true;
  //   console.log('creating reading task observable');
  //   const timer = interval(this.refreshTime);
  //   const reading = timer.subscribe(() => {
  //     if (this.isReading) {
  //       this.read();
  //       return;
  //     }
  //     console.log('unsubscribing from reading task');
  //     reading.unsubscribe();
  //   });
  // }

  // stopReadingTask() {
  //   this.isReading = false;
  // }

  async modBusRead(firstTry: boolean = true): Promise<ModbusReadAnswer> {
    const firstAddress = this.modbusOptions.address, format = this.modbusOptions.format, objectType = this.modbusOptions.objectType;

    const response = await this.deviceService.device.service.target.modbusRead(this.modbusOptions);
    if (!response.isSuccessful()) {
      if (firstTry && response.codeRet() === ResultCode.IOTIZE_TARGET_PROTOCOL_COM) {
        await this.deviceService.device.service.target.connect();
        return this.modBusRead(false);
      }
      throw response.codeRet();
    }

    console.log(response.body());
    return {
      dataArray: response.body(),
      firstAddress: firstAddress,
      format: format,
      objectType: objectType
    };
  }

  async modBusWrite(values: Uint8Array, options: ModbusOptions): Promise<void> {
    const response = await this.deviceService.device.service.target.modbusWrite({
      options: options,
      data: values
    });
    if (!response.isSuccessful()) {
      throw response.codeRet();
    }
  }
}
