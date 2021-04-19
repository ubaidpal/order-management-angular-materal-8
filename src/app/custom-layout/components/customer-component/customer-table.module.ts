import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CustomerTableRoutingModule } from './customer-table-routing.module';
import { CustomerTableComponent } from './customer-table.component';
import { PageLayoutModule } from '../../../../@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from '../../../../@vex/components/breadcrumbs/breadcrumbs.module';
import { CustomerCreateUpdateModule } from './customer-create-update/customer-create-update.module';
import { CustomerBranchesPopupModule } from "./customer-branches-popup/customer-branches-popup.module";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from '../../../../@vex/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { ColorFadeModule } from '../../../../@vex/pipes/color/color-fade.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
//import { AlertComponent } from './../../alert/alert.component';
import { SharedModule } from '../../../shared/shared.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import Utils from '../../_utils/utils';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material';
import { NgxSpinnerModule } from "ngx-spinner";
const MY_FORMATS =  Utils.getDatePickerFormate();
@NgModule({
  declarations: [CustomerTableComponent ],
  imports: [
    CommonModule,
    CustomerTableRoutingModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    CustomerCreateUpdateModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSelectModule,
    ColorFadeModule,
    MatButtonToggleModule,
    SharedModule,
    SecondaryToolbarModule,
    MatSidenavModule,
    CustomerBranchesPopupModule,
    MatMomentDateModule,
    NgxSpinnerModule
  ],
  exports:[
    CustomerTableComponent
  ],
  providers: [DatePipe, {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],

})
export class CustomerTableModule {
}
