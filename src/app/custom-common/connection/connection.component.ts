import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectorService} from "../connector.service";
import {ModelsService} from "../models.service";
import {combineLatest, filter, map, Subject, switchMap, switchScan, takeUntil} from "rxjs";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<boolean>();

  constructor(readonly connector: ConnectorService,
              readonly models: ModelsService) { }

  ngOnInit(): void {

    (window as any)?.ethereum?.on("accountsChanged", async () => { await this.connector.connect() });
    (window as any)?.ethereum?.on("chainChanged", async () => { await this.connector.connect() });

    this.connector.connected$
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => v === true),
        map(_ => this.models.activeModel$.getValue()),
        filter(v => !!v))
      .subscribe((model) => {
        model?.loadAbi();
        this.models.activeModel$.next(model);
      });

    this.connector.address$
      .pipe(takeUntil(this.destroyed$),
        filter(v => !!v))
      .subscribe((address: string) => {
        this.connector.output$.next({connected: new Date(), chainId: this.connector.lastChainId, address} as any)
      })

  }

  ngOnDestroy() {
    this.destroyed$.next(true);

    (window as any)?.ethereum?.removeAllListeners("accountsChanged");
    (window as any)?.ethereum?.removeAllListeners("chainChanged");

    console.log('destroyed')
  }

}
