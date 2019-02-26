import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DeviceService } from '../iotize/device/device.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() displayText: boolean;

  constructor(public toastController: ToastController,
              public alertCtrl: AlertController,
              public deviceService: DeviceService,
              public changeDetector: ChangeDetectorRef,
              public loadingCtrl: LoadingController) { }

  ngOnInit() {}

  async openLoginAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Login',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username',
          value: this.deviceService.username
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
          value: this.deviceService.password
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
          handler: async (data) => {
            alert.dismiss();
            this.deviceService.username = data['username'];
            this.deviceService.password = data['password'];
            await this.login();
            this.changeDetector.detectChanges();
          }
        }
      ]
    });
    alert.present();
  }

  async login() {
    const loader = await this.loadingCtrl.create({ message: 'Logging in' });
    loader.present();

    try {
      const logSuccess = await this.deviceService.login();
      loader.dismiss();
      if (logSuccess) {
        this.showToast(`Logged in as ${this.deviceService.username}`);
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
      const logSuccess = await this.deviceService.logout();
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
}
