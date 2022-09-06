import { Injectable } from '@angular/core';
import { Web3Connection } from '@taikai/dappkit';
import { BehaviorSubject } from 'rxjs';
import {PromiEvent, TransactionReceipt} from "web3-core";
import {Contract} from "web3-eth-contract";
import Timeout = NodeJS.Timeout;

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

type ResolveReject = (values?: any) => void

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
  readonly output$ = new BehaviorSubject<TransactionReceipt|null>(null);
  readonly pendingTx$ = new BehaviorSubject<string[]>([]);

  private _lastChainId: number = 0;
  get lastChainId() { return this._lastChainId; }

  private _web3Connection!: Web3Connection;
  get web3Connection() { return this._web3Connection; }

  /**
   * A basic custom transaction handler both for show and because metamask (sometimes) fails to call the confirmation event
   *
   * Every second, after getting a transactionHash, we will query the chain and when there's information about that transaction
   * we will return it. otherwise, if after 60 (about a minute) tries we don't have anything we reject it with a message.
   *
   * @param event
   * @param resolve
   * @param reject
   * @param debug
   */
  transactionHandler(event: PromiEvent<TransactionReceipt | Contract>,
                     resolve: ResolveReject,
                     reject: ResolveReject,
                     debug = false) {

    let _iban: string;
    let tries = 1;
    const maxTries = 60 // 1 per second

    const getTx = async (hash: string) =>
      this.web3Connection.eth.getTransactionReceipt(hash);

    const handleTransaction = (tx: any) => {
      if (!tx) {
        if (tries === maxTries)
          reject({message: `Failed to fetch transaction ${_iban} within ${maxTries}`})
        else startTimeout(_iban);
      } else {
        resolve(tx);
      }
    }

    const startTimeout = (hash: string) =>
      setTimeout(() => getTx(hash).then(handleTransaction), 1000);


    event.once(`transactionHash`, async (hash) => {
      try {
        _iban = hash;
        startTimeout(hash);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

    event.once('error', (error) => { reject(error); });
  }

  async connect() {
    const connection = new Web3Connection({customTransactionHandler: this.transactionHandler.bind(this)});

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
