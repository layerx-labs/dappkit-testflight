import { Component, OnInit, Input } from '@angular/core';
import {AbiItem} from 'web3-utils';
import { FormControl, Validators, } from '@angular/forms';
import { ConnectorService } from '../connector.service';
import {Model} from '@taikai/dappkit'
import { ModelsService } from '../models.service';
import { Subject, takeUntil } from 'rxjs';
import { TransactionReceipt } from '@taikai/dappkit/dist/src/interfaces/web3-core';

interface Method {
name: string;
view: boolean;
arguments: {name: string, type: string; control: FormControl}[]
}

@Component({
  selector: 'app-abi-methods',
  templateUrl: './abi-methods.component.html',
  styleUrls: ['./abi-methods.component.sass']
})
export class AbiMethodsComponent implements OnInit {

  constructor(readonly connector: ConnectorService, readonly models: ModelsService) {}

  readonly methods: Method[] = [];
  readonly contractAddress = new FormControl('', [Validators.required]);
  public output = ``;

  private destroy$ = new Subject<boolean>();

  transpileFunctions() {
    const _activeModel = this.models.activeModel$.value!;
    const functions = _activeModel.abi.filter((option: any) => !option.anonymous && option.type === "function");
    this.methods.length = 0;
    this.methods.splice(0, this.methods.length - 1,
      ...functions.map((option) => ({name: option.name!, view: option.stateMutability === "view", arguments: (option.inputs || [])
                  .map((input, i) => ({name: input.name || `arg${i}`, type: input.type, control: new FormControl('')}))}))
    )
  }

  ngOnInit(): void {
    this.transpileFunctions()
    this.models.activeModel$.pipe(takeUntil(this.destroy$)).subscribe(() => this.transpileFunctions());
    this.models.output$
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: string | TransactionReceipt) => {
          this.output = JSON.stringify(value, null, 2)
        });
  }

  loadContract() {}

  async callContractMethod(method: {name: string; view: boolean; arguments: {control: FormControl}[]}) {
    const _model = this.models.activeModel$.value!;
    const _args = method.arguments.map(option => option.control.value);
    const action = _args.length ? _model.contract.methods[method.name](..._args) : _model.contract.methods[method.name]();
    let output;
    try {
        if (method.view)
        output = await _model.callTx(action);
        else
        output = await _model.sendTx(action);
    } catch (e) {
        output = e;
    }

    this.models.output$.next(output);
  }

}
