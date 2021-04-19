import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchGridComponent } from './branch-grid.component';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
 
  {
    path: '',
    redirectTo: 'all'
  },
 
  {
    path: '',
    redirectTo: ''
  },
  
  {
    path: '',
    redirectTo: ''
  },
  {
    path: '',
    redirectTo: ''
  },
  {
    path: '',
    redirectTo: ''
  },
  {
    path: ':activeCategory',
    component: BranchGridComponent,
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
