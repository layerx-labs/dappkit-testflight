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
  errorMsg = ''

  ngOnInit(): void {}

  upload(event: any) {
    this.errorMsg = '';
    if (event?.target?.files?.length !== 1){
      this.errorMsg = 'No file selected';
      return
    }

    const file = event.target?.files[0];
    if (!file || file?.type !== 'application/json'){
      this.errorMsg = 'file error';
      return
    }

    const name = file?.name?.split('.')[0];
    this.fileName = name;

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader?.result) {
        try{
          const contract = JSON.parse(reader?.result?.toString());
          if (contract.abi) {
            const keyName = this.models.addModel(contract.abi, name);
            if(keyName) this.router.navigateByUrl(`/model/${keyName}`);
          } else {
            this.fileName = ''
            this.errorMsg = 'ABI not found';
          }
        }catch(e){
          console.error(e)
          this.fileName = ''
          this.errorMsg = 'ABI not found';
        }
      }
    };
    reader.readAsText(file);
  }
}
