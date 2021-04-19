import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesCardComponent } from './branches-card.component';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [BranchesCardComponent],
  imports: [
    CommonModule,
    IconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule
  ],
  exports: [BranchesCardComponent]
})
export class BranchesCardModule {
}
