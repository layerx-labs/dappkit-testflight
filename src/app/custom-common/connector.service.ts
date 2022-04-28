import { Injectable } from '@angular/core';
import { Web3Connection } from '@taikai/dappkit';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor() {}

  readonly connected$ = new BehaviorSubject<boolean>(false);
  readonly pending$ = new BehaviorSubject<boolean>(false);

  private _address: string = ``;
  private _lastConnectedHost: string = ``;
  get lastConnectedHost() { return this._lastConnectedHost; }

  get address() { return this._address; }
  get connected(): boolean { return !!this._address; }


  private _web3Connection!: Web3Connection;
  get web3Connection() { return this._web3Connection; }


  async connect(web3Host: string, privateKey?: string) {
    this._web3Connection = new Web3Connection({web3Host, privateKey});
    this._web3Connection.start();
    if (!privateKey)
      await this._web3Connection.connect();
    this._address = await this._web3Connection.getAddress();
    this.connected$.next(this.connected);
    this._lastConnectedHost = web3Host;
  }
}
