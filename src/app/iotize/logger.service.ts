import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logText = '';

  constructor() { }

  log(level: 'info' | 'error', string: string) {
    this.logText += `[${level.toUpperCase()}]: ${string}`;
  }

  clear() {
    this.logText = '';
  }
}
