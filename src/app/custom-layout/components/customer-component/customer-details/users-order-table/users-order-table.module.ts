import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersOrderTableRoutingModule } from './users-order-table-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollbarModule } from '../../../../../../@vex/components/scrollbar/scrollbar.module';
import { UsersOrderTableComponent } from './users-order-table.component';
import { UsersOrderDataTableComponent } from './users-order-data-table/users-order-data-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContainerModule } from '../../../../../../@vex/directives/container/container.module';
import { UsersOrderTableMenuComponent } from './users-order-table-menu/users-order-table-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [UsersOrderTableComponent, UsersOrderDataTableComponent, UsersOrderTableMenuComponent],
  imports: [
    CommonModule,
    UsersOrderTableRoutingModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatDialogModule,
    ScrollbarModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSidenavModule,
    SharedModule
  ],
  exports: [UsersOrderTableComponent, UsersOrderDataTableComponent, UsersOrderTableMenuComponent],
})
export class UsersOrderTableModule {
}
