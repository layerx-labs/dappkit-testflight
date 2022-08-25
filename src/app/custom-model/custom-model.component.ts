import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelsService } from '../custom-common/models.service';
@Component({
  selector: 'app-custom-model',
  templateUrl: './custom-model.component.html',
  styleUrls: ['./custom-model.component.sass'],
})
export class CustomModelComponent implements OnInit {
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

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (reader?.result) {
        try{
          const jsonAbi = JSON.parse(reader?.result?.toString());
          if (jsonAbi?.abi && jsonAbi.bytecode) {
            const keyName = this.models.addModel(jsonAbi);
            if(keyName) this.router.navigateByUrl(`/model/${keyName}`);
          } else {
            this.fileName = ''
            this.errorMsg = "JSON ABI can't loaded";
          }
        }catch(e){
          console.error(e)
          this.fileName = ''
          this.errorMsg = 'File not found';
        }
      }
    };
    reader.readAsText(file);
  }
}
