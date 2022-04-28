import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModelPageComponent } from './model-page/model-page.component';
import { ModuleLoadComponent } from './module-load/module-load.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'model/:model', component: ModelPageComponent },
  { path: 'addModule', component: ModuleLoadComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class RoutingModule { }
