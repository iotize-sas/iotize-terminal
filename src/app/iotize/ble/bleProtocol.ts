import { ComProtocolConnectOptions, ComProtocolDisconnectOptions, ComProtocolSendOptions } from '@iotize/device-client.js/protocol/api';
import { QueueComProtocol } from '@iotize/device-client.js/Protocol/impl/queue-com-protocol';
import { FormatHelper } from '@iotize/device-client.js/core';
import {from} from 'rxjs';

declare var iotizeBLE: any;

export class IoTizeBLEProtocol  extends QueueComProtocol {

   constructor(name: string) {
       super();
       this.deviceName = name;
       this.options.connect.timeout = 5000;
   }

   private deviceName = '';

    log(level: 'info' | 'error' | 'debug', ...args: any[]): void {
        console[level](level.toUpperCase() + ' [IoTizeBLEProtocol] | ' + args.map((e) => {
            if (typeof e === 'object') {
                e = JSON.stringify(e);
            }
            return e;
        }).join(' '));
    }


    _connect(options?: ComProtocolConnectOptions) {
        this.log('info', '_connect', options);
        return this._toObservable(this._cordovaCallToPromise(
            iotizeBLE.connect,
            this.deviceName
        ));
    }


    _disconnect(options?: ComProtocolDisconnectOptions) {
        return this._toObservable(this._cordovaCallToPromise(
            iotizeBLE.disConnect,
            this.deviceName
        ));
    }

    write(data: Uint8Array): Promise<any> {
        throw new Error('Method not implemented.');
    }

    read(): Promise<Uint8Array> {
        throw new Error('Method not implemented.');
    }

    send(data: Uint8Array, options ?: ComProtocolSendOptions) {
        const promise = this._cordovaCallToPromise<string>(
                iotizeBLE.send,
                this.deviceName,
                FormatHelper.toHexString(data)
            )
            .then((hexString: string) => FormatHelper.hexStringToBuffer(hexString));
        return this._toObservable(promise);
    }

    protected _toObservable(promise: Promise<any>) {
        return from(promise) as any;
    }

    protected _cordovaCallToPromise<T>(cordovaFct: (...args: any[]) => any, ...args: any[]) {
        if (!cordovaFct) {
            this.log('error', 'INTERNAL ERROR UNKOWN CORDOVA FUNCTION');
        }
        this.log('debug', 'Call to ', cordovaFct.name, ...args);
        return new Promise<T>((resolve, reject) => {
            args.push((result) => {
                this.log('debug', 'success handler ', result);
                resolve(result);
            });
            args.push((err) => {
                this.log('error', 'error handler ', err);
                reject(err);
            });

            cordovaFct.apply(iotizeBLE, args);
        });
    }

 }

