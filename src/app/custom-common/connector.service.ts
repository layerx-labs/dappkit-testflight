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
  readonly wrongChain$ = new BehaviorSubject<boolean>(false);
  readonly address$ = new BehaviorSubject<string>('');

  private _lastChainId: number = 0;
  get lastChainId() { return this._lastChainId; }

  private _web3Connection!: Web3Connection;
  get web3Connection() { return this._web3Connection; }

  async connect() {
    const connection = new Web3Connection({});

    await connection.connect();
    const address = await connection.getAddress();

    this._lastChainId = await connection.eth.getChainId();
    this._web3Connection = connection;

    this.address$.next(address);
    this.connected$.next(!!address);
  }
}
