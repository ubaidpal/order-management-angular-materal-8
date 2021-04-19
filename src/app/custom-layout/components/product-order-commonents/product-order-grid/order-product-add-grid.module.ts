import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


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

import { OpenOrderTableModule as ProductView } from 'src/app/custom-layout/components/product-order-commonents/open-orders/open-order-table.module';
import { OrderGridComponent } from './order-grid.component';
import { OrderGridRoutingModule } from './order-grid-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';






@NgModule({
  declarations: [OrderGridComponent],
  imports: [
    SharedModule,
    CommonModule,
    OrderGridRoutingModule,
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


    ProductView


    
  ],
  exports:[OrderGridComponent] 
})
export class OrdersProductAddGridModule {
}
