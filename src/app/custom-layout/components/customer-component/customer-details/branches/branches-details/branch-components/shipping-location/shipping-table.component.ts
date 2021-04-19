import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ShippingCreateUpdateComponent } from './shipping-create-update/shipping-create-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from 'src/@vex/utils/tailwindcss';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import { ActivatedRoute, Router } from '@angular/router';



import { first } from 'rxjs/operators';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';


import { ShipingLocation, shippingTableLabels } from 'src/static-data/shipping-table-data';
import { Shipping } from 'src/app/custom-layout/components/customer-component/interfaces/shipping.model';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'shipping-vex-aio-table',
  templateUrl: './shipping-table.component.html',
  styleUrls: ['./shipping-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ShippingTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Shipping[]> = new ReplaySubject<Shipping[]>(1);
  data$: Observable<Shipping[]> = this.subject$.asObservable();
  customers: Shipping[];

  @Input()
  columns: TableColumn<Shipping>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Id', property: 'id', type: 'text', visible: false, cssClasses: ['font-medium'] },
    { label: 'Location Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Ship To', property: 'shipTo', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Address', property: 'address', type: 'text', visible: true },
    { label: 'Address 1', property: 'addressLine1', type: 'text', visible: false },
    { label: 'Address 2', property: 'addressLine2', type: 'text', visible: false },
    { label: 'City', property: 'city', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'State', property: 'state', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Country', property: 'countryId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Postcode', property: 'postCode', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Load Plan', property: 'loadingStyleId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Currency', property: 'currency', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Contact Person', property: 'contactPerson', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Ship By', property: 'shipBy', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Transhipment', property: 'transhipment', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Origin Of Goods', property: 'originOfGoods', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Type', property: 'type', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Delivery Terms', property: 'deliveryTerms', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Shipping> | null;
  selection = new SelectionModel<Shipping>(true, []);
  searchCtrl = new FormControl();

  labels = shippingTableLabels;

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

  theme = theme;

  branchId = null;
  customerId = null;
  cId = null;
  countries: any;
  createContactModal: any;
  updateContactModal: any;
  contactData: any;
  countryName: any;
  loadPlan: any;
  contactList: any;
  currencyList: any;
  shippingType: any;
  shippingMethod: any;
  loadPlanName: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private customerService: CustomerService, 
    private commonService: CommonService,
    private titleService: Title,
    private snackbar: MatSnackBar,
  ) {
    //this.customerId = this.route.snapshot.paramMap.get('cId');

    this.cId = this.route.snapshot.paramMap.get('cId');
    this.branchId = this.route.snapshot.paramMap.get('branchId');
  
    this.titleService.setTitle("Shipping Location");

     // All Countries

    if (this.branchId) {
      this.getShipping(this.branchId ,null);// get All Shiiping
    } else {
      this.getShipping(null ,this.cId);// get All Shiiping
    }
  
  }


  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    //api call
    //this.branchId this id used in branchId
    return of(this.contactData.map(customer => new Shipping(customer)));
  }

  ngOnInit() {


    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Shipping[]>(Boolean)
    ).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createCustomer() {

    this.createContactModal = this.dialog.open(ShippingCreateUpdateComponent);

    this.createContactModal.componentInstance.countries = this.countries;
    this.createContactModal.componentInstance.loadPlan = this.loadPlan;
    this.createContactModal.componentInstance.contactList =this.contactList;
    this.createContactModal.componentInstance.currencyList = this.currencyList;
    this.createContactModal.componentInstance.shippingType = this.shippingType;
    this.createContactModal.componentInstance.shippingMethod = this.shippingMethod;

    this.createContactModal.afterClosed().subscribe((shipping: Shipping) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (shipping) {
        this.alertService.clear();
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */

        if (this.cId && this.branchId) {
          this.saveShiiping(shipping, this.cId, this.branchId);
        } else if (this.cId) {``
          this.saveShiiping(shipping, this.cId, null);
        }


      }
    });

  

    
  }

  saveShiiping(shipping, cId?: number, bid?: number) {
    this.customerService
      .saveShippingLocation(shipping, cId, bid)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            this.customers.unshift(new Shipping(data));
            this.subject$.next(this.customers);
            this.showMessage('Shipping added successfully', 'snackbar-success');
          }
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        });
  }

  updateCustomer(shiping: Shipping) {

    this.alertService.clear();
    this.updateContactModal = this.dialog.open(ShippingCreateUpdateComponent, {
      data: shiping
    });
    this.updateContactModal.componentInstance.countries = this.countries;
    this.updateContactModal.componentInstance.loadPlan = this.loadPlan;

    this.updateContactModal.componentInstance.contactList =this.contactList;
    this.updateContactModal.componentInstance.currencyList = this.currencyList;
    this.updateContactModal.componentInstance.shippingType = this.shippingType;
    this.updateContactModal.componentInstance.shippingMethod = this.shippingMethod;
    
    this.updateContactModal.afterClosed().subscribe(updatedContact => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedContact) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        if (this.cId && this.branchId) {
          this.updateShiiping(updatedContact, this.cId, this.branchId);
        } else if (this.cId) {
          this.updateShiiping(updatedContact, this.cId, null);
        }
        
      }
    });
  }

  updateShiiping(shipping:any, cId?: number, bid?: number) {

    this.customerService
      .updateShippingLocation(shipping, cId, bid)
      .pipe(first())
      .subscribe(
        data => {
          if (!data) {

            this.alertService.success("Customer Updated Successfully.");
            const index = this.customers.findIndex((existingCustomer) => existingCustomer.id === shipping.id);
            this.customers[index] = new Shipping(shipping);
            this.subject$.next(this.customers);

          }
        },
        err => {
          this.alertService.error(err);
        });

  }

  deleteCustomer(customer: Shipping) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.customerService
      .deleteShipping(customer.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.alertService.success("shipping Deleted Successfully!!");

            this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === data["id"]), 1);
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

  deleteCustomers(customers: Shipping[]) {
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Shipping) {
    const index = this.customers.findIndex(c => c === row);
    // this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }
  getCountry() {

    return this.commonService.getCountries((data: any) => {
      this.countries = data;
      this.getCurrency();
      this.getShippingType();
      this.getShippingMethod();
    }, (error: any) => {
      console.log('get countries:', error)
    });

  
  }
  async getShipping(bId? :number , cId?:number) {
    this.alertService.clear();
    this.delay(1000);
    return await this.customerService
      .getShippingLocationsByCustomerId(bId , cId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.showMessage('Data loaded Successfully', 'snackbar-success');
            this.contactData = data;
            this.loadContactData();
            this.getCountry();
            this.getLoadPlan(); // Load Plan
          } else {
            this.contactData = [];
            this.loadContactData();
            this.getCountry();
            this.getLoadPlan(); // Load Plan
          }
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  loadContactData() {

    this.getData().subscribe(contact => {
      this.subject$.next(contact);
    });

  }
  getCountryName(id?: number) {
 
    if (this.countries) {
      this.countryName = this.countries.find(elm => elm.id == id);

      if (this.countryName) {
        return this.countryName.name;
      } else {
        return "";
      }
    }
  }
  getLoadPlan() {
    return this.customerService
      .getLoadPlan()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.loadPlan = data;
          if (this.cId) {
     
          this.getContactPerson(this.cId , null);
          }else{
            this.getContactPerson(null , this.branchId);
          
          }
        
        }
      });
  }

  getContactPerson(cId?:number , bId?:number) {
    return this.customerService
      .getContactPerson(cId ,bId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.contactList = data;
       
        
        }
      });
  }
  getCurrency() {
    return this.customerService
      .getCurrency()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.currencyList = data;
        
        
        }
      });
  }
  getShippingType() {
    return this.customerService
      .getShippingType()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.shippingType = data;
         
        
        }
      });
  }

  getShippingMethod() {
    return this.customerService
      .getShippingMethod()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.shippingMethod = data;
        
        }
      });
  }
  getLoadPlanByName(id?: number) {
    if (this.loadPlan) {
      this.loadPlanName = this.loadPlan.find(elm => elm.id == id);

      if (this.loadPlanName) {
        return this.loadPlanName.name;
      } else {
        return "";
      }
    }
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
  ngOnDestroy() {
  }
}
