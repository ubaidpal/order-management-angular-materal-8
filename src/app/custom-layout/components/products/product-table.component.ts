import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Customer } from './interfaces/customer.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { productTableData, productTableLabels } from 'src/static-data/product-data';
import { CustomerCreateUpdateComponent } from './customer-create-update/customer-create-update.component';
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
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { FormControl ,FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from 'src/@vex/utils/tailwindcss';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icDetails from "@iconify/icons-ic/details";
import {Title} from "@angular/platform-browser";
import { Router ,ActivatedRoute } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { ProductService } from '../../_services/product.service';
import { CustomerService } from '../../_services/customer.service';
import Utils from '../../_utils/utils';
import _ from 'underscore';
import { CommonService } from '../../_services/common.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'vex-aio-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
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
export class ProductTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('fullwidth');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  data$: Observable<Customer[]> = this.subject$.asObservable();
  customers: Customer[];

  @Input()
  columns: TableColumn<Customer>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Product Code', property: 'code', type: 'text', visible: true, cssClasses: ['font-medium'] },
     { label: 'Product Name', property: 'name', type: 'text', visible: true },
     { label: 'Customer Name', property: 'customerId', type: 'text', visible: true },
    { label: 'Brand', property: 'customerBrand', type: 'text', visible: true },
    { label: 'Type', property: 'type', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Size', property: 'size', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Updated On', property: 'updatedAt', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: '', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 50;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Customer> | null;
  selection = new SelectionModel<Customer>(true, []);
  searchCtrl = new FormControl();
  brandsArray = [];

  labels = productTableLabels;

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icDetails = icDetails;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;

  theme = theme;

  products:any;
  getCustomer:any;
  getCustomerName :any;
  breadcrumbsParams:any = [
    {title: 'Products', url: '/product',isActive: true}
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filterForm = new FormGroup({
   
    customer: new FormControl(),
    brand: new FormControl(),
    type: new FormControl(),
  });
  varistionsArray: any = [];
  typeConfigurationProperties: any;
  
  get customer() { return this.filterForm.get('customer'); }
  get brand() { return this.filterForm.get('brand'); }
  get type() { return this.filterForm.get('type'); }
  constructor(
              private dialog: MatDialog,
              private titleService:Title,
              private router: Router,
              private customerService: CustomerService,
              private productService: ProductService,
              private commonService: CommonService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private datePipe: DatePipe,

             ) 
             {
              this.titleService.setTitle("Products");
              const oldVersion = Utils.getLocalStorage('api_version');
              const newVersion = Utils.newLocalApiVersion();
              if (oldVersion !== newVersion) {
                Utils.resetLocalStorageItems();
                Utils.setLocalStorage('api_version', newVersion);
              }
              this.getPropertyTypes();
              this.getSizesVariations();
              this.getProducts();
             }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    return of(this.products.map(customer => new Customer(customer)));
  }

  ngOnInit() {
    

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Customer[]>(Boolean)
    ).subscribe(customers => {
      this.customers = customers;
      if (customers && customers.length > 0) {
        let allBrands = _.compact(_.pluck(customers, 'customerBrand'));
        allBrands = _.uniq(allBrands, (x:any) => {
          return x.name;
        });
        this.brandsArray = allBrands ? allBrands : [];
      }
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
    this.dialog.open(CustomerCreateUpdateComponent).afterClosed().subscribe((customer: Customer) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customers.unshift(new Customer(customer));
        this.subject$.next(this.customers);
      }
    });
  }

  addProduct() {
    this.router.navigate(['/add-product']);
  }

  updateCustomer(customer: Customer) {
    const url = '/update-product/'+customer.id;
    this.router.navigate([url]);
    return;
    this.dialog.open(CustomerCreateUpdateComponent, {
      data: customer
    }).afterClosed().subscribe(updatedCustomer => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.customers.findIndex((existingCustomer) => existingCustomer.id === updatedCustomer.id);
        this.customers[index] = new Customer(updatedCustomer);
        this.subject$.next(this.customers);
      }
    });
  }

  deleteCustomer(customer: Customer) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    if (confirm("Do you want to delete this product?")) {
      this.productService
      .delProductById(customer.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.alertService.success("Product Deleted Successfully!!");
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


    // this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
    // this.selection.deselect(customer);
    // this.subject$.next(this.customers);
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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Customer) {
    const index = this.customers.findIndex(c => c === row);
   // this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  ngOnDestroy() {
  }

  getDateRange(value) {
    
    this.dataSource.data = this.customers;
    // getting date from calendar
    
    const customer = value.customer;
    const brand = value.brand;
    const type = value.type;
    
   
    this.dataSource.data = this.dataSource.data.filter(e => {
      let fromCustomerCheck = true,
        toBrandCheck = true,
        toTypeCheck = true;
        console.log( e.productProperties);

      if (customer) {
       fromCustomerCheck = e.customerId == customer;
      }
      if (brand) {
        toBrandCheck = e.customerBrand.id == brand;
      }

      if (type) {
       
        toTypeCheck = e.productProperties.find(elm => elm.propertyId == type);
        
      
     
      }

      return fromCustomerCheck
        && toBrandCheck
        && toTypeCheck
  }).sort(  );
    console.log(customer, brand, type);
  }

  clearFormValue() {
    this.filterForm.setValue({
     
      customer: '',
      brand: '',
      type: ''
    });
    // api
    this.dataSource.data = this.customers;
  }
  navigateToOrderDetails(){
    this.router.navigate(['create-order']);
  }

  async getProducts() {
    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.productService
      .getProducts()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            let productsArray:any = data;
            productsArray = _.map(productsArray, (d:any) => {
              const code = d.code.replace( /\s/g, '');
              return {
                ...d,
                code
              };
            })
            this.products = productsArray;
            this.loadData();
            this.getAllCustomers();
            this.alertService.success("Data loaded Successfully.");
          }

        },
        err => {

          this.alertService.error(err);
        }
      );
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  loadData() {
   
    this.getData().subscribe(customers => {
      this.subject$.next(customers);
    });

  }
  getAllCustomers() {

     this.customerService
    .getCustomer()
    .pipe(first())
    .subscribe(
      data => {
        if (data) {
          this.getCustomer = data;
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  getCompanyName(cId?:number){
    if (this.getCustomer) {
      this.getCustomerName = this.getCustomer.find(elm => elm.id == cId);
      if (this.getCustomerName) {
        return this.getCustomerName.name;
      } else {
        return "";
      }
    }
  }

  totalVariations(data: any, action?: any) {
    const pVariations = data.productVariations ? data.productVariations : [];
    const varistionsArray = this.varistionsArray;
    const names = [];
    if (action === 'name') {
      //console.log('varistionsArray >>', varistionsArray)
      pVariations.forEach(ver => {
        varistionsArray.forEach(element => {
          if (ver.variationId === element.id) {
            names.push(element.name);
          }
        });
      });
      //console.log('names >>>', names, names.toString())
      return names.toString();
    }
    return (pVariations.length === 1 && pVariations.length > 0) ? pVariations.length + ' variants' : pVariations.length + ' variants';
  }

  getProductType(data) {
    const productProperties = data.productProperties ? data.productProperties : [];
    const typeConfigurationProperties = this.typeConfigurationProperties;
    let propertyName = '';
    productProperties.forEach(pProp => {
      typeConfigurationProperties.forEach(configProp => {
        if (pProp.propertyId === configProp.id) {
          propertyName = configProp.name;
        }
      });
    });
    return propertyName;
  }

  async getSizesVariations() {
    return await this.commonService
      .getSizesVariations(
        data => {
          if (data) {
            this.varistionsArray = data;
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  async getPropertyTypes() {
    return this.commonService
      .getPropertyTypes(
        data => {
          if (data) {
            let getData: any = data;
            this.typeConfigurationProperties = getData.find(elm => elm.name === "Configuration");
            this.typeConfigurationProperties = this.typeConfigurationProperties['properties'] ? this.typeConfigurationProperties['properties'] : [];
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
    }
    
    dateFormate(date) {
      return this.datePipe.transform(date, Utils.getDateFormate());
    }

  getMultiCustomerList(customerProducts, customerId) {
    let cus = [];
    if (customerProducts && customerProducts.length > 0) {
      cus = customerProducts.map(c => {
        if (c.customerId !== customerId) {
          return c;
        }
      })
    }
    return _.compact(cus);
  }

}
