import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchOrderGridComponent } from './branch-order-grid.component';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';


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
    component: BranchOrderGridComponent,
    data: {
     // scrollDisabled: true,
      toolbarShadowEnabled: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchGridRoutingModule {
}
 