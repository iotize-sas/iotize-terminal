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
    this.loader = null;
    this.loader = await this.loadingCtrl.create();
    this.loader.message = message;
    this.loader.present();
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
  async openLoginAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Login',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: (data) => {
            alert.dismiss();
            this.login(data.username, data.password);
          }
        }
      ]
    });
    alert.present();
  }

  async login(username: string, password: string) {
    const loader = await this.loadingCtrl.create({ message: 'Logging in' });
    loader.present();

    try {
      const logSuccess = await this.terminal.deviceService.login(username, password);
      loader.dismiss();
      if (logSuccess) {
        this.showToast(`Logged in as ${username}`);
      } else {
        this.showToast(`Wrong username or password`);
      }

    } catch (error) {
      loader.dismiss();
      console.error(error);
      this.showClosingToast(`Login error : ${error}`);
    }

  }

  async openLogoutAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            alert.dismiss();
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }

  async logout() {
    const loader = await this.loadingCtrl.create({ message: 'Logging out' });
    loader.present();

    try {
      const logSuccess = await this.terminal.deviceService.logout();
      loader.dismiss();
      if (logSuccess) {
        this.showToast(`Logged out`);
      } else {
        this.showToast(`Could not log out`);
      }

    } catch (error) {
      loader.dismiss();
      console.error(error);
      this.showClosingToast(`Logout error : ${error}`);
    }
  }
  // Doesn't work with tabs?
  // ionViewCanLeave(): Promise<boolean> {
  //   console.log('ViewCanLeave?');
  // return this.changeSettings();
  // }

}
