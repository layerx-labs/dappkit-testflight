import { Injectable } from '@angular/core';
import { ERC20, Erc721Standard, Model, Network } from '@taikai/dappkit';
import { TransactionReceipt } from '@taikai/dappkit/dist/src/interfaces/web3-core';
import { BehaviorSubject } from 'rxjs';
import { CustomModel } from 'src/models/customModel';
import { ConnectorService } from './connector.service';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(readonly connector: ConnectorService) {}

  readonly activeContractAddress$ = new BehaviorSubject<string>('');
  readonly activeModel$ = new BehaviorSubject<Model|null>(null);

  public Models$ = new BehaviorSubject<{ [k: string]: any }>({
    Network,
    ERC20,
    Erc721Standard,
  });

  jsonAbi: { [contractsNames: string]: any } = {};

  output$ = new BehaviorSubject<TransactionReceipt|string>("");

  readonly deployedContracts$ = new BehaviorSubject<
    { rpc: string; model: string; contractAddress: string }[]
  >([]);

  addDeployedContract(rpc: string, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, { rpc, model, contractAddress }]);
  }

  addModel(contract: any): string {
    const currentList = this.Models$.value;
    const exists = Object.keys(currentList).filter(
      (key) => key.startsWith(contract?.contractName)
    );
    const key = contract.contractName + (exists.length && `_${exists.length+1}` || '')
    this.jsonAbi[key] = contract;
    this.Models$.next({ ...currentList, [key]: CustomModel });
    return key;
  }

  initModule(moduleName: string) {
    const module = this.Models$.value[moduleName];
    const jsonAbi = this.jsonAbi?.[moduleName];
    const instance = jsonAbi
      ? new module(this.connector.web3Connection, jsonAbi)
      : new module(this.connector.web3Connection);
    return instance;
  }
}
