import { Component, OnInit } from '@angular/core';
import { ModelsService } from 'src/app/custom-common/models.service';

class CustomLink {
  constructor(readonly name: string, readonly href: string, readonly icon?: string) {}
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor(readonly models: ModelsService) { }

  links: CustomLink[] = [];

  ngOnInit(): void {
    this.models.Models$.subscribe((models) => {
      this.links = Object.keys(models).map(
        (key) => new CustomLink(key, `/model/${key}`)
      );
    });
  }
}
