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

  logLines$: Subject<Logline>;

  constructor() {
    this.logLines$ = new Subject<Logline>();
  }

  log(level: 'info' | 'error', string: string) {
    this.logLines$.next({
      level: level,
      message: string
    });
    console[level](`[${level.toUpperCase()}] : ${string}`);
  }

  getLogLinesObservable() {
    return this.logLines$.asObservable();
  }
}
