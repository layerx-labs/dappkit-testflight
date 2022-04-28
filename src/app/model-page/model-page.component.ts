import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '@taikai/dappkit';
import { Subject, takeUntil } from 'rxjs';
import { ConnectorService } from '../custom-common/connector.service';
import { ModelsService } from '../custom-common/models.service';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.sass']
})
export class ModelPageComponent implements OnInit, OnDestroy {
  constructor(
    readonly connector: ConnectorService,
    readonly models: ModelsService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  private destroy$ = new Subject<boolean>();

  changeModelOnPage() {
    const modelName = this.activeRoute.snapshot.paramMap.get('model');
    if (
      !modelName ||
      !Object.keys(this.models.Models$.value).includes(modelName)
    )
      this.router.navigate(['/']);
    else this.loadModelFromRouteParam(modelName);
  }

  ngOnInit(): void {
    //this.changeModelOnPage();
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.changeModelOnPage())

    this.models.activeModel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((model: Model|null) => {
        this.activeModel = model;
      });

    this.connector.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.changeModelOnPage())
  }

  activeModel: Model|null = null;

  loadModelFromRouteParam(modelName: string) {
    const _proxy = this.models.initModule(modelName);
    if (this.connector.connected) _proxy.loadAbi();
    this.models.activeModel$.next(_proxy);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
