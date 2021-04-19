import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../../../@vex/interfaces/vex-route.interface';
import { CustomerBranchesPopupComponent } from './customer-branches-popup.component';


const routes: VexRoutes = [
  {
    path: '',
    component: CustomerBranchesPopupComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerBranchesPopupRoutingModule {
}
