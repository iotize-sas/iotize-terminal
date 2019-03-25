import { Injectable } from '@angular/core';
import { DeviceService } from '../device/device.service';
import { NFCComProtocol } from '../../../../plugins/cordova-plugin-iotize-device-com-nfc/src/www';
import { NFC } from "@ionic-native/nfc/ngx";

@Injectable({
  providedIn: 'root'
})

export class NfcService {

  constructor(public deviceService: DeviceService,
    public nfc: NFC) { }

  listenNFC() {
    this.nfc.addNdefListener(() => {
      console.log('NFC listener ON')
    },
      (error) => {
        console.error('NFC listener didn\'t start: ', error)
      }).subscribe(event => {
        this.onDiscoveredTap(event);
      });

    this.nfc.addMimeTypeListener("text/bogus", () => {
      console.log('NFCMime listener ON')
    },
      (error) => {
        console.error('NFCMime listener didn\'t start: ', error)
      }).subscribe(event => {
        this.onDiscoveredTap(event);
      });
  }

  async onDiscoveredTap(event) {
    try {
      if (!this.deviceService.isReady) {
        console.warn("NFC Event:");
        console.warn(event);
        console.log('trying to connect to tap');
        await this.deviceService.init(new NFCComProtocol());
        console.log('connected!');
      }
    } catch (err) {
      console.error("Can't connect to TAP, try again");
    }
  }
}
