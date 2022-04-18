import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorComponent } from './connector/connector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { AbiConnectorComponent } from './abi-connector/abi-connector.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { PageHeaderComponent } from './page-header/page-header.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AbiInteractionComponent } from './abi-interaction/abi-interaction.component';
import { AbiDeployerComponent } from './abi-deployer/abi-deployer.component';
import { MatCardModule } from '@angular/material/card';
import { AbiMethodsComponent } from './abi-methods/abi-methods.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MarkdownModule } from 'ngx-markdown';


const sharedModules = [
  MatButtonModule,
  MatIconModule,
  CommonModule,
  ReactiveFormsModule,
  MatGridListModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatDividerModule,
  MatToolbarModule,
  MatListModule,
  MatCardModule,
  MatExpansionModule,
  MarkdownModule.forRoot(),
];

@NgModule({
  declarations: [
    ConnectorComponent,
    AbiConnectorComponent,
    PageHeaderComponent,
    AbiInteractionComponent,
    AbiDeployerComponent,
    AbiMethodsComponent
  ],
  imports: [
    ...sharedModules,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [
    ...sharedModules,
    ConnectorComponent,
    AbiConnectorComponent,
  ]
})
export class CustomCommonModule { }
