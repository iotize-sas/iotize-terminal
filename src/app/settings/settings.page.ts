import { SettingsService } from './settings.service';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TerminalService } from '../iotize/terminal.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  loader: HTMLIonLoadingElement;

  constructor(public settings: SettingsService,
    public terminal: TerminalService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public changeDetector: ChangeDetectorRef) { }

  async changeSettings() {
    console.log('change settings');
    if (this.settings.settingsHasChanged()) {
      const confirm = await this.alertCtrl.create({
        header: 'Apply new settings',
        message: 'Are you sure?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.applyChanges();
            }
          },
        ]
      });
      await confirm.present();
    }
  }

  async applyChanges() {
    await this.loadingMessage('Applying new settings');
    try {
      this.terminal.isReading = false;
      await this.settings.applyChanges();
      this.loader.dismiss();
      console.log('apply changes ended, launching reading task');
      this.terminal.launchReadingTask();
    } catch (error) {
      this.loader.dismiss();
      console.error(error);
      throw error;
    }
  }
  async readSettingsFromTap() {
    await this.loadingMessage('Reading settings from tap');
    try {
      await this.settings.getUARTSettings();
      this.loader.dismiss();
    } catch (error) {
      this.loader.dismiss();
      console.error(error);
    }
  }

  async loadingMessage(message: string) {
    if (this.loader === undefined) {
      this.loader = await this.loadingCtrl.create();
    }
    this.loader.message = message;
    this.loader.present();
  }

  async testSetUART() {
    try {
      this.terminal.isReading = false;
      await this.settings.deviceService.device.service.target.postDisconnect();
      const confirm = await this.alertCtrl.create({
        header: 'Apply new settings',
        message: 'Are you sure?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes',
            handler: async () => {
              const response = await this.settings.deviceService.device.service.target.setUARTSettings(this.settings._settings);

              console.log('apply changes ended, launching reading task');
              if (response.isSuccess()) {
                console.log('>>>>>>> connecting');
                await this.settings.deviceService.device.service.target.postConnect();
                return;
              } else {
        
                throw new Error('setUARTSettings response failed');
              }
            }
          },
        ]
      });
      await confirm.present();

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
  // Doesn't work with tabs?
  // ionViewCanLeave(): Promise<boolean> {
  //   console.log('ViewCanLeave?');
  // return this.changeSettings();
  // }

