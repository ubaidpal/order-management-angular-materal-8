import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";

import { CatelougeTableRoutingModule } from "./catelouge-table-routing.module";
import { CatelougeTableComponent } from "./catelouge-table.component";
import { PageLayoutModule } from "../../../../@vex/components/page-layout/page-layout.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BreadcrumbsModule } from "../../../../@vex/components/breadcrumbs/breadcrumbs.module";

import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { IconModule } from "@visurel/iconify-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ContainerModule } from "../../../../@vex/directives/container/container.module";
import { MatSelectModule } from "@angular/material/select";
import { ColorFadeModule } from "../../../../@vex/pipes/color/color-fade.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { SharedModule } from "src/app/shared/shared.module";
import Utils from "../../_utils/utils";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS } from "@angular/material";
import { NgxSpinnerModule } from "ngx-spinner";

const MY_FORMATS = Utils.getDatePickerFormate();

@NgModule({
  declarations: [CatelougeTableComponent],
  imports: [
    CommonModule,
    CatelougeTableRoutingModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
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
    MatMomentDateModule,
    NgxSpinnerModule
  ],
  exports: [CatelougeTableComponent],
  providers: [DecimalPipe, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],

})
export class CatelougeTableModule {}
