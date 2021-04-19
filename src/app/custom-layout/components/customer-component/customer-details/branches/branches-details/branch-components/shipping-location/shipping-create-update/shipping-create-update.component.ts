import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/customer.model';

import { Shipping } from 'src/app/custom-layout/components/customer-component/interfaces/shipping.model';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';

import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import Utils from 'src/app/custom-layout/_utils/utils';
@Component({
  selector: 'vex-customer-create-update',
  templateUrl: './shipping-create-update.component.html',
  styleUrls: ['./shipping-create-update.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ShippingCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  countries :any;
  loadPlan :any;
  contactList :any;
  currencyList :any;
  shippingType:any;
  shippingMethod:any;
  submitted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ShippingCreateUpdateComponent>,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Shipping;
    }

    this.form = this.fb.group({
     // id: [ShippingCreateUpdateComponent.id++],
      id:  [this.defaults.id || ''],
      name: [this.defaults.name, Validators.required] || ['', Validators.required],
      shipTo: [this.defaults.shipTo || ''],
      addressLine1: this.defaults.addressLine1 || '',
      addressLine2: this.defaults.addressLine2 || '',
      city: this.defaults.city || '',
      state: this.defaults.state || '',
      countryId: this.defaults.countryId || '',
      currencyId: this.defaults.currencyId || '',
      postCode: this.defaults.postCode || '',
      loadingStyleId: this.defaults.loadingStyleId || '',
      contactPersonId:this.defaults.contactPersonId || '',
      phone: this.defaults.phone || '',
      currency: this.defaults.currency || '',
      ship2: this.defaults.name || '',
      contactPerson: this.defaults.contactPerson || '',
      shipBy: this.defaults.shipBy || '',
      isTranshipmentAllowed: this.defaults.isTranshipmentAllowed == true == true ? [true] : [false] || [false] ,
      countryOfOriginId: this.defaults.countryOfOriginId || 132,
      shippingType: this.defaults.shippingType || '',
      deliveryTerms: this.defaults.deliveryTerms || ''
    });

    this.form.controls['ship2'].disable();
    
 
  }
  get f() {

    return this.form.controls;
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {

      return;
    }
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;


    if (!customer.imageSrc) {
      customer.imageSrc = 'assets/img/avatars/1.jpg';
    }

    this.dialogRef.close(customer);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;
console.log('customer >>', customer)
    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.form.patchValue({
      [name]: val
    });
  }
}
