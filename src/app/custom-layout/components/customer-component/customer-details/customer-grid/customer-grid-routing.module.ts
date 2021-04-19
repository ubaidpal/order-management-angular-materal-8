import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerGridComponent } from './customer-grid.component';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'all'
  },
  {
    path: '',
    redirectTo: 'company-detail'
  },
  {
    path: '',
    redirectTo: 'order'
  },
  {
    path: '',
    redirectTo: 'contacts'
  },
  {
    path: '',
    redirectTo: 'catelouge'
  },
  
  {
    path: ':activeCategory',
    component: CustomerGridComponent,
    data: {
      //scrollDisabled: true,
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
