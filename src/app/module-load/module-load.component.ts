import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelsService } from '../custom-common/models.service';
@Component({
  selector: 'app-module-load',
  templateUrl: './module-load.component.html',
  styleUrls: ['./module-load.component.sass'],
})
export class ModuleLoadComponent implements OnInit {
  constructor(readonly models: ModelsService, private router: Router) {}

  fileName = '';

  ngOnInit(): void {}

  teste() {
    console.log('click');
  }

  upload(event: any) {
    if (event?.target?.files?.length !== 1)
      return console.error('No file selected');

    const file = event.target?.files[0];
    if (!file || file?.type !== 'application/json')
      return console.error('file error');

    const name = file?.name?.split('.')[0];
    this.fileName = name;

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader?.result) {
        const contract = JSON.parse(reader?.result?.toString());
        if (contract.abi) {
          const keyName = this.models.addModel(contract.abi, name);
          keyName && this.router.navigateByUrl(`/model/${keyName}`);
        } else {
          return console.error('ABI not found');
        }
      }
    };
    reader.readAsText(file);
  }
}
