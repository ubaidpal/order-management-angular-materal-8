import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OpenOrderRoutingModule } from './open-order-table-routing.module';
import { OpenOrderComponent } from './open-order-table.component';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { OpenOrderCreateUpdateModule } from './open-order-create-update/open-order-create-update.module';
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
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { ColorFadeModule } from 'src/@vex/pipes/color/color-fade.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import Utils from 'src/app/custom-layout/_utils/utils';
import { MAT_DATE_FORMATS, MatProgressBarModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxSpinnerModule } from "ngx-spinner";

const MY_FORMATS =  Utils.getDatePickerFormate();

@NgModule({
  declarations: [OpenOrderComponent],
  imports: [
    CommonModule,
    OpenOrderRoutingModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    OpenOrderCreateUpdateModule,
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
    MatMomentDateModule,
    NgxSpinnerModule,
    SharedModule,
    MatProgressBarModule
  ],
  exports:[OpenOrderComponent],
  providers: [DatePipe, {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
})
export class OpenOrderTableModule {
}
