import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { OrderDetailsRoutingModule } from "./order-details-routing.module";
import { OrderDetailsComponent } from "./order-details.component";
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { ContainerModule } from "src/@vex/directives/container/container.module";
import { BreadcrumbsModule } from "src/@vex/components/breadcrumbs/breadcrumbs.module";
import { PageLayoutModule } from "src/@vex/components/page-layout/page-layout.module";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
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
  MatButtonToggleModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MAT_DATE_FORMATS,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { IconModule } from "@visurel/iconify-angular";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { OrderProgressComponent } from "./order-progress/order-progress.component";
import { OrderDetailsTabComponent } from "./order-details-tab/order-details-tab.component";
import { InvoiceDetailsTabComponent } from "./invoice-details-tab/invoice-details-tab.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { ShipmentSummaryTabComponent } from "./shipment-summary-tab/shipment-summary-tab.component";
import { OrdersCreateShipmentDailogComponent } from "./orders-create-shipment-dailog/orders-create-shipment-dailog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { UpdatePackingModalComponent } from "./update-packing-modal/update-packing-modal.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { UpdateShipmentDateDailogComponent } from "./update-shipment-date-dailog/update-shipment-date-dailog.component";
import { ShipmentDateHistoryDailogComponent } from "./shipment-date-history-dailog/shipment-date-history-dailog.component";
import { CompleteInvoiceDailogComponent } from "./complete-invoice-dailog/complete-invoice-dailog.component";
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import Utils from "../../_utils/utils";
import { MatTooltipModule } from '@angular/material/tooltip';
import { PackingMaterialsTabComponent } from './packing-materials-tab/packing-materials-tab.component';
const MY_FORMATS = Utils.getDatePickerFormate();

@NgModule({
  declarations: [
    OrderDetailsComponent,
    OrderProgressComponent,
    OrderDetailsTabComponent,
    InvoiceDetailsTabComponent,
    ShipmentSummaryTabComponent,
    OrdersCreateShipmentDailogComponent,
    UpdatePackingModalComponent,
    UpdateShipmentDateDailogComponent,
    ShipmentDateHistoryDailogComponent,
    CompleteInvoiceDailogComponent,
    PackingMaterialsTabComponent,
  ],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule,
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
    MatButtonToggleModule,
    MatProgressBarModule,
    FormsModule,
    SharedModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatMomentDateModule,
    AutocompleteLibModule,
    MatTooltipModule
  ],
  entryComponents: [
    OrdersCreateShipmentDailogComponent,
    UpdatePackingModalComponent,
    UpdateShipmentDateDailogComponent,
    ShipmentDateHistoryDailogComponent,
    CompleteInvoiceDailogComponent,
  ],
  providers: [DatePipe, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class OrderDetailsModule {}
