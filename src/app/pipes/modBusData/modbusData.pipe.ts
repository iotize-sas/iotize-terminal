import { Pipe, PipeTransform } from '@angular/core';
import { VariableFormat } from '@iotize/device-client.js/device/model';
import { ModbusReadAnswer } from '../../iotize/terminal.service';

@Pipe({
  name: 'modbusData'
})
export class ModbusDataPipe implements PipeTransform {

  transform(input: ModbusReadAnswer): any[] {
    const array = [];
    if (input.format === VariableFormat._8_BITS) {
      for (let i = 0; i < input.dataArray.length; i++) {
        array.push(
          {
            key: (i + input.firstAddress).toString(16),
            value: input.dataArray[i]
          }
          );
      }
    }
    if (input.format === VariableFormat._16_BITS) {
      for (let i = 0; i < input.dataArray.length / 2; i += 2) {
        array.push(
          {
            key: (i + input.firstAddress).toString(16),
            value: input.dataArray[i] * 0x100 + input.dataArray[i + 1]
          }
        );
      }
    }
    if (input.format === VariableFormat._32_BITS) {
      for (let i = 0; i < input.dataArray.length / 4; i += 4) {
        array.push(
          {
            key: (i + input.firstAddress).toString(16),
            value: input.dataArray[i] * 0x1000000 + input.dataArray[i + 1] * 0x10000
                 + input.dataArray[i + 2] * 0x100 + input.dataArray[i + 3]
          }
        );
      }
    }
    return array;
  }
}