
import { ChangeDetectionStrategy, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icSmartphone from '@iconify/icons-ic/twotone-smartphone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icCamera from '@iconify/icons-ic/twotone-camera';
import icPhone from '@iconify/icons-ic/twotone-phone';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { map, startWith, first } from 'rxjs/operators';
import { fadeInUp400ms } from '../../../../../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../../../../../@vex/animations/stagger.animation';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';



import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { branchData } from '../../../../../../../../../static-data/branches';
import icStar from '@iconify/icons-ic/twotone-star';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import { Branch } from '../../../../../interfaces/branch.interface';
import { Contact } from '../../../interfaces/contact.interface';
import { CommonService } from "src/app/custom-layout/_services/common.service";

import { BranchesEditComponent } from '../../../components/branches-edit/branches-edit.component';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../../../alert/alert.service';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { Title } from '@angular/platform-browser';
import Utils from 'src/app/custom-layout/_utils/utils';
import { MatSnackBar } from '@angular/material';
export interface CountryState {
  name: string;
  population: string;
  flag: string;
}

@Component({
  selector: 'branch-form-elements',
  templateUrl: './branch-form-elements.component.html',
  styleUrls: ['./branch-form-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class BranchFormElementsComponent implements OnInit {

  showLoader: boolean = false;
  phonePrefixOptions = [];
  visible = false;
  icPhone = icPhone;
  icCamera = icCamera;
  icMenu = icMenu;
  icArrowDropDown = icArrowDropDown;
  icSmartphone = icSmartphone;
  icPerson = icPerson;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icClose = icClose;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  icBusiness = icBusiness;
  icEmail = icEmail;
  addEditModal = null;
  branch: Branch = null;
  contactsData = branchData;
  brancData: any = [];
  id = null;
  cid = null;
  countries: any;
  ltsForm: FormGroup;

  editAddress: any;
  stateCtrl = new FormControl();
  disableButton = true;
  form: FormGroup;
  phone1:any='';
  formNameValid=false;
  get addresses() { return this.branch.addresses }


  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private alertService: AlertService,
    private customerService: CustomerService,
    private router: Router,
    private titleService: Title,
    private fb: FormBuilder,
    private commonService: CommonService,
    private snackbar: MatSnackBar,
    private elementRef: ElementRef
  ) {

    this.id = this.route.snapshot.paramMap.get('branchId');
    this.cid = this.route.snapshot.paramMap.get('cId');
    this.titleService.setTitle("Branch Details");
    this.branchLoad();
  }

  ngOnInit() {

    
    this.form = this.fb.group({

      id: new FormControl(''),
      name: new FormControl(''),
      country: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      postCode: new FormControl(''),
      phonePrefix: new FormControl(''),
      phone: new FormControl('')
     
    });

  }
  
  enterEditMode(evtId?: number) {

    if (evtId > 0) {
      //this.openBranch.emit(evtId);

      this.addEditModal = this.dialog.open(BranchesEditComponent, {
        data: evtId || null,
        width: '1100px'
      });
      this.addEditModal.afterClosed().subscribe((b: Branch) => {
      

        /**
         * Branch is the updated customer (if the user pressed Save - otherwise it's null)
         */
        this.customerService.getContact() // get countries
          .pipe(first())
          .subscribe(contatcData => {

            if (contatcData) {
              this.editAddress = contatcData;
              this.branch.addresses = this.editAddress.filter(branch => branch.branchId == evtId);

              if (this.branch.addresses) {
                this.customerService.updateBranch(b, evtId, this.cid) // update Branches
                  .pipe(first())
                  .subscribe(branch => {

                    if (!branch) {

                      this.customerService.addPrimaryContact(b, evtId, this.cid) // add Primary Contact
                        .then(primary => {
                       
                              if (!primary) {
                              
                                this.customerService.delContactLoop(this.branch.addresses) // del contact
                                  .then(contactDel => {
                              
                                    if (contactDel) {
                                      this.branchLoad();
                                      // this.updateNewBranch(b, evtId, this.cid);
                                    }


                                  }, err => {
                                    this.alertService.clear();
                                    this.alertService.error(err);
                                  });
                              }


                        }, err => {
                          this.alertService.clear();
                          this.alertService.error(err);
                        });
                  

                    }

                  }, err => {
                    this.alertService.clear();
                    this.alertService.error(err);
                  });



              }

            }


          }, err => {
            this.alertService.clear();
            this.alertService.error(err);
          });

      });
    }
  }

  onSubmit(){

   
    if(this.form.value){
      this.showLoader = true;
      let branch  = this.form.value;
  
      let bId = branch.id;      
      
      this.customerService.updateBranch(branch, bId, this.cid) // update Branches
      .pipe(first())
      .subscribe(branch => {
        this.showLoader = false;
        if(!branch){
          this.alertService.success('Branch Successfully updated.');
        }
        this.focusOnField();
      }, err => {
        this.showLoader = false;
        this.alertService.clear();
        this.alertService.error(err);
        this.focusOnField();
      });
    }
  }


  focusOnField() {
    const invalidControl = this.elementRef.nativeElement.querySelector('#custom-field');
    if (invalidControl) {
      invalidControl.focus();
    }
  }
  getCountriesList() {
    this.commonService.getCountries((data: any) => {
      this.countries = data;
      this.phonePrefixOptions = Utils.getPhoneCodes(data);
    }, (error: any) => {
      this.alertService.clear();
      this.alertService.error(error);
    });
  }

  onCountrySelect(cId) {
    const selectedCountry = this.countries.find(f => f.id === cId);
    this.form.patchValue({
      phonePrefix: selectedCountry && selectedCountry.phonecode ? selectedCountry.phonecode : ''
    });
  }

  branchLoad() {
    if (this.id) {
      this.commonService.getCountries((c: any) => {
          this.countries = c;
          this.phonePrefixOptions = Utils.getPhoneCodes(c);
          this.showLoader = true;
          this.customerService.getBranches() // get branch Recorda
            .pipe(first())
            .subscribe(b => {
              this.showLoader = false;
              if (c) {

                if (b) {

                  this.brancData = b;

                  if (Array.isArray(this.brancData)) {
                    this.branch = this.brancData.find(c => c.id == this.id);
                    
                    this.branchDetail(this.branch );
                    this.disableButton = false;
                  } else {
                    this.branch = this.brancData;
                    this.disableButton = false;
                  }
                  
                }

              }



            }, err => {
              this.showLoader = false;
              this.showMessage(err, 'snackbar-error')
            });



        }, err => {
          this.alertService.clear();
          this.alertService.error(err);
        });

    }
  }
  branchDetail(data?:any){

    if(data.phone){
      this.phone1 = data.phone.split('-');
    }
    
    this.form.setValue({
      id: data.id,
      name: data.name || '',
      country: data.country || '',
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      city: data.city || '',
      state: data.state || '',
      postCode: data.postCode || '',
      phonePrefix:this.phone1[0]? this.phone1[0] :'',
      phone:this.phone1[1]? this.phone1[1] :'',
     
    });

 
    if(this.countries){
      if(data.country){
        let activeCountry = this.countries.find(c => c.id == parseInt(data.country));
        this.form.controls['country'].setValue(activeCountry.id);
      }
      
    }

    this.showMessage('Branch Data Loaded Successfully!!', 'snackbar-success')

    return this.form.value;
  }
  backToCustomerPage(){

    this.router.navigate(['/customer-details', {  cId: this.cid  }]);
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.form.patchValue({
      [name]: val
    });
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',      
      panelClass: customClass
    },
    
    );
  }

  get f() {
    return this.form.controls;
  }

}
