import { Injectable } from '@angular/core';

export interface Logline {
  level: 'info' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logLines: Array<Logline> = [];

  constructor() { }

  log(level: 'info' | 'error', string: string) {
    this.logLines.push({
      level: level,
      message: string
    });
  }

  clear() {
    this.logLines.splice(0);
  }
}
