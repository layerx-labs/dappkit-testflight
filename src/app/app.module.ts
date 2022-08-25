import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomCommonModule } from './custom-common/custom-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import { ModelPageComponent } from './model-page/model-page.component';
import { CustomModelComponent } from './custom-model/custom-model.component';
import dappkitPackage from '@taikai/dappkit/package.json';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModelPageComponent,
    CustomModelComponent,
  ],
  imports: [
    BrowserModule,
    CustomCommonModule,
    BrowserAnimationsModule,
    MatSidenavModule,
  ],
  providers: [
    {provide: 'DAPPKIT_VERSION', useValue: dappkitPackage?.version}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
