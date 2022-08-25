import {Component, Input, OnInit} from '@angular/core';
import {ConnectorService} from "../connector.service";
import {BehaviorSubject} from "rxjs";
import {Model} from "@taikai/dappkit";

@Component({
  selector: 'app-not-connected-or-active-model',
  templateUrl: './not-connected-or-active-model.component.html',
  styleUrls: ['./not-connected-or-active-model.component.sass']
})
export class NotConnectedOrActiveModelComponent {
  @Input() notConnected = "";
  @Input() noModelValue = "";
  @Input() modelValue$ = new BehaviorSubject<any>(null);

  constructor(readonly connector: ConnectorService,) { }

}
