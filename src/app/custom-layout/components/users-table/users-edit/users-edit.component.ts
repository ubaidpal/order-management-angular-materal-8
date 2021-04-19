import { Component, Inject, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { usersData } from '../../../../../static-data/users';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import { FormBuilder } from '@angular/forms';
import { User } from '../interfaces/user.interface';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
export let userIdCounter = 50;

@Component({
  selector: 'vex-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {
  
  mode: 'create' | 'update' = 'create';
  form = this.fb.group({
    name: null,
    email: null,
    agencyRole: null,
    privillage: null,
    agency: null,
    office: null,
    password: null,
    status: null
  });

  user: User;

  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  inputType = 'password';
  visible = false;
  constructor(@Inject(MAT_DIALOG_DATA) private userId: User['id'],
              private dialogRef: MatDialogRef<UsersEditComponent>,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef
              ) { }

  ngOnInit() {
    if (this.userId) {
      this.user = usersData.find(c => c.id === this.userId);
      this.form.patchValue(this.user);
    }
  }

  toggleStar() {
    if (this.user) {
     // this.user.starred = !this.user.starred;
    }
  }

  save() {
    const form = this.form.value;

    if (!this.user) {
      this.user = {
        ...form,
        id: userIdCounter++
      };
    }
  
    this.user.name = form.name;
    this.user.email = form.email;
    this.user.agencyRole = form.agencyRole;
    this.user.privillage = form.privillage;
    this.user.agency = form.agency;
    this.user.office = form.office;
    this.user.status = form.status;
    this.user.password = form.password;

    this.dialogRef.close(this.user);
  }
  togglePassword() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
