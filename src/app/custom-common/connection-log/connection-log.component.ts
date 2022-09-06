import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {filter, map, takeUntil} from "rxjs";
import {DestroyerService} from "../destroyer.service";
import {ConnectorService} from "../connector.service";

@Component({
  selector: 'app-abi-connection-log',
  templateUrl: './connection-log.component.html',
  styleUrls: ['./connection-log.component.sass'],
  providers: [DestroyerService],
})
export class ConnectionLogComponent implements OnInit {

  public output: string[] = [];
  public fullscreen = false;

  constructor(readonly connector: ConnectorService,
              readonly destroyer: DestroyerService,
              readonly cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.connector.output$
      .pipe(
        takeUntil(this.destroyer.destroyed$),
        filter(v => !!v),
        map(v => JSON.stringify(v, null, 2)))
      .subscribe(v => {
        this.output.unshift(v);
        this.cd.detectChanges();
      })
  }

}
