import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatSelectModule } from '@angular/material/select';
import { IconModule } from '@visurel/iconify-angular';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { ColorFadeModule } from 'src/@vex/pipes/color/color-fade.module';
import { SharedModule } from 'src/app/shared/shared.module';



import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { MatDialogModule, MatFormFieldModule, MatProgressBarModule, MatProgressSpinnerModule, MAT_DATE_FORMATS } from '@angular/material';
import Utils from 'src/app/custom-layout/_utils/utils';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const MY_FORMATS =  Utils.getDatePickerFormate();

import { PackingActivityRoutingModule } from './packing-activity-routing.module';
import { PackingActivityComponent } from './packing-activity.component';
import { SidebarListComponent } from './sidebar-list/sidebar-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PackingOutputComponent } from './packing-output/packing-output.component';
import { OrderUpdatePackingComponent } from './order-update-packing/order-update-packing.component';
import { DateTableComponent } from './packing-output/date-table/date-table.component';


@NgModule({
  declarations: [PackingActivityComponent, SidebarListComponent, OrderDetailsComponent, PackingOutputComponent, OrderUpdatePackingComponent, DateTableComponent],
  imports: [
    CommonModule,
    PackingActivityRoutingModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    SecondaryToolbarModule,
    MatSelectModule,
    IconModule,
    BreadcrumbsModule,
    ContainerModule,
    ColorFadeModule,
    NgMultiSelectDropDownModule.forRoot(),
    PageLayoutModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonToggleModule,
    SharedModule,
    MatProgressSpinnerModule,

    MatFormFieldModule,
    SelectAutocompleteModule,
    NgxSpinnerModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  entryComponents: [OrderUpdatePackingComponent],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}    
  ],
})
export class PackingActivityModule { }
