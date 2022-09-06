import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Model } from '@taikai/dappkit';
import { Subject, takeUntil, } from 'rxjs';
import { AbiItem } from 'web3-utils';
import { ConnectorService } from '../connector.service';
import { ModelsService } from '../models.service';

@Component({
  selector: 'app-abi-deployer',
  templateUrl: './abi-deployer.component.html',
  styleUrls: ['./abi-deployer.component.sass']
})
export class AbiDeployerComponent implements OnInit, OnDestroy {
  @Input() abi!: AbiItem[];
  constructor(readonly connector: ConnectorService,
              readonly models: ModelsService,
              readonly route: ActivatedRoute) {}

  deployArguments: { name: string; type: string; control: FormControl }[] = [];
  contractAddress: string = ``;
  activeContractAddress: string = ``;
  customContractAddress = new FormControl('', [Validators.required]);

  private destroy$ = new Subject();

  createDeployArguments(newModel: Model) {

    const makeControl = () =>
      new FormControl({ value: '', disabled: !this.connector.connected$.value }, [Validators.required])

    const makeArgument = ({name, type}: {name: string, type: string}, i: number) =>
      ({ type, name: name || `args${i}`, control: makeControl(),})

    const _constructor = newModel.abi.find(({anonymous, type}) => !anonymous && type === 'constructor')?.inputs;
    const _arguments = (_constructor || []).map(makeArgument);
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
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  async deployJsonAbi() {
    // any because typescript can't be bothered with
    let activeModel: any = this.models.activeModel$.value!;
    if (!activeModel.deployJsonAbi) {
      const _modelName = this.route.snapshot.paramMap.get('model')!;
      activeModel = this.models.initModule(_modelName);
      activeModel.loadAbi();
    }

    try {
      const _arguments = this.deployArguments.map(entry => entry.control.value);
      const deployed = await activeModel.deployJsonAbi(..._arguments)
      this.connector.output$.next(deployed);
      await this.addNewContract(deployed.contractAddress);
    } catch (e: any) {
      console.error(e);
      this.connector.output$.next(e?.message || e);
    }
  }

  async addNewContract(contract: string) {
    const chainId = await this.connector.web3Connection.eth.getChainId()
    const modelName = this.route.snapshot.paramMap.get('model');
    this.models.addDeployedContract(chainId, modelName!, contract);
  }

  log(event: any) {
    console.log(event);
  }
}
