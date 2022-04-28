import { Injectable } from '@angular/core';
import { ERC20, Erc721Standard, Model, Network } from '@taikai/dappkit';
import { TransactionReceipt } from '@taikai/dappkit/dist/src/interfaces/web3-core';
import { BehaviorSubject } from 'rxjs';
import { ConnectorService } from './connector.service';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(readonly connector: ConnectorService) {}

  readonly activeContractAddress$ = new BehaviorSubject<string>('');
  readonly activeModel$ = new BehaviorSubject<Model | null>(null);

  public Models$ = new BehaviorSubject<{ [k: string]: any }>({
    Network,
    ERC20,
    Erc721Standard,
  });

  Abis: { [k: string]: any } = {};

  output$ = new BehaviorSubject<TransactionReceipt | string>('');

  readonly deployedContracts$ = new BehaviorSubject<
    { rpc: string; model: string; contractAddress: string }[]
  >([]);

  addDeployedContract(rpc: string, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, { rpc, model, contractAddress }]);
  }

  addModel(abi: any, name: string): string {
    const currentList = this.Models$.value;
    const existis = Object.keys(currentList).filter(
      (key) => key.split('(')[0] === name
    );
    const key = existis.length > 0 ? `${name}_${existis?.length + 1}` : name;
    this.Abis[key] = abi;
    this.Models$.next({ ...currentList, [key]: Model });
    return key;
  }

  initModule(moduleName: string) {
    const module = this.Models$.value[moduleName];
    const abi = this.Abis?.[moduleName];
    const instance = abi
      ? new module(this.connector.web3Connection, abi)
      : new module(this.connector.web3Connection);
    return instance;
  }
}
