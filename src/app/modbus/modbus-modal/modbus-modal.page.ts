import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../../iotize/terminal.service';
import { ModbusOptions, VariableFormat } from '@iotize/device-client.js/device/model';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-modbus-modal',
  templateUrl: './modbus-modal.page.html',
  styleUrls: ['./modbus-modal.page.scss'],
})
export class ModbusModalPage implements OnInit {

  constructor(public terminal: TerminalService,
              public modal: ModalController,
              private keyboard: Keyboard) { }

  slave: number;
  address: number;
  _objectType: ModbusOptions.ObjectType;
  _format: VariableFormat;
  length: number;
  displayMode: 'HEX' | 'DEC';

  get objectType() {
    return this._objectType.toString();
  }

  set objectType(val: string) {
    // console.log(`Setting objectType with ${val} <=> ${ModbusOptions.ObjectType[val]}`);
    this._objectType = Number(val);
    this._format = this._objectType === ModbusOptions.ObjectType.COIL || this._objectType === ModbusOptions.ObjectType.DISCRET_INPUT ?
                VariableFormat._1_BIT : VariableFormat._16_BITS;
  }

  get format() {
    return this._format.toString();
  }

  set format(val: string) {
    this._format = Number(val);
  }

  ngOnInit() {
    this.getSavedOptions();
  }
  dismiss() {
    this.modal.dismiss();
  }
  get ModbusOptions() {
    return ModbusOptions;
  }

  get VariableFormat() {
    return VariableFormat;
  }

  get canChangeFormat() {
    return this._objectType !== ModbusOptions.ObjectType.COIL && this._objectType !== ModbusOptions.ObjectType.DISCRET_INPUT;
  }

  getSavedOptions() {
    this.slave = this.terminal.modbusOptions.slave;
    this.address = this.terminal.modbusOptions.address;
    this._objectType = this.terminal.modbusOptions.objectType;
    this._format = this.terminal.modbusOptions.format;
    this.length = this.terminal.modbusOptions.length;
    this.displayMode = this.terminal.displayMode;
  }

  saveOptions() {
    this.terminal.modbusOptions.slave = this.slave;
    this.terminal.modbusOptions.address = this.address;
    this.terminal.modbusOptions.objectType = this._objectType;
    this.terminal.modbusOptions.format = this._format;
    this.terminal.modbusOptions.length = this.length;
    this.terminal.displayMode = this.displayMode;
  }

  saveAndDismiss() {
    this.saveOptions();
    this.dismiss();
  }

  closeKeyboard() {
    this.keyboard.hide();
  }
}
