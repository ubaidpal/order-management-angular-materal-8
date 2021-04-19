import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../interfaces/customer.model';
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
import icUser from '@iconify/icons-ic/people';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { CustomerService } from '../../../_services/customer.service';
import { AlertService } from '../../../alert/alert.service';
import { first } from 'rxjs/operators';
import Utils from 'src/app/custom-layout/_utils/utils';
@Component({
  selector: 'vex-customer-create-update',
  templateUrl: './customer-create-update.component.html',
  styleUrls: ['./customer-create-update.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class CustomerCreateUpdateComponent implements OnInit {

  //static id = 100;
  phonePrefixOptions = [];
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
  icUser = icUser;
  countries: any;
  roles: any;
  currentState: any;
  phone1: any = '';
  phone2: any = '';
  submitted = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CustomerCreateUpdateComponent>,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {


    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Customer;
    }

    if (this.defaults.phoneNumber) {
      this.phone1 = this.defaults.phoneNumber.split('-');
    }
    if (this.defaults.phoneNumber2) {
      this.phone2 = this.defaults.phoneNumber2.split('-');
    }
    console.log('this.defaults >>', this.defaults)
    this.form = this.fb.group({
      //  id:[CustomerCreateUpdateComponent.id++],
      // imageSrc: this.defaults.imageSrc,
      id: this.defaults.id,
      name: [this.defaults.name, Validators.required] || ['', Validators.required],
      registrationNumber: this.defaults.registrationNumber || '',
      country: this.defaults.country || '',
      addressLine1: this.defaults.addressLine1 || '',
      addressLine2: this.defaults.addressLine2 || '',
      city: this.defaults.city || '',
      state: this.defaults.state || '',
      postcode: this.defaults.postcode || '',
      phonePrefix: this.phone1[0] ? this.phone1[0] : '',
      phoneNumber: this.phone1[1] ? this.phone1[1] : '',
      branch: this.defaults.hasBranch == false ? true : false || '',
      allbranch: this.defaults.hasBranch == true ? true : false || '',
      hasBranch: this.defaults.hasBranch == true ? [true] : [false] || [false],
      representative: this.defaults.representative || '',
      role: this.defaults.representativeRole || '',
      email: this.defaults.email || '',
      phonePrefix2: this.phone2[0] ? this.phone2[0] : '',
      phoneNumber2: this.phone2[1] ? this.phone2[1] : '',
      branches: this.defaults.branches || '',
      addresses: this.defaults.addresses || '',
      contacts: this.defaults.contacts || '',
      customerProducts: this.defaults.customerProducts || ''
    });

    if (this.countries) {
      let activeCountry = this.countries.find(c => c.id == parseInt(this.defaults.country));
      this.phonePrefixOptions = Utils.getPhoneCodes(this.countries);
      if (activeCountry) {
        this.form.controls['country'].setValue(activeCountry.id);
      }
    }


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
    this.dialogRef.close(customer);
  }

  updateCustomer() {
  
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
  getStateByCountryId(cId) {
    const selectedCountry = this.countries.find(f => f.id === cId);
    this.form.patchValue({
      phonePrefix: selectedCountry.phonecode,
      phonePrefix2: selectedCountry.phonecode
    });
    return this.customerService.getStateByCountryId(cId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          //  this.states = data;
        }
      });
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.form.patchValue({
      [name]: val
    });
  }

}
