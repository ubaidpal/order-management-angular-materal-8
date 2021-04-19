import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesGridRoutingModule } from './branches-grid-routing.module';
import { BranchesGridComponent } from './branches-grid.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BranchesEditModule } from '../components/branches-edit/branches-edit.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BranchesCardModule } from '../components/branches-card/branches-card.module';
import { ContainerModule } from '../../../../../../../@vex/directives/container/container.module';
import { ColorFadeModule } from '../../../../../../../@vex/pipes/color/color-fade.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [BranchesGridComponent],
  imports: [
    CommonModule,
    BranchesGridRoutingModule,
    MatTabsModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatDialogModule,
    BranchesEditModule,
    MatIconModule,
    MatTooltipModule,
    BranchesCardModule,
    ContainerModule,
    ColorFadeModule,
    SharedModule,
    NgxSpinnerModule
  ],
  exports:[BranchesGridComponent],
})
export class BranchesGridModule {
}
