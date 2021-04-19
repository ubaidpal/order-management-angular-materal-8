import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyFormElementsComponent } from './company-form-elements.component';
import { VexRoutes } from '../../../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: CompanyFormElementsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyFormElementsRoutingModule {
}
