import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../../iotize/terminal.service';
import { ModbusOptions, VariableFormat } from '@iotize/device-client.js/device/model';

@Component({
  selector: 'app-modbus-modal',
  templateUrl: './modbus-modal.page.html',
  styleUrls: ['./modbus-modal.page.scss'],
})
export class ModbusModalPage implements OnInit {

  constructor(public terminal: TerminalService,
              public modal: ModalController) { }

  slave: number;
  address: number;
  _objectType: ModbusOptions.ObjectType;
  _format: VariableFormat;
  length: number;

  get objectType() {
    return this._objectType.toString();
  }

  set objectType(val: string) {
    console.log(`Setting objectType with ${val} <=> ${ModbusOptions.ObjectType[val]}`);
    this._objectType = Number(val);
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

  getSavedOptions() {
    this.slave = this.terminal.modbusOptions.slave;
    this.address = this.terminal.modbusOptions.address;
    this._objectType = this.terminal.modbusOptions.objectType;
    this._format = this.terminal.modbusOptions.format;
    this.length = this.terminal.modbusOptions.length;
  }

  saveOptions() {
    this.terminal.modbusOptions.slave = this.slave;
    this.terminal.modbusOptions.address = this.address;
    this.terminal.modbusOptions.objectType = this._objectType;
    this.terminal.modbusOptions.format = this._format;
    this.terminal.modbusOptions.length = this.length;
  }

  saveAndDismiss() {
    this.saveOptions();
    this.dismiss();
  }
}
