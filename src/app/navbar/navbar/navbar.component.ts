import { Component, OnInit } from '@angular/core';
import { ModelsService } from 'src/app/custom-common/models.service';

class CustomLink {
  constructor(
    readonly name: string,
    readonly href: string,
    readonly icon?: string
  ) {}
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit {
  constructor(readonly models: ModelsService) {}
  links: CustomLink[] = [];

  ngOnInit(): void {
    this.models.models$.subscribe((models) => {
      this.links = Object.keys(models).map(
        (key) => new CustomLink(key, `/model/${key}`)
      );
    });
  }

  upload(event: any) {
    if (event?.target?.files?.length !== 1)
      return console.error('No file selected');

    const file = event.target?.files[0];

    if (!file || file?.type !== 'application/json')
      return console.error('file error');

    const name = file?.name?.split('.')[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader?.result) {
        const contract = JSON.parse(reader?.result?.toString());
        if (contract.abi) {
          this.models.addModels(contract.abi, name);
        } else {
          return console.error('ABI not found');
        }
      }
    };
    reader.readAsText(file);
  }
}
