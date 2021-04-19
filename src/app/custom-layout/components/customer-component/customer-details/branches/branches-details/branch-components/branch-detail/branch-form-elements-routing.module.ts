import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchFormElementsComponent } from './branch-form-elements.component';
import { VexRoutes } from '../../../../../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: BranchFormElementsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchFormElementsRoutingModule {
}
