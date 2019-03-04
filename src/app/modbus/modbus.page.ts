import { ModbusModalPage } from './modbus-modal/modbus-modal.page';
import { Content, ModalController, AlertController, ToastController } from '@ionic/angular';
import { LoggerService } from '../iotize/logger.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TerminalService, ModbusReadAnswer } from '../iotize/terminal.service';
import { VariableFormat, ModbusOptions } from '@iotize/device-client.js/device/model';
import { ResultCodeTranslation } from '@iotize/device-client.js/client/api/response';
import { ToastOptions } from '@ionic/core';
import { MockFactory } from '../iotize/mockFactory';

@Component({
  selector: 'app-terminal',
  templateUrl: 'modbus.page.html',
  styleUrls: ['modbus.page.scss']
})
export class ModbusPage implements OnInit {

  @ViewChild(Content) content: Content;

  data = '';
  linesCount = 0;

  lastModbusRead: ModbusReadAnswer = {
    dataArray: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
    firstAddress : 0x4000,
    format: VariableFormat._16_BITS,
    objectType: ModbusOptions.ObjectType.DEFAULT
  };  // Mocking

  constructor(public terminal: TerminalService,
    public logger: LoggerService,
    public changeDetector: ChangeDetectorRef,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.logger.getLogLinesObservable()
      .subscribe((logLine) => {
        // this.logLines.push(logLine);
        this.changeDetector.detectChanges();
        this.content.scrollToBottom(0);
      });
  }

  send(data: string) {
    if (data !== '') {
      this.terminal.sendString(data);
    }
  }

  clear() {
    // this.logLines.splice(0);
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: ModbusModalPage
    });

    return await modal.present();
  }

  formatToStringFactory() {
    const _this = this;
    const format = this.lastModbusRead.format;
    return function (val) {
      return _this.formatToStringClosure(val, format);
    };
  }

  formatToStringClosure(value, format) {
    if (format !== 0) {
      let result = value.toString(16);
      result = '0000000' + result;
      result = '0x' + result.slice(-(2 ** format));
      return result;
    }
    return !!value;
  }

  async read() {
    try {
      this.lastModbusRead = await this.terminal.modBusRead();
    } catch (error) {
      this.showToast(`Error: device responded ${ResultCodeTranslation[error]}`, 0);
    }
  }

  async showToast(msg: string, duration= 3000) {
    const toastOptions: ToastOptions = {message: msg};
    if (duration === 0) {
      toastOptions.showCloseButton = true;
    } else {
      toastOptions.showCloseButton = true;
      toastOptions.duration = duration;
    }
    (await this.toastCtrl.create(toastOptions)).present();
  }

  mockedModbusRead() {
    this.lastModbusRead = MockFactory.modbusReadAnswer();
    console.table(this.lastModbusRead);
  }
  canSend() {
    return (this.terminal.modbusOptions.objectType !== ModbusOptions.ObjectType.DISCRET_INPUT) &&
    (this.terminal.modbusOptions.objectType !== ModbusOptions.ObjectType.INPUT_REGISTER);
  }
}
