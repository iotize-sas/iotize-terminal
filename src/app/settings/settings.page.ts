import { SettingsService } from './settings.service';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  loader: HTMLIonLoadingElement;

  constructor(public settings: SettingsService,
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
      await this.settings.applyChanges();
      this.loader.dismiss();
    } catch (error) {
      this.loader.dismiss();
      console.log(error);
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
}
  // Doesn't work with tabs?
  // ionViewCanLeave(): Promise<boolean> {
  //   console.log('ViewCanLeave?');
  // return this.changeSettings();
  // }

