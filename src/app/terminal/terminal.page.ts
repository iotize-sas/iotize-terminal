import { TerminalModalPage } from './terminal-modal/terminal-modal.page';
import { Content, ModalController } from '@ionic/angular';
import { LoggerService, Logline } from './../iotize/logger.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TerminalService } from '../iotize/terminal.service';

@Component({
  selector: 'app-terminal',
  templateUrl: 'terminal.page.html',
  styleUrls: ['terminal.page.scss']
})
export class TerminalPage implements OnInit {

  @ViewChild(Content) content: Content;

  data = '';
  linesCount = 0;

  logLines: Array<Logline> = [];
  constructor(public terminal: TerminalService,
    public logger: LoggerService,
    public changeDetector: ChangeDetectorRef,
    public modalController: ModalController) { }

  ngOnInit() {
    this.logger.getLogLinesObservable()
      .subscribe((logLine) => {
        this.logLines.push(logLine);
        this.changeDetector.detectChanges();
        this.content.scrollToBottom(0);
      });
  }

  send(data: string) {
    if (data !== '') {
      this.terminal.sendString(data);
    }
  }

  clear() {
    this.logLines.splice(0);
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: TerminalModalPage
    });

    return await modal.present();
  }
}
