import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class DestroyerService implements OnDestroy {
  readonly destroyed$ = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
