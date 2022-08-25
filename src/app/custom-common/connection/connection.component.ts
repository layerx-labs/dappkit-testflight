import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectorService} from "../connector.service";
import {ModelsService} from "../models.service";
import {filter, Subject, switchMap, switchScan, takeUntil} from "rxjs";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<boolean>();

  constructor(readonly connector: ConnectorService, readonly models: ModelsService) { }

  ngOnInit(): void {

    (window as any)?.ethereum?.on("accountsChanged", async () => { await this.connector.connect() });
    (window as any)?.ethereum?.on("chainChanged", async () => { await this.connector.connect() });

    this.connector.connected$
      .pipe(
        takeUntil(this.destroyed$),
        filter(v => v === true),
        switchMap(_ => this.models.activeModel$),
        filter(v => !!v))
      .subscribe((model) => {
        model?.loadAbi();
        this.models.activeModel$.next(model);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);

    (window as any)?.ethereum?.removeAllListeners("accountsChanged");
    (window as any)?.ethereum?.removeAllListeners("chainChanged");

    console.log('destroyed')
  }

}
