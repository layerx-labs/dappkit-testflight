import { Injectable } from '@angular/core';
import { Web3Connection } from '@taikai/dappkit';
import { BehaviorSubject } from 'rxjs';

interface ChainItem {
  name: string;
  shortName: string;
  chainId: number;
  rpc: string;
  nativeCurrency: { symbol: string; name: string; decimals: number;}
}

interface ChainInfo {
  shortName: string;
  children: ChainItem[]
}

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor() {}

  readonly connected$ = new BehaviorSubject<boolean>(false);
  readonly pending$ = new BehaviorSubject<boolean>(false);
  readonly wrongChain$ = new BehaviorSubject<boolean>(false);
  readonly address$ = new BehaviorSubject<string>('');
  readonly wantsChainId$ = new BehaviorSubject<number>(0);
  readonly chainList$ = new BehaviorSubject<ChainItem[]>([]);

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

  async loadChainList() {
    if (this.chainList$.getValue().length)
      return;

    this.chainList$.next(
      (await (await fetch(`https://chainid.network/chains_mini.json`)).json())
        .filter((v: ChainItem) => v.rpc.length));
    return this.chainList$.getValue();
  }
}
