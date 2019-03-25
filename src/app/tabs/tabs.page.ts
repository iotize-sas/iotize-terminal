import { TerminalService } from './../iotize/terminal.service';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Events, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public terminal: TerminalService,
    public events: Events,
    public changeDetector: ChangeDetectorRef) {
      this.events.subscribe('connected', () => this.changeDetector.detectChanges());
      this.events.subscribe('disconnected', () => this.changeDetector.detectChanges());
  }
  @ViewChild(IonTabs) tabs: IonTabs;

  async tabChanged() {
    console.log('tab changed');
    const label = await this.tabs.getSelected();
    console.log(`selected tab : ${label}`);
    if (label === 'terminal' && this.terminal.deviceService.isReady) {
      // this.terminal.launchReadingTask();
    } else {
      this.terminal.stopReadingTask();
    }
  }
}
