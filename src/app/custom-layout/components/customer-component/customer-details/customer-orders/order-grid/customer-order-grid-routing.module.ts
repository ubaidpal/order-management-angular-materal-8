import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerOrderGridComponent } from './customer-order-grid.component';
import { VexRoutes } from './../../../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'completed'
  },
  {
    path: '',
    redirectTo: 'in-progress'
  },
  {
    path: '',
    redirectTo: 'pending'
  },
  {
    path: '',
    redirectTo: 'all-orders'
  },
  
  
  {
    path: ':activeCategory',
    component: CustomerOrderGridComponent,
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
export class CustomerGridRoutingModule {
}
 