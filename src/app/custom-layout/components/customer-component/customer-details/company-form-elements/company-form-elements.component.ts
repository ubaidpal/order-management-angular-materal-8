import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icSmartphone from '@iconify/icons-ic/twotone-smartphone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icCamera from '@iconify/icons-ic/twotone-camera';
import icPhone from '@iconify/icons-ic/twotone-phone';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith, first } from 'rxjs/operators';
import { fadeInUp400ms } from '../../../../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../../../../@vex/animations/stagger.animation';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icBusiness from '@iconify/icons-ic/business';
import { iconsFA } from "src/static-data/icons-fa";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../alert/alert.service';
import { CustomerService } from '../../../../_services/customer.service';
import { CommonService } from "../../../../_services/common.service";
import { Customer } from './../../interfaces/customer.model';
import { ReplaySubject, Observable } from 'rxjs';
import Utils from 'src/app/custom-layout/_utils/utils';
export interface CountryState {
  name: string;
  population: string;
  flag: string;
}

@Component({
  selector: 'company-form-elements',
  templateUrl: './company-form-elements.component.html',
  styleUrls: ['./company-form-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class CompanyFormElementsComponent implements OnInit {

  @Output() valueChange = new EventEmitter();

  brachStaus: any;

  subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  data$: Observable<Customer[]> = this.subject$.asObservable();

  selectCtrl: FormControl = new FormControl();
  inputType = 'password';
  visible = false;
  phonePrefixOptions = [];

  icPhone = icPhone;
  icCamera = icCamera;
  icMenu = icMenu;
  icArrowDropDown = icArrowDropDown;
  icSmartphone = icSmartphone;
  icPerson = icPerson;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icBusiness = icBusiness;
  iconsUser = iconsFA.user;
  iconstrash = iconsFA.trash;
  stateCtrl = new FormControl();
  formAddCustomer: FormGroup;
  countries: any;
  states: any;
  cities: any;
  defaults: any = {};
  disableButton = true;
  cId = null;
  branchList: any;
  phone1: any = '';
  phone2: any = '';



  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,

  ) { }

  ngOnInit() {
    //this.alertService.success("Please wait customer data going to load.");
    this.cId = this.route.snapshot.paramMap.get('cId');// get customer id
    //this.route.snapshot.paramMap.get('prop');

    // this.getBranches();
    this.getCustomerDetails();


    this.formAddCustomer = this.fb.group({

      id: new FormControl(''),
      name: new FormControl(''),
      registrationNumber: new FormControl(''),
      country: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      postcode: new FormControl(''),
      phonePrefix: new FormControl(''),
      phoneNumber: new FormControl(''),
      branch: new FormControl(''),
      allbranch: new FormControl(''),
      hasBranch: false,
      representative: new FormControl(''),
      email: new FormControl(''),
      phonePrefix2: new FormControl(''),
      phoneNumber2: new FormControl(''),
      role: new FormControl('')
    });


  }
  getBranches() {
    return this.customerService
      .getBranches()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.branchList = data;
          this.branchList = this.branchList.filter(elm => elm.customerId == this.cId);
        }
      });
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

  // filterStates(name: string) {
  //   return this.states.filter(state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }

  getCustomerDetails() {

    this.commonService.getCountries((countriesArray: any) => {
      this.countries = countriesArray;
      this.phonePrefixOptions = Utils.getPhoneCodes(countriesArray);
      this.customerService.getCustomerDetails(this.cId)  // get current Customer
        .pipe(first())
        .subscribe(customer => {
          const customerData: any = customer;
          if (customerData) {
            if (countriesArray) {
              this.customerDetail(customerData);
              this.disableButton = false;
              const phoneNumberCode = Utils.getPhoneCodeByNumber(customerData.phoneNumber);
              const phoneNumber2Code = Utils.getPhoneCodeByNumber(customerData.phoneNumber2);
              this.formAddCustomer.patchValue({
                phonePrefix: phoneNumberCode,
                phonePrefix2: phoneNumber2Code
              });
            }
          }
        }, err => {
          this.alertService.clear();
          this.alertService.error(err);
        });
    }, error => {
      this.alertService.clear();
      this.alertService.error(error);
    });


  }
  customerDetail(data) {


    if (data.phoneNumber) {
      this.phone1 = data.phoneNumber.split('-');
    }
    if (data.phoneNumber2) {
      this.phone2 = data.phoneNumber2.split('-');
    }


    this.formAddCustomer.setValue({
      id: data.id,
      name: data.name || '',
      registrationNumber: data.registrationNumber || '',
      country: data.country || '',
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      city: data.city || '',
      state: data.state || '',
      postcode: data.postcode || '',
      phonePrefix: this.phone1[0] ? this.phone1[0] : '',
      phoneNumber: this.phone1[1] ? this.phone1[1] : '',
      branch: data.hasBranch == false ? true : false || '',
      allbranch: data.hasBranch == true ? true : false || '',
      hasBranch: data.hasBranch,
      representative: data.representative || '',
      // role: data.role || '',
      role: data.representativeRole || '',
      email: data.email || '',
      phonePrefix2: this.phone2[0] ? this.phone2[0] : '',
      phoneNumber2: this.phone2[1] ? this.phone2[1] : '',
    });


    let activeCountry = this.countries.find(c => c.id == parseInt(data.country));
    this.formAddCustomer.controls['country'].setValue(activeCountry.id);
    //this.states.find(elem => elem.id == parseInt(data.state));

    this.alertService.clear();
    //  this.alertService.success("Customer Data Loaded Successfully!!");

    return this.formAddCustomer.value;

  }

  getStateByCountryId(cId) {
    const selectedCountry = this.countries.find(f => f.id === cId);
    this.formAddCustomer.patchValue({
      phonePrefix: selectedCountry.phonecode,
      phonePrefix2: selectedCountry.phonecode
    });
    return this.customerService.getStateByCountryId(cId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.states = data;
        }
      });


  }

  getCityByStatesId(sId) {
    return this.customerService.getCityByStatesId(sId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.cities = data;
        }
      });

  }
  backToCustomerPage() {
    this.router.navigate(['customer']);

  }
  save() {

    if (this.formAddCustomer.value) {

      this.disableButton = true;

      this.alertService.clear();
      /**
       * Here we are updating our local array.
       * You would probably make an HTTP request here.
       */
      const customer = this.formAddCustomer.value;
      this.customerService.save(customer)
        .pipe(first())
        .subscribe(data => {

          if (!data) {

            this.brachStaus = customer.hasBranch;
            // this.formAddCustomer = customer;
            //  console.log('asassaasas', this.formAddCustomer );
            this.getCustomerDetails();
           
            setTimeout(() => {
              this.valueChanged();
            }, 2000);


          }
        }, err => {
          this.alertService.error(err);
        });


    }
  }

  phoneNumberValidation(e, name) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.formAddCustomer.patchValue({
      [name]: val
    });
  }

  valueChanged() { // You can give any function name

    this.valueChange.emit(this.brachStaus);


  }

}
