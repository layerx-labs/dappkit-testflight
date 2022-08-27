import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Model } from '@taikai/dappkit';
import { ConnectorService } from '../connector.service';

@Component({
  selector: 'app-abi-connector',
  templateUrl: './abi-connector.component.html',
  styleUrls: ['./abi-connector.component.sass'],
})
export class AbiConnectorComponent implements OnInit {
  @Input() model!: Model;

  public selectedMiniFab = 0;

  constructor(readonly connector: ConnectorService,
              readonly route: ActivatedRoute) {}

  ngOnInit(): void {}
}
