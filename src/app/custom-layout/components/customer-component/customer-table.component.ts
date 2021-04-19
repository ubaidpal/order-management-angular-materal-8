import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { filter } from "rxjs/operators";
import { Customer } from "./interfaces/customer.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "../../../../@vex/interfaces/table-column.interface";
import {
  aioTableData,
  aioTableLabels
} from "../../../../static-data/aio-table-data";
import { CustomerCreateUpdateComponent } from "./customer-create-update/customer-create-update.component";
import { CustomerBranchesPopupComponent } from "./customer-branches-popup/customer-branches-popup.component";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icDetails from "@iconify/icons-ic/details";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import { SelectionModel } from "@angular/cdk/collections";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions
} from "@angular/material/form-field";
import { stagger40ms } from "../../../../@vex/animations/stagger.animation";
import { FormControl, FormGroup } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import { MatSelectChange } from "@angular/material/select";
import theme from "../../../../@vex/utils/tailwindcss";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import keyboardArrowUp from "@iconify/icons-ic/keyboard-arrow-up";
import keyboardArrowDown from "@iconify/icons-ic/keyboard-arrow-down";
import icClose from "@iconify/icons-ic/close";
import icCallSplit from "@iconify/icons-ic/call-split";


import { first } from "rxjs/operators";

import { AlertService } from "../../alert/alert.service";
import { CustomerService } from "../../_services/customer.service";
import { CommonService } from "../../_services/common.service";
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Utils from '../../_utils/utils';


@Component({
  selector: "vex-aio-table",
  templateUrl: "./customer-table.component.html",
  styleUrls: ["./customer-table.component.scss"],
  animations: [fadeInUp400ms, stagger40ms],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: "standard"
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class CustomerTableComponent
  implements OnInit, AfterViewInit, OnDestroy {
  layoutCtrl = new FormControl("fullwidth");

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  data$: Observable<Customer[]> = this.subject$.asObservable();
  customerData: any = [];
  customers: Customer[];
  country: any = [];
  role: any;
  state: any;
  obj: any;
  newCustomer: any = [];
  createCustomerModal: any;

  customerBranchesPopup: any;
  customerId: any;

  filteredBranchData: any = [];
  showBranchesLoading: boolean = false; 
  breadcrumbsParams:any = [
    {title: 'Customers List', url: '/customer' ,isActive: true}
  ];
  @Input()
  columns: TableColumn<Customer>[] = [
    {
      label: "Checkbox",
      property: "checkbox",
      type: "checkbox",
      visible: true
    },
    //{ label: 'Image', property: 'image', type: 'image', visible: true },
    {
      label: "Id",
      property: "id",
      type: "text",
      visible: false,
      cssClasses: ["font-medium"]
    },
    {
      label: "Customer",
      property: "name",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"]
    },
    { label: "Country", property: "country", type: "text", visible: true },
    {
      label: "Primary Name",
      property: "representative",
      type: "text",
      visible: true
    },
    { label: "Primry Email", property: "email", type: "text", visible: true },
    {
      label: "Regiestration Number",
      property: "registrationNumber",
      type: "text",
      visible: false
    },
    {
      label: "Address Line 1",
      property: "addressLine1",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Address Line 2",
      property: "addressLine2",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    { label: "City", property: "city", type: "text", visible: false },
    {
      label: "State",
      property: "state",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Post Code",
      property: "postcode",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Phone Number",
      property: "fullPhone",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Phone Number",
      property: "phoneNumber",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    { label: "Branch", property: "branch", type: "text", visible: false },
    // { label: 'Representative', property: 'representative', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: "Role", property: "role", type: "text", visible: false },
    {
      label: "Phone Number",
      property: "phoneNumber2",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    { label: "Labels", property: "labels", type: "button", visible: false },
    {
      label: "Branches",
      property: "hasBranch",
      type: "text",
      visible: true
    },
    {
      label: "Last Updated",
      property: "updatedDate",
      type: "text",
      visible: true
    },
    { label: "Actions", property: "actions", type: "button", visible: true }
  ];

  pageSize = 50;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Customer> | null;
  selection = new SelectionModel<Customer>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  icDetails = icDetails;
  keyboardArrowUp = keyboardArrowUp;
  keyboardArrowDown = keyboardArrowDown;
  icClose = icClose;
  icCallSplit = icCallSplit;

  countryName: any;
  theme = theme;
  customerList: any;
  branchesSet: boolean = false;
  updateCustomerList: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filterForm = new FormGroup({

    filterByCountry: new FormControl(),
    fiterBybranch: new FormControl()

  });
  get filterByCountry() { return this.filterForm.get('filterByCountry'); }
  get fiterBybranch() { return this.filterForm.get('fiterBybranch'); }

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private commonService: CommonService,
    private alertService: AlertService,
    private titleService: Title,
    private router: Router,
    private datePipe: DatePipe,

  ) {
    this.titleService.setTitle("Customer");

    this.getCountriesList();
    this.getStates(); // all States
    // this.getRoles();// getBranch
    this.getCustomer();
  }

  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    // return of(aioTableData.map(customer => new Customer(customer)));
    return of(this.customerData.map(customer => new Customer(customer)));
  }

  ngOnInit() {


    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<Customer[]>(Boolean)).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  createCustomer() {
    this.createCustomerModal = this.dialog.open(CustomerCreateUpdateComponent);

    this.createCustomerModal.componentInstance.countries = this.country;
    this.createCustomerModal.componentInstance.roles = this.role;

    this.createCustomerModal.afterClosed().subscribe((customer: Customer) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        this.alertService.clear();
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customerService
          .save(customer)
          .pipe(first())
          .subscribe(
            data => {
              if (data != null) {
                this.alertService.success("Customer Added Successfully..");
                this.newCustomer = data;
                this.dataSource.data.unshift(new Customer(this.newCustomer));
                this.subject$.next(this.dataSource.data);
              }
            },
            err => {
              console.log(err);
            }
          );
      }
    });


  }

  updateCustomer(customer: Customer) {
    this.alertService.clear();
    let mod = this.dialog.open(CustomerCreateUpdateComponent, {
      data: customer
    });
    mod.componentInstance.countries = this.country;
    mod.componentInstance.roles = this.role;

    mod.afterClosed().subscribe(updatedCustomer => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customerService
          .save(updatedCustomer)
          .pipe(first())
          .subscribe(
            data => {

              if (!data) {

                this.alertService.success("Customer Updated Successfully.");
                this.updateCustomerList = updatedCustomer;


                // const index = this.updateCustomerList.findIndex(
                //   existingCustomer => existingCustomer['id'] === updatedCustomer['id']
                // );
                // this.dataSource.data[index] = new Customer(updatedCustomer);
                // this.subject$.next(this.dataSource.data);
                this.getCustomer();
              }
            },
            err => {
              console.log(err);
            }
          );
      }
    });


  }
  isFindElement(element) {
    return element >= 0;
  }

  deleteCustomer(customer: Customer) {
    this.alertService.clear();
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    if(confirm("Are you sure you want to delete "+customer.name)) {

      this.customerService
      .deleteCustomer(customer.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.alertService.success("customer Deleted Successfully!!");
            this.dataSource.data.splice(
              this.customers.findIndex(
                existingCustomer => existingCustomer.id === data["id"]
              ),
              1
            );
            this.selection.deselect(customer);
            this.subject$.next(this.customers);
          }
        },
        err => {
          //console.log(err);
          this.alertService.error(err);
        }
      );
    } 
     
    
  }

  deleteCustomers(customers: Customer[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteCustomer(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Customer) {
    const index = this.customers.findIndex(c => c === row);
    this.customers[index].name = change.value;
    this.subject$.next(this.customers);
  }

  getCountriesList() {
    this.commonService.getCountries((data: any) => {
      this.country = data;
    }, (error: any) => {
      console.log('get countries:', error)
    });
  }

  getCountry() {
    return this.customerService
      .getCountry()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.country = data;
        }
      });
  }
  getRoles() {
    return this.customerService
      .getRoles()
      .pipe(first())
      .subscribe(data => {
        if (data["records"].length) {
          this.role = data["records"];
        }
      });
  }
  getStates() {
    return this.customerService
      .getStates()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.state = data;
        }
      });
  }

  async getCustomer() {
    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.customerService
      .getCustomer()
      .pipe(first())
      .subscribe(
        data => {
          if (data && data.length) {
            this.customerData = data;
            this.loadCompanyData();

            //  this.alertService.success("Data loaded Successfully.");
          } else {
            this.customerData = [];
            this.loadCompanyData();

          }
        },
        err => {
          console.log(err);
        }
      );
  }
  loadCompanyData() {

    this.getData().subscribe(customers => {
      this.subject$.next(customers);
    });

  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getCountryName(id?: number) {
    if (this.country) {
      this.countryName = this.country.find(elm => elm.id == id);

      if (this.countryName) {
        return this.countryName.name;
      } else {
        return "";
      }
    }
  }

  // getBranchesByCustomerId(cId) {
  //   this.customerId = cId;
  //   // this.showBranchesLoading = true;
  //   // this.filteredBranchData = [];
  //   // this.customerService
  //   //   .getBranchesByCustomerId(cId) // get countries
  //   //   .pipe(first())
  //   //   .subscribe(
  //   //     branches => {
  //   //       if (branches) {
  //   //         // this.branchesData = branches;
  //   //         console.log(branches);
  //   //         this.filteredBranchData = branches;
  //   //       } else {
  //   //         this.filteredBranchData = [];
  //   //       }
  //   //       this.showBranchesLoading = false;
  //   //     },
  //   //     err => {
  //   //       this.alertService.clear();
  //   //       this.alertService.error(err);
  //   //       this.showBranchesLoading = false;
  //   //     }
  //   //   );
  // }

  openBranchesPopup(cId) {
    this.customerBranchesPopup = this.dialog.open(CustomerBranchesPopupComponent, {
      data: {
        customerId: cId
      }
    });
    this.customerBranchesPopup.componentInstance.customerId = cId;
  }
  customerDetails(cId?: number) {
    ///customer-details
    this.router.navigate(['/customer-details', { cId: cId }]);

  }

  getCustomerById(cid: any) {

    this.customerService.getCustomerById(cid) // get countries
      .pipe(first())
      .subscribe(customer => {

        if (customer) {
          this.customerList = customer;

          //  this.breadRoute = this.customers.name+'?prop='+this.customers.id;
          if (this.customerList.hasBranch == true) {

            this.branchesSet = true;

          }

        }


      }, err => {
        this.alertService.clear();
        this.alertService.error(err);
      });


  }

  filterByCountryOrByBranches(value) {
    this.dataSource.data = this.customers;
    const country = value.filterByCountry;
    const branch = value.fiterBybranch;
  
    this.dataSource.data = this.dataSource.data.filter(e => {
      let isCountry = true,
        isBranch = true;

      if (country) {
        isCountry = e.country == country;
      }

      if (branch) {
        if (e.hasBranch && branch == 'multi_branch') {
          isBranch = true;
        } else if (!e.hasBranch && branch == 'no_branch') {
          isBranch = true;
        } else {
          isBranch = false;
        }
      }
   
      return isCountry
      && isBranch;

    }).sort(  );
  }
  clearFormValue() {
    this.filterForm.setValue({

      filterByCountry: '',
      fiterBybranch: ''
    });
    // api
    this.dataSource.data = this.customers;
  }

  dateFormate(date) {
    return this.datePipe.transform(date, Utils.getDateFormate());
  }

  ngOnDestroy() { }
}
