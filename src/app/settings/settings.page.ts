import { SettingsService } from './settings.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TerminalService } from '../iotize/terminal.service';
import { UartSettings } from '@iotize/device-client.js/device/model';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  constructor(public settings: SettingsService,
    public terminal: TerminalService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public changeDetector: ChangeDetectorRef,
    public toastController: ToastController) { }

  get UartSettings() {
    return UartSettings;
  }

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
    const loader = await this.loadingCtrl.create( {message: 'Applying new settings'});
    loader.present();
    try {
      await this.settings.applyChanges();
      loader.dismiss();
      console.log('apply changes ended, launching reading task');
    } catch (error) {
      loader.dismiss();
      this.showToast(error);
    }
  }
  async readSettingsFromTap() {
    const loader = await this.loadingCtrl.create( {message: 'Reading settings from tap'});
    loader.present();
    try {
      await this.settings.getUARTSettings();
      loader.dismiss();
    } catch (error) {
      loader.dismiss();
      console.error(error);
      await this.showToast(`ERROR : ${error}`);
    }
  }

  async showToast(message: string, duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });

    toast.present();
  }

  async showClosingToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
    });

    toast.present();
  }

  async testSetUART() {
    try {
      await this.settings.deviceService.device.service.target.disconnect();
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
                await this.settings.deviceService.device.service.target.connect();
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
