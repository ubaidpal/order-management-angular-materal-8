import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersCreateInvoiceRoutingModule } from './orders-create-invoice.routing.module';
import { OrdersCreateInvoiceComponent } from './orders-create-invoice.component';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule, MatDialogModule, MatIconModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatMenuModule, MatButtonModule, MatNativeDateModule, MatSelectModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [OrdersCreateInvoiceComponent],
  imports: [
    CommonModule,
    OrdersCreateInvoiceRoutingModule,
    SecondaryToolbarModule,
    ContainerModule,
    BreadcrumbsModule,

    CommonModule,
    PageLayoutModule,
    BreadcrumbsModule,
    MatTabsModule,
    FlexLayoutModule,
    ContainerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    IconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,


    FormsModule,
    SharedModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  //entryComponents: [addProduct],
})
export class OrdersCreateInvoiceModule {
}
