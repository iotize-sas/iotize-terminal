import { BleService } from './../iotize/ble/ble.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ble-devices',
  templateUrl: './ble-devices.component.html',
  styleUrls: ['./ble-devices.component.scss']
})
export class BleDevicesComponent implements OnInit {

  constructor(public ble: BleService) { }

  ngOnInit() {
  }

}
