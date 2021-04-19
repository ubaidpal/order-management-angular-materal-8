import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersTableRoutingModule } from './users-table-routing.module';
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
import { ScrollbarModule } from '../../../../@vex/components/scrollbar/scrollbar.module';
import { UsersTableComponent } from './users-table.component';
import { UsersDataTableComponent } from './users-data-table/users-data-table.component';
import { UsersEditModule } from '../../components/users-table/users-edit/users-edit.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContainerModule } from '../../../../@vex/directives/container/container.module';
import { UsersTableMenuComponent } from './users-table-menu/users-table-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [UsersTableComponent, UsersDataTableComponent, UsersTableMenuComponent],
  imports: [
    CommonModule,
    UsersTableRoutingModule,
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
    UsersEditModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSidenavModule,
    SharedModule
  ],
  exports:[
    
  ]
})
export class UsersTableModule {
}
