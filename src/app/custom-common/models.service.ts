import { Injectable } from '@angular/core';
import { ERC20, Erc721Standard, Model, Network } from '@taikai/dappkit';
import { TransactionReceipt } from '@taikai/dappkit/dist/src/interfaces/web3-core';
import { BehaviorSubject } from 'rxjs';
import { AbiItem } from 'web3-utils';
import { ConnectorService } from './connector.service';
@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(readonly connector: ConnectorService) {}

  readonly activeContractAddress$ = new BehaviorSubject<string>('');
  readonly activeModel$ = new BehaviorSubject<Model | null>(null);

  public models$ = new BehaviorSubject<{ [k: string]: any }>({
    Network: new Network(this.connector.web3Connection),
    ERC20: new ERC20(this.connector.web3Connection),
    Erc721Standard: new Erc721Standard(this.connector.web3Connection),
  });

  get Models() {
    return this.models$.value;
  }

  output$ = new BehaviorSubject<TransactionReceipt | string>('');

  readonly deployedContracts$ = new BehaviorSubject<
    { rpc: string; model: string; contractAddress: string }[]
  >([]);

  addDeployedContract(rpc: string, model: string, contractAddress: string) {
    const values = this.deployedContracts$.value;
    this.deployedContracts$.next([...values, { rpc, model, contractAddress }]);
  }

  addModels(abi: AbiItem[], name: string) {
    const newModel = new Model(this.connector.web3Connection, abi);
    const values = this.models$.value;
    this.models$.next({ ...values, [name]: newModel });
  }
}
