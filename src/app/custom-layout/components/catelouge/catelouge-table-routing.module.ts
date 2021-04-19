import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../../@vex/interfaces/vex-route.interface';
import { CatelougeTableComponent } from './catelouge-table.component'


const routes: VexRoutes = [
  {
    path: '',
    component: CatelougeTableComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatelougeTableRoutingModule {
}
