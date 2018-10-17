import { LoggerService } from './../iotize/logger.service';
import { Component } from '@angular/core';
import { TerminalService } from '../iotize/terminal.service';

@Component({
  selector: 'app-terminal',
  templateUrl: 'terminal.page.html',
  styleUrls: ['terminal.page.scss']
})
export class TerminalPage {

  constructor(public terminal: TerminalService,
              public logger: LoggerService) {}

}
