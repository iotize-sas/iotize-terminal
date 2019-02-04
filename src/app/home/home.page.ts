import { LoadingController, ToastController, Events } from '@ionic/angular';
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
              public toastCtrl: ToastController,
              public events: Events) {}

  ngOnInit(): void {
    this.devicesSubscription = this.ble.devicesObservable()
    .subscribe((device) => {
      if (this.devices.map((entry) => entry.address).indexOf(device.address) >= 0) {
        return;
      } else {
        console.log('device.address:', device.address, 'not found in devices');
        console.log(this.devices);
      }
      this.devices.push(device);
      this.changeDetector.detectChanges();
    }, (error) => {
      console.error(error);
    });
    this.events.subscribe('disconnected', () => this.changeDetector.detectChanges());
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

  async disconnect() {
    const loader = await this.loadingCtrl.create({
      message: 'disconnecting',
    });
    loader.present();
    try {
      await this.ble.disconnect();
    } catch (error) {
      console.error(error);
    }
    loader.dismiss();
    console.log(this.ble.selectedDevice);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.devicesSubscription = null;
  }

  startScan() {
    this.devices.splice(0);
    this.ble.startScan();
  }
}
