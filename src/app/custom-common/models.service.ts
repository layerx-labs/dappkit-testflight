import {Injectable} from '@angular/core';
import {ERC20, Erc721Standard, Model, Network} from '@taikai/dappkit';
import {TransactionReceipt} from '@taikai/dappkit/dist/src/interfaces/web3-core';
import {BehaviorSubject} from 'rxjs';
import {CustomModel} from 'src/models/customModel';
import {ConnectorService} from './connector.service';

type DeployedContractMap = {rpc: string, model: string, contractAddress: string};

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

  readonly deployedContracts$ = new BehaviorSubject<DeployedContractMap[]>([]);

  addDeployedContract(rpc: string, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, { rpc, model, contractAddress }]);
  }

  addModel(contract: any): string {
    const currentList = this.Models$.value;
    const index = Object.keys(currentList).filter((key) => key.startsWith(contract?.contractName)).length;
    const key = index > 0 ? contract.contractName.concat(`_${index}`) : contract.contractName;
    this.jsonAbi[key] = contract;
    this.Models$.next({ ...currentList, [key]: CustomModel });
    return key;
  }

  initModule(moduleName: string) {
    const module = this.Models$.value[moduleName];
    const jsonAbi = this.jsonAbi?.[moduleName];

    return jsonAbi
      ? new module(this.connector.web3Connection, jsonAbi)
      : new module(this.connector.web3Connection);
  }
}
