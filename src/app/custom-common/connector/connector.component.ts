import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { ConnectorService } from '../connector.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModelsService } from '../models.service';
import {filter, map, Observable, startWith, Subject, takeUntil, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";




@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.sass']
})
export class ConnectorComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() rpcUrl = `https://kovan.infura.io/v3/`;
  @Input() rpcKey = ``;
  @Input() showInputs = true;
  @Input() showRpcUrl = true;
  @Input() showPrivateKey = true;

  private destroyed$ = new Subject();
  private wrongChainId = false;


  constructor(readonly connector: ConnectorService,
              readonly models: ModelsService,
              private cd: ChangeDetectorRef,
              private snack: MatSnackBar) { }

  rpcUrlControl = new FormControl(this.rpcUrl, [Validators.required, this.isUrl]);
  selectedChain = new FormControl('', [Validators.min(1)]);
  rpcPrivateKeyControl = new FormControl(this.rpcKey, []);
  hasMetamask = !!(window as any).ethereum;
  viewAddress = '';
  filteredChainList!: Observable<any>;

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

  displaySelectedChain(item: {name: string, shortName: string}) {
    return item && (item.name || item.shortName) || '';
  }

  ngOnInit() {
    this.connector.address$
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => !!v),
        map(v => [v.substring(0, 6), '...', v.substring(v.length - 4)].join("")))
      .subscribe(v => {
        this.viewAddress = v;
        this.cd.detectChanges();
      });

    this.filteredChainList =
      this.selectedChain.valueChanges
        .pipe(
          takeUntil(this.destroyed$),
          startWith(''),
          map(v =>
            this.connector.chainList$.getValue()
              .filter(({name, shortName, nativeCurrency: {symbol, name: cName}}) =>
              typeof v === "string"
                ? [name, shortName, symbol, cName].some(k => k.toLowerCase().includes((v || '').toLowerCase()))
                : typeof v === "object"
                  ? name === v.name
                  : !v
                    ? this.connector.chainList$.getValue()
                    : false)))

    this.selectedChain.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => typeof v === "object"),
        tap(v => this.connector.wantsChainId$.next(v)), // side effect
        filter(_ => !!(window as any)?.ethereum?.chainId),
        map(({chainId}) => Number((window as any)?.ethereum?.chainId) !== chainId))
      .subscribe((bool) => {
        if (!bool)
          this.snack.dismiss();
        else
          this.snack.open('Selected chain does not match the one connected!');

        this.wrongChainId = bool;
      });

    this.selectedChain.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => !v))
      .subscribe(() => {
        this.wrongChainId = false;
        this.connector.wantsChainId$.next(0);
        this.snack.dismiss();
      })

  }

  async ngAfterViewInit() {
    let tries = 5;

    const getChainId = async () => {
      if (!(window as any)?.ethereum?.chainId && tries) {
        tries = tries - 1;
        setTimeout(() => getChainId(), 300);
        return;
      }

      const chains = await this.connector.loadChainList();

      if (tries) {
        const chainId = Number((window as any)?.ethereum?.chainId);
        this.selectedChain.setValue(chains?.find(v => v.rpc.length && v.chainId === chainId));

        console.log(this.selectedChain.value);
      } else {
        console.log(`Failed to get an active chain id`)
      }
    }

    getChainId();
  }

  addChainSelected() {}

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  async connect() {
    if (!this.wrongChainId)
      await this.connector.connect();
    else {

      if (!this.selectedChain.value)
        return this.connector.connect();

      const request = (method: string, params: {[key: string]: any}[]) =>
        (window as any).ethereum.request({method, params});

      const chainId = `0x${Number(this.selectedChain.value.chainId).toString(16)}`
      try {
        await request('wallet_switchEthereumChain', [{chainId}]);
      } catch (e: any) {
        if (e.code === 4902) {
          try {
            const {name: chainName, nativeCurrency, rpc: rpcUrls, explorers = []} = this.selectedChain.value;

            const payload = {
              chainId, chainName, nativeCurrency, rpcUrls,
              blockExplorerUrls: explorers.length ? explorers.map((ex: {url: string}) => ex.url) : null,
            }

            await request('wallet_addEthereumChain', [payload]);
            await this.connector.connect();
            this.snack.dismiss();
            this.wrongChainId = false;
          } catch (_e: any) {
            this.snack.open(_e.message, 'Error!');
          }
        } else {
          this.snack.open(e.message, 'Error!');
        }
      }
    }
  }
}
