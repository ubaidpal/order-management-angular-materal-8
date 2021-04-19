import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesEditComponent } from './branches-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
@NgModule({
  declarations: [BranchesEditComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FlexLayoutModule,

    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    IconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatNativeDateModule,

    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule
  ],
  entryComponents: [BranchesEditComponent]
})
export class BranchesEditModule {
}
