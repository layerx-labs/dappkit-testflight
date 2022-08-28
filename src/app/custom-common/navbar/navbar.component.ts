import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import { ModelsService } from 'src/app/custom-common/models.service';
import {DestroyerService} from "../destroyer.service";
import {map, Observable, takeUntil} from "rxjs";

class CustomLink {
  constructor(readonly name: string,
              readonly href: string,
              readonly icon?: string) {}
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  providers: [DestroyerService]
})
export class NavbarComponent implements OnInit {
  @Output() sidenav: EventEmitter<any> = new EventEmitter();

  constructor(readonly models: ModelsService,
              readonly destroyer: DestroyerService) { }

  links$!: Observable<CustomLink[]>;

  ngOnInit(): void {
    this.links$ =
      this.models.models$
        .pipe(
          takeUntil(this.destroyer.destroyed$),
          map(v => Object.keys(v)),
          map(v => v.map(key => new CustomLink(key, `model/${key}`))))
  }

  toggle() {
    this.sidenav.emit();
  }
}
