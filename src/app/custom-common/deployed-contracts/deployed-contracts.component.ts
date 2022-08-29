import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Subject, takeUntil} from "rxjs";
import {ModelsService} from "../models.service";
import {ConnectorService} from "../connector.service";
import {ActivatedRoute} from "@angular/router";
import {Model} from "@taikai/dappkit";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-deployed-contracts',
  templateUrl: './deployed-contracts.component.html',
  styleUrls: ['./deployed-contracts.component.sass']
})
export class DeployedContractsComponent implements OnInit, OnDestroy {
  constructor(readonly models: ModelsService,
              readonly connector: ConnectorService,
              readonly route: ActivatedRoute) { }

  private destroy$ = new Subject();

  readonly customContractAddress = new FormControl('', [Validators.required]);
  readonly prevContracts$ = new BehaviorSubject<string[]>([]);

  ngOnInit(): void {

    combineLatest(this.models.deployedContracts$, this.connector.connected$)
      .pipe(takeUntil(this.destroy$),
        filter(([contracts, connected]) => !!(connected)),
        map(([contracts, ]) => contracts.filter(m => m.chainId === this.connector.lastChainId)),
        map(models => models.filter(({model}) => model === this.route.snapshot.paramMap.get('model'))),
        map(models => models.map(({contractAddress}) => contractAddress)))
      .subscribe((values) => {
        console.log(values);
        this.prevContracts$.next(values);
      })
  }

  loadContractAddress(contractAddress = this.customContractAddress.value) {
    const _activeModel = this.models.activeModel$.value;
    try {
      const _model = new Model(this.connector.web3Connection, _activeModel!.abi, contractAddress);
      _model.loadContract();
      this.models.activeModel$.next(_model);
      this.models.activeContractAddress$.next(contractAddress);
    } catch (e: any) {
      this.models.output$.next(e?.message as any || e)
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

}
