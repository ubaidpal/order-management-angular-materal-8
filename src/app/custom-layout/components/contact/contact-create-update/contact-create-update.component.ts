import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../model/contact.model';
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
import { CustomerService } from '../../../_services/customer.service';
import { AlertService } from '../../../alert/alert.service';
import { CommonService } from "../../../_services/common.service";
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/custom-layout/_utils/utils';
import _ from 'underscore';

@Component({
  selector: 'vex-customer-create-update',
  templateUrl: './contact-create-update.component.html',
  styleUrls: ['./contact-create-update.component.scss']
})
export class ContactCreateUpdateComponent implements OnInit {

  
 // static id = 100;
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
  
  branch: any;
  roles: any;
  branchsid :any;
  customerId :any;
  cId  :any;
  bId  :any;
  branchesSet:any;
  phoneCode:any='';
  submitted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<ContactCreateUpdateComponent>,
      private fb: FormBuilder,
      private customerService: CustomerService,
      private alertService: AlertService,
      private route: ActivatedRoute,
      private commonService: CommonService,
      ) {
        this.getCountriesList();
        this.cId = this.route.snapshot.paramMap.get('cId');
        this.bId = this.route.snapshot.paramMap.get('branchId');
  }

  ngOnInit() {

  
    
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Contact;
    }
    
    let branchId:any = ''
    if (this.branchesSet) {
      branchId = this.defaults.branchId ?  [this.defaults.branchId, Validators.required] : [this.branchsid, Validators.required];
    }

    if(this.defaults.phone){
      this.phoneCode = this.defaults.phone.split('-');
    }

    console.log('****', this.branchsid)

    this.form = this.fb.group({
     // id: [ContactCreateUpdateComponent.id++],
      name: [this.defaults.name , Validators.required] || ['' , Validators.required],
      email: this.defaults.email || '',
      phonePrefix:this.phoneCode[0] ? this.phoneCode[0]: '+92' ,
      phone: this.phoneCode[1] ? this.phoneCode[1] : this.defaults.phone,
      branchId,
      role: this.defaults.role || '',
    
      isPrimary: this.defaults.isPrimary ?  this.defaults.isPrimary : false,
    });
      
    if (this.branchsid && this.cId) {
     // this.form.controls['branchId'].disable();
      let activeBranch = this.branch.find(c => c.id == parseInt(this.branchsid));
      const phoneCode = activeBranch ? activeBranch.phone.split('-') : '';
     this.form.controls['branchId'].setValue(activeBranch.id);
     this.form.controls['phonePrefix'].setValue(phoneCode[0]);
     
    }
   
    //let activeBranch = this.branches.find(c => c.id == parseInt(this.defaults.branchId));
    //this.form.controls['branchId'].setValue(activeBranch.id);
  }
  get f() {

    return this.form.controls;
  }
  
  onBranchChange(event) {
    console.log('evv >>', event)
    let activeBranch = this.branch.find(c => c.id == parseInt(event.value));
    const phoneCode = activeBranch ? activeBranch.phone.split('-') : '';
    this.form.controls['phonePrefix'].setValue(phoneCode[0]);
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
    const contact = this.form.value;
    let obj = {

      'name': contact.name ? contact.name : '' ,
      'role': contact.role ? contact.role : '',
      'branchId': contact.branchId ? contact.branchId : this.branchsid,
      'phone': contact.phonePrefix + '-' + contact.phone,
      'email': contact.email ? contact.email : '' ,
      'isPrimary': contact.isPrimary ? contact.isPrimary : false,
      "customerId" : this.cId ? this.cId : this.customerId ? this.customerId :''
    }
    

    this.dialogRef.close(obj);
  }

  updateCustomer() {
    const contact = this.form.value;
   // contact.id = this.defaults.id;

    let obj = {
      'id': this.defaults.id ,
      'name': contact.name ,
      'role': contact.role,
      'branchId': contact.branchId ? contact.branchId : this.branchsid,
      'phone': contact.phonePrefix + '-' + contact.phone,
      'email': contact.email ,
      'isPrimary': contact.isPrimary ? contact.isPrimary : false,
      "customerId" : this.cId ? this.cId : this.customerId
    }
    this.dialogRef.close(obj);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
  // getBranches() {
  //   return this.customerService
  //     .getBranches()
  //     .pipe(first())
  //     .subscribe(data => {
  //       if (data) {
  //         this.branch = data;
  //       }
  //     });
  // }
  getBranchById(id:number){

  }

  getCountriesList() {
    this.commonService.getCountries((data: any) => {
      this.phonePrefixOptions = Utils.getPhoneCodes(data);
    }, (error: any) => {
      console.log('get countries:', error)
    });
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.form.patchValue({
      [name]: val
    });
  }
}
