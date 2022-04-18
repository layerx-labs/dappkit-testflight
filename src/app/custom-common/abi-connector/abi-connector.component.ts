import { Component, OnInit, Input } from '@angular/core';
import { ConnectorService } from '../connector.service';
import { Network, Model } from '@taikai/dappkit';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-abi-connector',
  templateUrl: './abi-connector.component.html',
  styleUrls: ['./abi-connector.component.sass']
})
export class AbiConnectorComponent implements OnInit {

  @Input() model!: Model;
  constructor(readonly connector: ConnectorService, readonly route: ActivatedRoute) { }

  ngOnInit(): void {}

}
