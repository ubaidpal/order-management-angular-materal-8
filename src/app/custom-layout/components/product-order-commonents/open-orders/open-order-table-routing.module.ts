import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { OpenOrderComponent } from './open-order-table.component';


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
  exports: [RouterModule]
})
export class OpenOrderRoutingModule {
}
