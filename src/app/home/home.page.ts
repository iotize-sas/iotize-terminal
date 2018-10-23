import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BleService, DiscoveredDeviceType } from './../iotize/ble/ble.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  private devicesSubscription: Subscription;
  devices: Array<DiscoveredDeviceType> = [];

  constructor(public ble: BleService,
              public changeDetector: ChangeDetectorRef,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {}

  ngOnInit(): void {
    this.devicesSubscription = this.ble.devicesObservable()
    .subscribe((device) => {
      if (this.devices.map((entry) => entry.address).indexOf(device.address) >= 0) {
        return;
      }
      this.devices.push(device);
      this.changeDetector.detectChanges();
    }, (error) => {
      console.error(error);
    });
  }
  async connect(device: DiscoveredDeviceType) {
    console.log(`connect to ${device.name}`);
    const loader = await this.loadingCtrl.create({
      message: 'connecting'
    });
    loader.present();
    try {
      await this.ble.onConnect(device.address);
      loader.dismiss();
    } catch (error) {
      loader.dismiss();
    }
    this.changeDetector.detectChanges();
  }

  disconnect() {
    this.ble.disconnect().then(() => {
      this.changeDetector.detectChanges();
  });
}

  ngOnDestroy(): void {
    this.devicesSubscription = null;
  }
}
