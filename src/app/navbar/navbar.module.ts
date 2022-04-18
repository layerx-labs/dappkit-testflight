import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, } from '@angular/router';
import { CustomCommonModule } from '../custom-common/custom-common.module';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CustomCommonModule
  ],
  exports:[
    NavbarComponent
  ]
})
export class NavbarModule { }
