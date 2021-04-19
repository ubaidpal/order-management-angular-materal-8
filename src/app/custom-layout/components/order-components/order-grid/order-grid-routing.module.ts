import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { OrderGridComponent } from './order-grid.component';


const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'all'
  },
  
  
  
  {
    path: ':activeCategory',
    component: OrderGridComponent,
    data: {
    //  scrollDisabled: true,
      toolbarShadowEnabled: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderGridRoutingModule {
}
 