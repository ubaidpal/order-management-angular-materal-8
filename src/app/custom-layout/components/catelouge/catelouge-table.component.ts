import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Catelouge } from './model/catelouge.model'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { CatelougeTableData, aioTableLabels } from 'src/static-data/catelouge-table-data';

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
import { FormControl, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from 'src/@vex/utils/tailwindcss';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import { Title } from '@angular/platform-browser';
import { CustomerService } from '../../_services/customer.service';
import { AlertService } from "../../alert/alert.service";
import { ProductService } from '../../_services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { DatePipe } from '@angular/common';
import Utils from '../../_utils/utils';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'vex-catelouge-aio-table',
  templateUrl: './catelouge-table.component.html',
  styleUrls: ['./catelouge-table.component.scss'], 
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
export class CatelougeTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('fullwidth');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Catelouge[]> = new ReplaySubject<Catelouge[]>(1);
  data$: Observable<Catelouge[]> = this.subject$.asObservable();
  customers: Catelouge[];

  @Input()
  columns: TableColumn<Catelouge>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Id', property: 'id', type: 'text', visible: false, cssClasses: ['font-medium'] },
    { label: 'Product Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Product Code', property: 'code', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Customer', property: 'customerId', type: 'text', visible: true },
    { label: 'Brand', property: 'customerBrand', type: 'text', visible: true },
    { label: 'Type', property: 'type', type: 'text', visible: true },
    { label: 'Sizes', property: 'sizes', type: 'text', visible: true },
    { label: 'Updated On', property: 'updatedOn', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Catelouge> | null;
  selection = new SelectionModel<Catelouge>(true, []);
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

  theme = theme;
  catelouge:any;
  getCustomer:any;
  getCustomerName :any;
  cId:any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filterForm = new FormGroup({
    fromOrderDate: new FormControl(),
    toOrderDate: new FormControl(),
    fromShipmentDate: new FormControl(),
    toShipmentDate: new FormControl(),
    customer2: new FormControl(),
    poNumber: new FormControl(),
    status: new FormControl(),
    sizes: new FormControl()
  });
  typeConfigurationProperties: any;
  varistionsArray: any;

  get fromOrderDate() { return this.filterForm.get('fromOrderDate'); }
  get toOrderDate() { return this.filterForm.get('toOrderDate'); }
  get fromShipmentDate() { return this.filterForm.get('fromShipmentDate'); }
  get toShipmentDate() { return this.filterForm.get('toShipmentDate'); }
  get status() { return this.filterForm.get('status'); }
  get customer2() { return this.filterForm.get('customer2'); }
  get poNumber() { return this.filterForm.get('poNumber'); }
  get sizes() { return this.filterForm.get('sizes'); }
  constructor(private dialog: MatDialog,
    private customerService: CustomerService,
    private productService: ProductService,
    private alertService: AlertService,
    private titleService: Title,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar,
    ) {

      this.cId = this.route.snapshot.paramMap.get('cId');
      this.titleService.setTitle("Catalouge");
      this.getPropertyTypes();
      this.getSizesVariations();
      this.getProducts(this.cId );
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    return of(this.catelouge.map(customer => new Catelouge(customer)));
  }

  ngOnInit() {
    

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Catelouge[]>(Boolean)
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



  

  deleteCustomer(customer: Catelouge) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
    this.selection.deselect(customer);
    this.subject$.next(this.customers);
  }

  deleteCustomers(customers: Catelouge[]) {
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

  onLabelChange(change: MatSelectChange, row: Catelouge) {
    const index = this.customers.findIndex(c => c === row);
    //this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  ngOnDestroy() {
  }
  getDateRange(value) {
    this.dataSource.data = this.customers;
    // getting date from calendar
    const fromOrderDate = value.fromOrderDate;
    const toOrderDate = value.toOrderDate;
    const fromShipmentDate = value.fromShipmentDate;
    const toShipmentDate = value.toShipmentDate;
    const customer2 = value.customer;
    const status = value.statuses;
    const bname = value.bname;

    this.dataSource.data = this.dataSource.data.filter(e => {
      let fromDateCheck = true,
        toOrderDateCheck = true,
        fromShipmentDateCheck = true,
        toShipmentDateCheck = true;

      if (fromOrderDate) {
        fromDateCheck = e.updatedOn > fromOrderDate;
      }
      if (toOrderDate) {
        toOrderDateCheck = e.updatedOn > toOrderDate;
      }


      if (fromShipmentDate) {
        fromShipmentDateCheck = e.updatedOn > fromShipmentDate;
      }


      if (toShipmentDate) {
        toShipmentDateCheck = e.updatedOn > toShipmentDate;
      }

      return fromDateCheck
        && toOrderDateCheck
        && fromShipmentDateCheck
        && toShipmentDateCheck
        && e.customerId.includes(customer2)
        && e.customerBrand.includes(bname);
    }).sort((a, b) => a.updatedOn - b.updatedOn
        || a.updatedOn - b.updatedOn

      );
  }

  clearFormValue() {
    this.filterForm.setValue({
      fromOrderDate: '',
      toOrderDate: '',
      fromShipmentDate: '',
      toShipmentDate: '',
      customer2: '',
      status: '',
      poNumber: '',
      sizes: ''
    });
    // api
    this.dataSource.data = this.customers;
  }

  async getProducts(Cid?:number) {
    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.productService
      .getProductsByCustomerId(Cid)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.catelouge = data;
            this.loadData();
            this.getAllCustomers();
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

  async getPropertyTypes() {
    this.commonService
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

  totalVariations(data: any, action?: any) {
    const pVariations = data.productVariations ? data.productVariations : [];
    const varistionsArray = this.varistionsArray;
    const names = [];
    if (action === 'name') {
      pVariations.forEach(ver => {
        varistionsArray.forEach(element => {
          if (ver.variationId === element.id) {
            names.push(element.name);
          }
        });
      });
      return names.toString();
    }
    return (pVariations.length === 1 && pVariations.length > 0) ? pVariations.length + ' varients' : pVariations.length + ' varients';
  }

  dateFormate(date) {
    return this.datePipe.transform(date, Utils.getDateFormate());
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

}
