import { Component, OnInit, Input } from '@angular/core';
import { ConnectorService } from '../connector.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModelsService } from '../models.service';

@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.sass']
})
export class ConnectorComponent implements OnInit {
  @Input() rpcUrl = `https://kovan.infura.io/v3/`;
  @Input() rpcKey = ``;
  @Input() showInputs = true;
  @Input() showRpcUrl = true;
  @Input() showPrivateKey = true;

  constructor(readonly connector: ConnectorService, readonly models: ModelsService) { }

  rpcUrlControl = new FormControl(this.rpcUrl, [Validators.required, this.isUrl]);
  rpcPrivateKeyControl = new FormControl(this.rpcKey, []);

  isUrl(control: AbstractControl) {
    const ele = document.createElement('input');
    ele.type = "url";
    ele.value = control.value;
    return ele.checkValidity() ? null: {url: true};
  }

  ngOnInit(): void {
  }

  get rpcControlErrorText(): string {
    return this.rpcUrlControl.invalid ? this.rpcUrlControl.hasError('required') ? 'required' : 'Invalid url' : '';
  }

  listenToPending() {
    // might not be supported
    this.connector.web3Connection.eth.getPendingTransactions()
        .then(txs => txs.filter(({from, to}) => from === this.connector.address && to === this.models.activeContractAddress$.value))
        .then(filtered => filtered.length > 0)
        .then(bool => {
          this.connector.pending$.next(bool);
          setTimeout(() => this.listenToPending(), 500);
        })
  }

  async connect() {
    await this.connector.connect(this.rpcUrlControl.value, this.rpcPrivateKeyControl.value)
    if (this.connector.connected && this.models.activeModel$.value) {
      const _proxy =  this.models.activeModel$.value;
      _proxy.loadAbi();
      this.models.activeModel$.next(_proxy);
      //this.listenToPending()
    }

  }

}
