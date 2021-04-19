import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchGridRoutingModule } from './branch-grid-routing.module';
import { BranchGridComponent } from './branch-grid.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
//import { ContactsEditModule } from '../components/contacts-edit/contacts-edit.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
//import { ContactsCardModule } from '../components/contacts-card/contacts-card.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { ColorFadeModule } from 'src/@vex/pipes/color/color-fade.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { ShippingTableModule } from '../branches-details/branch-components/shipping-location/shipping-table.module';
import { ContactTableModule } from 'src/app/custom-layout/components/contact/contact-table.module';
import { CatelougeTableModule } from 'src/app/custom-layout/components/catelouge/catelouge-table.module';
import { BranchFormElementsModule } from '../branches-details/branch-components/branch-detail/branch-form-elements.module';
import { BranchOrderGridModule } from '../order-grid/branch-order-grid.module';




@NgModule({
  declarations: [BranchGridComponent],
  imports: [
    CommonModule,
    BranchGridRoutingModule,
    MatTabsModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatDialogModule,

    PageLayoutModule,
    BreadcrumbsModule,
  //  ContactsEditModule,
    MatIconModule,
    MatTooltipModule,
  //  ContactsCardModule,
    ContainerModule,
    ColorFadeModule,

   
    SharedModule,
    ShippingTableModule,
    ContactTableModule,
    CatelougeTableModule,
    BranchFormElementsModule,
    BranchOrderGridModule

    
  ],
  exports:[PageLayoutModule] 
})
export class BranchGridModule {
}
