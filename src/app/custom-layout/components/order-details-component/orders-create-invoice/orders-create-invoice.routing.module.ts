import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersCreateInvoiceComponent } from "./orders-create-invoice.component";

import { IconModule } from "@visurel/iconify-angular";
import {
  MatTabsModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatDividerModule,
  MatDatepickerModule,
  MatMenuModule,
  MatButtonModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MAT_DATE_FORMATS,
} from "@angular/material";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductsDailogComponent } from '../../../../custom-layout/components/common/add-products-dailog/add-products-dailog.component';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import Utils from 'src/app/custom-layout/_utils/utils';
const MY_FORMATS =  Utils.getDatePickerFormate();
const routes: Routes = [
  {
    path: "",
    component: OrdersCreateInvoiceComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IconModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatAutocompleteModule,

    CommonModule,
    SecondaryToolbarModule,
    ContainerModule,
    BreadcrumbsModule,

    PageLayoutModule,

    FlexLayoutModule,
    ContainerModule,
    
    ReactiveFormsModule,
    
    MatCheckboxModule,
    MatProgressSpinnerModule,

    MatSnackBarModule,
    FormsModule,
    SharedModule,
    MatMomentDateModule
  ],
  exports: [RouterModule],
  entryComponents: [AddProductsDailogComponent],
  providers: [ 
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
  ]
})
export class OrdersCreateInvoiceRoutingModule {}
