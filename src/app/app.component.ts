import {Component, Injector} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor(readonly injector: Injector) {}
  dappkitVersion = this.injector.get('DAPPKIT_VERSION');

}
