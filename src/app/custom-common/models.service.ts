import { Injectable } from '@angular/core';
import { Network, ERC20, Erc721Standard, Model } from '@taikai/dappkit';
import { BehaviorSubject, } from 'rxjs';
import { TransactionReceipt } from '@taikai/dappkit/dist/src/interfaces/web3-core';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor() { }

  readonly activeContractAddress$ = new BehaviorSubject<string>('');
  readonly activeModel$ = new BehaviorSubject<Model|null>(null);

  // any because typescript is too strict
  Models: {[k: string]: any} = {Network,ERC20,Erc721Standard,}

  output$ = new BehaviorSubject<TransactionReceipt|string>("");

  readonly deployedContracts$ = new BehaviorSubject<{rpc: string, model: string, contractAddress: string}[]>([]);

  addDeployedContract(rpc: string, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, {rpc, model, contractAddress}]);
  }
}
