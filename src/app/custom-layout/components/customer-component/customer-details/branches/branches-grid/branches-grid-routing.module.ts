import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchesGridComponent } from './branches-grid.component';
import { VexRoutes } from '../../../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'all'
  },
  {
    path: ':activeCategory',
    component: BranchesGridComponent,
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
export class BranchesGridRoutingModule {
}
