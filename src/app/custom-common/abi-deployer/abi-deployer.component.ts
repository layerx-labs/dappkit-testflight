import { Component, OnInit, OnDestroy, Input,} from '@angular/core';
import { AbiItem } from 'web3-utils';
import { FormControl, Validators, } from '@angular/forms';
import { ConnectorService } from '../connector.service';
import { Subject, takeUntil } from 'rxjs';
import { Model } from '@taikai/dappkit';
import { ModelsService } from '../models.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-abi-deployer',
  templateUrl: './abi-deployer.component.html',
  styleUrls: ['./abi-deployer.component.sass']
})
export class AbiDeployerComponent implements OnInit, OnDestroy {
  @Input() abi!: AbiItem[];
  constructor(readonly connector: ConnectorService, readonly models: ModelsService, readonly route: ActivatedRoute) { }

  deployArguments: {name: string; type: string, control: FormControl}[] = [];
  contractAddress: string = ``;
  prevContracts: string[] = [];
  activeContractAddress: string = ``;
  customContractAddress = new FormControl('', [Validators.required]);

  private destroy$ = new Subject();

  createDeployArguments(newModel: Model) {
    const _constructor = newModel.abi.filter(option => !option.anonymous && option.type === "constructor")[0]?.inputs;
    const _arguments = (_constructor || []).map(({name, type}, i) => ({type, name: name || `args${i}`, control: new FormControl({value: '', disabled: !this.connector.connected}, [Validators.required])}));
    this.deployArguments.splice(0, this.deployArguments.length, ..._arguments);
  }

  ngOnInit(): void {

    this.models.activeModel$
               .pipe(takeUntil(this.destroy$))
               .subscribe((newModel: Model|null) => {
                 if (!newModel)
                  return;
                 this.createDeployArguments(newModel);
                })

    this.connector.connected$
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: boolean) => {
          this.deployArguments.forEach(entry => entry.control[!value ? 'disable' : 'enable']({emitEvent: true}));
        });

    this.models.deployedContracts$
        .pipe(takeUntil(this.destroy$),)
        .subscribe((values: {model: string, contractAddress: string}[]) => {
          const modelName = this.route.snapshot.paramMap.get('model');
          this.prevContracts = values.filter(({model}) => model === modelName!).map(({contractAddress}) => contractAddress);
        })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  async deployJsonAbi() {

    // any because typescript can't be bothered with
    let activeModel: any = this.models.activeModel$.value!;
    if (!activeModel.deployJsonAbi) {
      const _modelName = this.route.snapshot.paramMap.get('model')!;
      activeModel = new this.models.Models[_modelName](this.connector.web3Connection);
      activeModel.loadAbi();
    }

    try {
      const _arguments = this.deployArguments.map(entry => entry.control.value);
      const deployed = await activeModel.deployJsonAbi(..._arguments)
      this.models.output$.next(deployed);
      this.addNewContract(deployed.contractAddress);
    } catch (e) {
      this.models.output$.next(e as any);
    }
  }

  loadContractAddress(contractAddress = this.customContractAddress.value) {
    const _activeModel = this.models.activeModel$.value;
    const _model = new Model(this.connector.web3Connection, _activeModel!.abi, contractAddress);
    _model.loadContract();
    this.models.activeModel$.next(_model);
    this.models.activeContractAddress$.next(contractAddress);
  }

  addNewContract(contract: string) {
    const rpc = this.connector.lastConnectedHost;
    const modelName = this.route.snapshot.paramMap.get('model');
    this.models.addDeployedContract(rpc, modelName!, contract);
  }

  log(event: any) {
    console.log(event);
  }
}
