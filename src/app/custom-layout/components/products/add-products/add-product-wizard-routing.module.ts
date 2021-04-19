import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductWizardComponent } from './add-product-wizard.component';


const routes: Routes = [
  {
    path: '',
    component: AddProductWizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProductWizardRoutingModule {
}
