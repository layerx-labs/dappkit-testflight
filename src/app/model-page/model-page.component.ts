import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '@taikai/dappkit';
import {filter, Subject, takeUntil, takeWhile} from 'rxjs';
import { ConnectorService } from '../custom-common/connector.service';
import { ModelsService } from '../custom-common/models.service';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.sass']
})
export class ModelPageComponent implements OnInit, OnDestroy {
  constructor(readonly connector: ConnectorService,
              readonly models: ModelsService,
              private activeRoute: ActivatedRoute,
              private router: Router) {}

  private destroy$ = new Subject<boolean>();

  changeModelOnPage() {
    const modelName = this.activeRoute.snapshot.paramMap.get('model');
    if (!modelName || !Object.keys(this.models.models$.value).includes(modelName))
      this.router.navigate(['/']);

    else this.loadModelFromRouteParam(modelName);
  }

  ngOnInit(): void {

    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$),)
      .subscribe(() => this.changeModelOnPage())

    this.models.activeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((model: Model|null) => {
        this.activeModel = model;
      });

    this.connector.connected$
      .pipe(takeUntil(this.destroy$), filter(v => !!v))
      .subscribe(() => this.changeModelOnPage())
  }

  activeModel: Model|null = null;

  loadModelFromRouteParam(modelName: string) {
    const _proxy = this.models.initModule(modelName);

    _proxy.loadAbi();

    this.models.activeModel$.next(_proxy);
    console.log(_proxy);
    console.log(this.models.activeModel$.getValue())
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
