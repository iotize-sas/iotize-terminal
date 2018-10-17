import { LoggerService, Logline } from './../iotize/logger.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TerminalService } from '../iotize/terminal.service';

@Component({
  selector: 'app-terminal',
  templateUrl: 'terminal.page.html',
  styleUrls: ['terminal.page.scss']
})
export class TerminalPage implements OnInit {

  logLines: Array<Logline> = [];
  constructor(public terminal: TerminalService,
    public logger: LoggerService,
    public changeDetector: ChangeDetectorRef ) { }

  ngOnInit() {
    this.logger.getLogLinesObservable()
      .subscribe((logLine) => {
        this.logLines.push(logLine);
        this.changeDetector.detectChanges();
      });
  }
}
