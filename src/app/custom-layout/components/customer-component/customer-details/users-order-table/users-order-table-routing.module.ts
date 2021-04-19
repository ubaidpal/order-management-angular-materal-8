import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersOrderTableComponent } from './users-order-table.component';
import { VexRoutes } from '../../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: UsersOrderTableComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersOrderTableRoutingModule {
}
