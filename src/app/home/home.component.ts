import {Component, Injector, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(readonly injector: Injector) { }

  ngOnInit(): void {
    console.log(this.injector.get('DAPPKIT_VERSION'))
  }

}
