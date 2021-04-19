import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { OpenOrderComponent } from './open-order-table.component';
import Utils from 'src/app/custom-layout/_utils/utils';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
const MY_FORMATS =  Utils.getDatePickerFormate();

const routes: VexRoutes = [
  {
    path: '',
    component: OpenOrderComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe, {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class OpenOrderRoutingModule {
}
