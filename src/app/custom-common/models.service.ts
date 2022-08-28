import {Injectable, Injector} from '@angular/core';
import {Model,} from '@taikai/dappkit';
import {TransactionReceipt} from '@taikai/dappkit/dist/src/interfaces/web3-core';
import {BehaviorSubject} from 'rxjs';
import {CustomModel} from 'src/models/customModel';
import {ConnectorService} from './connector.service';

type DeployedContractMap = {chainId: number, model: string, contractAddress: string};

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(readonly connector: ConnectorService,
              readonly injector: Injector) {}

  readonly activeContractAddress$ = new BehaviorSubject<string>('');
  readonly activeModel$ = new BehaviorSubject<Model|null>(null);

  readonly models$ = new BehaviorSubject<{ [k: string]: any }>(this.injector.get('DAPPKIT_MODELS'));

  jsonAbi: { [contractsNames: string]: any } = {};

  output$ = new BehaviorSubject<TransactionReceipt|null>(null);

  readonly deployedContracts$ = new BehaviorSubject<DeployedContractMap[]>([]);

  addDeployedContract(chainId: number, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, { chainId, model, contractAddress }]);
  }

  addModel(contract: any): string {
    const currentList = this.models$.value;
    const index = Object.keys(currentList).filter((key) => key.startsWith(contract?.contractName)).length;
    const key = index > 0 ? contract.contractName.concat(`_${index}`) : contract.contractName;
    this.jsonAbi[key] = contract;
    this.models$.next({ ...currentList, [key]: CustomModel });
    return key;
  }

  initModule(moduleName: string) {
    const module = this.models$.value[moduleName];
    const jsonAbi = this.jsonAbi?.[moduleName];

    return jsonAbi
      ? new module(this.connector.web3Connection, jsonAbi)
      : new module(this.connector.web3Connection);
  }
}
