import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { branchData } from "../../../../../../../../static-data/branches";
import icStar from "@iconify/icons-ic/twotone-star";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icClose from "@iconify/icons-ic/twotone-close";
import icPrint from "@iconify/icons-ic/twotone-print";
import icDownload from "@iconify/icons-ic/twotone-cloud-download";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icBusiness from "@iconify/icons-ic/twotone-business";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icEmail from "@iconify/icons-ic/twotone-mail";
import icPerson from "@iconify/icons-ic/twotone-person";
import icStarBorder from "@iconify/icons-ic/twotone-star-border";
import icAdd from "@iconify/icons-ic/add";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from "@angular/forms";
import { Branch } from "../../../../interfaces/branch.interface";
import { fadeInUp400ms } from "../../../../../../../../@vex/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../../../../../@vex/animations/stagger.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../../../../../alert/alert.service";
import { CustomerService } from "src/app/custom-layout/_services/customer.service";
import { CommonService } from "../../../../../../_services/common.service";
import { first } from "rxjs/operators";
import Utils from 'src/app/custom-layout/_utils/utils';
export let contactIdCounter = 50;

@Component({
  selector: "vex-contacts-edit",
  templateUrl: "./branches-edit.component.html",
  styleUrls: ["./branches-edit.component.scss"],
  animations: [fadeInUp400ms, stagger40ms]
})
export class BranchesEditComponent implements OnInit {
  contact: Branch;
  ltsForm: FormGroup;
  cId: any;
  cid: number;
  get addresses() {
    return this.contact.addresses;
  }

  phonePrefixOptions = [];
  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;
  icAdd = icAdd;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  countries: any;
  primaryC: any;
  editBranchData: any = [];
  currentState:any;
  roleDisabled= true;
  validError=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private branchId: Branch["id"],
    private dialogRef: MatDialogRef<BranchesEditComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private customerService: CustomerService,
    private router: Router,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
   
    if (!this.branchId) {
      this.getCountriesList();
    }

    // api call
    if (this.branchId) {
   
      this.commonService.getCountries((c: any) => {
            this.customerService
              .getBranches() // get countries
              .pipe(first())
              .subscribe(
                branch => {
                  this.customerService
                    .getContact() // get countries
                    .pipe(first())
                    .subscribe(
                      primaryContact => {
                        if (c) {
                          if (branch) {
                            this.countries = c;
                            this.editBranchData = branch;
                            this.contact = this.editBranchData.find(
                              branch => branch.id == this.branchId
                            );
                            this.primaryC = primaryContact;
                            this.contact.addresses = this.primaryC.filter(
                              elm => elm.branchId == this.branchId
                            );
                            //console.log( this.contact.addresses);
                          }
                        }
                      },
                      err => {
                        this.alertService.clear();
                        this.alertService.error(err);
                      }
                    );
                },
                err => {
                  this.alertService.clear();
                  this.alertService.error(err);
                }
              );
          },
          err => {
            this.alertService.clear();
            this.alertService.error(err);
          }
        );

      // this.form.patchValue(this.contact);
    } else {
      this.contact = new Branch();
      this.contact.addresses.push({
        name: "",
        email: "",
        phone: "",
        role: "",
        status: false,
        phonePrefix2:"",
        isPrimary:false,
        customerId: this.cId
      });
    }
  }

  toggleStar() {
    if (this.contact) {
      this.contact.starred = !this.contact.starred;
    }
  }

  save() {
    // this.contact.id = contactIdCounter++;

    // api call
    this.contact.customerId = this.cId; // customer id
   
    if(!this.contact.name){
      this.validError = true;
      return;

    }
   this.dialogRef.close(this.contact);
  }

  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }

  addMoreField() {
    const countryId = this.contact.country;
    const selectedCountry = this.countries.find(f => f.id === countryId);

    if (this.cId) {
      this.cid = this.cId;
    } else {
      this.cid = null;
    }
    this.contact.addresses.push({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: false,
      phonePrefix2: selectedCountry && selectedCountry.phonecode ? selectedCountry.phonecode : '',
      isPrimary:false,
      customerId: this.cid
    });
  }

  removeAddress(i: number) {
    this.addresses.splice(i, 1);
  }

  checkValue(index?:number) {
  
    //if (event == true) {
      //this.updateIndex(index);

      //event.currentTarget.checked;
      
      this.currentState = this.addresses[index].isPrimary;     
    
      for(let i = 0; i < this.addresses.length; i++) {
          this.addresses[i].isPrimary = false;
      }
     
      this.addresses[index].isPrimary = !this.currentState.checked;
    
     
   // }
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
    this.contact.phonePrefix = selectedCountry.phonecode;
    this.contact.addresses.forEach((value, index) => {
      this.contact.addresses[index].phonePrefix2 = selectedCountry.phonecode;
    })
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    setTimeout(() => {
      this.contact[name] = val;
    });
  }
  multiPhoneNumberValidation(e, i) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    setTimeout(() => {
      this.contact.addresses[i].phone = val;
    });
  }

}
