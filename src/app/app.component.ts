import { Component } from '@angular/core';
import { ConnectorService } from './custom-common/connector.service';
import { Network, Model } from '@taikai/dappkit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'dappkit-example';

}
