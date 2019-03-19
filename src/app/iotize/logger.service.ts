import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export interface Logline {
  level: 'info' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  
  public static LineSeparator = '\r\n';
  
  logLines$: Subject<Logline>;
  lastLogLevel?: 'info' | 'error';

  constructor() {
    this.logLines$ = new Subject<Logline>();
  }

  log(level: 'info' | 'error', string: string) {
    console[level](`[${level.toUpperCase()}] : ${string}`);

    if (level === 'error') {
      string += LoggerService.LineSeparator;
      if (this.lastLogLevel === 'info') {
        string = LoggerService.LineSeparator + string;
      }
    }
    this.logLines$.next({
      level: level,
      message: string
    });
    this.lastLogLevel = level;
  }

  getLogLinesObservable() {
    return this.logLines$.asObservable();
  }
}
