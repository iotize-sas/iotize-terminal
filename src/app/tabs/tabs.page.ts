import { TerminalService } from './../iotize/terminal.service';
import { Component, ViewChild } from '@angular/core';
import { Tabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public terminal: TerminalService) {
  }
  @ViewChild(Tabs) tabs: Tabs;

  async tabChanged() {
    console.log('tab changed');
    const label = (await this.tabs.getSelected()).label;
    console.log(`selected tab : ${label}`);
    if (label === 'Terminal' && this.terminal.deviceService.isReady) {
      this.terminal.launchReadingTask();
    } else {
      this.terminal.stopReadingTask();
    }
  }
}
