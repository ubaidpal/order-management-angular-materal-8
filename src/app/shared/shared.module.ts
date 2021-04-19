import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertComponent } from "./../custom-layout/alert/alert.component";

import { PageLayoutModule } from "src/@vex/components/page-layout/page-layout.module";
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { BreadcrumbsModule } from "src/@vex/components/breadcrumbs/breadcrumbs.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { IconModule } from "@visurel/iconify-angular";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ContainerModule } from "src/@vex/directives/container/container.module";
import { ColorFadeModule } from "src/@vex/pipes/color/color-fade.module";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import {
  MatGridListModule,
  MatButtonToggleModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDialogModule, MatTabsModule
} from "@angular/material";
import { ProductOrderDropdownComponent } from "../custom-layout/components/product-order-dropdown/product-order-dropdown.component";

import { MatDividerModule } from "@angular/material/divider";
import { ProductOrderGearComponent } from "../custom-layout/components/gear-dropdown/gear-order.component";

import { MatMenuModule } from "@angular/material/menu";
import Utils from "../custom-layout/_utils/utils";
import { StatusBadgeComponent } from '../custom-layout/components/common/status-badge/status-badge.component';
import { AddProductsDailogComponent } from '../custom-layout/components/common/add-products-dailog/add-products-dailog.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {
  MatSidenavModule,
} from '@angular/material';
import { InputAutoWithArrayComponent } from './input-auto-with-array/input-auto-with-array.component';

const MY_FORMATS = Utils.getDatePickerFormate();
@NgModule({
  imports: [
    CommonModule,
    PageLayoutModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatIconModule,
    ContainerModule,
    ColorFadeModule,

    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,

    MatGridListModule,
    MatButtonToggleModule,

    MatDividerModule,

    MatMenuModule,

    MatRadioModule,
    MatMomentDateModule,
    RxReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    AutocompleteLibModule,
    MatSidenavModule,
    MatTabsModule
  ],
  declarations: [
    AlertComponent,
    ProductOrderDropdownComponent,
    ProductOrderGearComponent,
    StatusBadgeComponent,
    AddProductsDailogComponent,
    InputAutoWithArrayComponent
  ],
  exports: [
    StatusBadgeComponent,
    AddProductsDailogComponent,
    AlertComponent,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,

    MatGridListModule,

    ProductOrderDropdownComponent,
    ProductOrderGearComponent,

    MatDividerModule,
    MatSidenavModule,
    MatTabsModule,
    InputAutoWithArrayComponent
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
})
export class SharedModule {}
