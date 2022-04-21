import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AbiConnectorComponent } from './abi-connector/abi-connector.component';
import { AbiDeployerComponent } from './abi-deployer/abi-deployer.component';
import { AbiInteractionComponent } from './abi-interaction/abi-interaction.component';
import { AbiMethodsComponent } from './abi-methods/abi-methods.component';
import { ConnectorComponent } from './connector/connector.component';
import { PageHeaderComponent } from './page-header/page-header.component';

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
];

@NgModule({
  declarations: [
    ConnectorComponent,
    AbiConnectorComponent,
    PageHeaderComponent,
    AbiInteractionComponent,
    AbiDeployerComponent,
    AbiMethodsComponent,
  ],
  imports: [
    ...sharedModules,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
  ],
  exports: [...sharedModules, ConnectorComponent, AbiConnectorComponent],
})
export class CustomCommonModule {}
