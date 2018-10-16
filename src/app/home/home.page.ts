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
              public changeDetector: ChangeDetectorRef) {}

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
  async connect(deviceAddress: string) {
    await this.ble.onConnect(deviceAddress);
    this.changeDetector.detectChanges();
  }

  async disconnect() {
    await this.ble.disconnect();
  }

  ngOnDestroy(): void {
    this.devicesSubscription = null;
  }
}
