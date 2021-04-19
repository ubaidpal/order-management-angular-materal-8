import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackingActivityComponent } from './packing-activity.component';


const routes: Routes = [
  {
    path: '',
    component: PackingActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackingActivityRoutingModule { }
