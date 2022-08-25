import {Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import { ConnectorService } from '../connector.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModelsService } from '../models.service';
import {filter, map, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.sass']
})
export class ConnectorComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();

  @Input() rpcUrl = `https://kovan.infura.io/v3/`;
  @Input() rpcKey = ``;
  @Input() showInputs = true;
  @Input() showRpcUrl = true;
  @Input() showPrivateKey = true;

  constructor(readonly connector: ConnectorService,
              readonly models: ModelsService,private cd: ChangeDetectorRef) { }

  rpcUrlControl = new FormControl(this.rpcUrl, [Validators.required, this.isUrl]);
  rpcPrivateKeyControl = new FormControl(this.rpcKey, []);
  hasMetamask = !!(window as any).ethereum;
  activeAddress = '';

  isUrl(control: AbstractControl) {
    const ele = document.createElement('input');
    ele.type = "url";
    ele.value = control.value;
    return ele.checkValidity() ? null: {url: true};
  }

  get rpcControlErrorText(): string {
    return this.rpcUrlControl.invalid ? this.rpcUrlControl.hasError('required') ? 'required' : 'Invalid url' : '';
  }

  listenToPending() {
    const address = this.connector.address$.value;
    const contractAddress = this.models.activeContractAddress$.value;
    this.connector.web3Connection.eth.getPendingTransactions()
        .then(txs => txs.filter(({from, to}) => from === address && to === contractAddress))
        .then(filtered => filtered.length > 0)
        .then(bool => {
          this.connector.pending$.next(bool);
          setTimeout(() => this.listenToPending(), 500);
        })
  }

  ngOnInit() {
    this.connector.address$
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => !!v),
        map(v => [v.substring(0, 6), '...', v.substring(v.length - 4)].join("")))
      .subscribe(v => {
        this.activeAddress = v;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
