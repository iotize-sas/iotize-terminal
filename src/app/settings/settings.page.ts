import { SettingsService } from './settings.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TerminalService } from '../iotize/terminal.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  loader: any;

  constructor(public settings: SettingsService,
    public terminal: TerminalService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public changeDetector: ChangeDetectorRef,
    public toastController: ToastController) { }

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
      await this.settings.applyChanges();
      this.loader.dismiss();
      console.log('apply changes ended, launching reading task');
    } catch (error) {
      this.loader.dismiss();
      this.showToast(error);
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
      await this.showToast(`ERROR : ${error}`);
    }
  }

  async loadingMessage(message: string) {

    this.loader = await this.loadingCtrl.create();
    this.loader.message = message;
    this.loader.present();
  }

  async showToast(message: string, duration: number = 3000) {
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
      position: 'top',
    });

    toast.present();
  }


  async testSetUART() {
    try {
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

