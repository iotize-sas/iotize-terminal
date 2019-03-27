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

  bytesToMacAddress (bytes :number[]) {
    var dec, hexstring, bytesAsHexString = "";
    for (var i = bytes.length -1 ; i >= 0 ; i--) {
        if (bytes[i] >= 0) {
            dec = bytes[i];
        } else {
            dec = 256 + bytes[i];
        }
        hexstring = dec.toString(16).toUpperCase();
        // zero padding
        if (hexstring.length === 1) {
            hexstring = "0" + hexstring;
        }
        if (i!=(bytes.length -1)){
          bytesAsHexString += ":"
        }
        bytesAsHexString += hexstring;
    }
    return bytesAsHexString;
  }

  async onDiscoveredTap(nfcEvent) {
   
    var tag = nfcEvent.tag,
    ndefMessage = tag.ndefMessage;
    var macaddress = this.bytesToMacAddress(ndefMessage[2].payload.slice(1));
    await this.deviceService.NFCLoginAndBLEPairing(macaddress);      
  }
}
