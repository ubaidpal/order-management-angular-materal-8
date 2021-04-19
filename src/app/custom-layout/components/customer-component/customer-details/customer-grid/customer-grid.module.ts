import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerGridRoutingModule } from './customer-grid-routing.module';
import { CustomerGridComponent } from './customer-grid.component';
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
import { BranchesCardModule } from '../branches/components/branches-card/branches-card.module';

import { CustomerOrderGridModule } from '../customer-orders/order-grid/customer-order-grid.module';
import { CompanyFormElementsModule } from '../company-form-elements/company-form-elements.module';
import { BranchesEditModule } from '../branches/components/branches-edit/branches-edit.module';
import { ContactTableModule as ContactTable} from '../../../contact/contact-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatelougeTableModule } from '../../../catelouge/catelouge-table.module';
import { ShippingTableModule } from '../branches/branches-details/branch-components/shipping-location/shipping-table.module';
import { NgxSpinnerModule } from 'ngx-spinner';
//import { CustomerOrderGridModule } from '../customer-orders/order-grid/customer-order-grid.module';




@NgModule({
  declarations: [CustomerGridComponent],
  imports: [
    CommonModule,
    CustomerGridRoutingModule,
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

    BranchesEditModule,
    BranchesCardModule,

    CompanyFormElementsModule,
    CustomerOrderGridModule,
    ContactTable,
    CatelougeTableModule,
    ShippingTableModule,
    SharedModule,
    NgxSpinnerModule
    
  ],
  exports:[CustomerGridComponent,PageLayoutModule],
})
export class CustomerGridModule {
}
