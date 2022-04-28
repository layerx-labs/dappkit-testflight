import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModelPageComponent } from './model-page/model-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'model/:model', component: ModelPageComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class RoutingModule { }
