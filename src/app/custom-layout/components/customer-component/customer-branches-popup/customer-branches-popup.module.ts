import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CustomerBranchesPopupComponent } from './customer-branches-popup.component';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { CustomerCreateUpdateModule } from '../customer-create-update/customer-create-update.module';
import { MatPaginatorModule, MatSortModule, MatTooltipModule, MatButtonToggleModule, MatSidenavModule } from '@angular/material';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { ColorFadeModule } from 'src/@vex/pipes/color/color-fade.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { CustomerBranchesPopupRoutingModule } from './customer-branches-popup-routing-module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    IconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTableModule,
    PageLayoutModule,
    BreadcrumbsModule,
    CustomerCreateUpdateModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatTooltipModule,
    ContainerModule,
    ColorFadeModule,
    MatButtonToggleModule,
    SharedModule,
    SecondaryToolbarModule,
    MatSidenavModule,
    CustomerBranchesPopupRoutingModule
  ],
  declarations: [CustomerBranchesPopupComponent],
  entryComponents: [CustomerBranchesPopupComponent],
  exports: [CustomerBranchesPopupComponent]
})
export class CustomerBranchesPopupModule {
}
