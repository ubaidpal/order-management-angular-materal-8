import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { CreateOrderRoutingModule } from './create-order-routing.module';
import { CreateOrderComponent } from './create-order.component';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule, MatDialogModule, MatIconModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatMenuModule, MatButtonModule, MatNativeDateModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material';
import { AddProductsDailogComponent } from '../../../custom-layout/components/common/add-products-dailog/add-products-dailog.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import Utils from '../../_utils/utils';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

const MY_FORMATS =  Utils.getDatePickerFormate();

@NgModule({
  declarations: [CreateOrderComponent],
  imports: [
    CommonModule,
    CreateOrderRoutingModule,
    SecondaryToolbarModule,
    ContainerModule,
    BreadcrumbsModule,

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
    MatCheckboxModule,
    MatProgressSpinnerModule,

    MatSnackBarModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MatMomentDateModule,
    AutocompleteLibModule
  ],
  entryComponents: [AddProductsDailogComponent],
  providers: [DecimalPipe, 
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class CreateOrderModule {
}
