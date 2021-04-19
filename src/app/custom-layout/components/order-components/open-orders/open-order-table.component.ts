import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AllOrders } from '../models/allorders.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { allOrders, aioTableLabels } from 'src/static-data/all-orders';
import * as _ from "underscore";
import { OpenOrderCreateUpdateComponent } from './open-order-create-update/open-order-create-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icDownload from '@iconify/icons-ic/file-download';
import icShare from '@iconify/icons-ic/share';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from 'src/@vex/utils/tailwindcss';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icDetails from "@iconify/icons-ic/details";
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';  

import { Title } from "@angular/platform-browser";
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import { ProductService } from 'src/app/custom-layout/_services/product.service';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import Utils from 'src/app/custom-layout/_utils/utils';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'open-orders-table',
  templateUrl: './open-order-table.component.html',
  styleUrls: ['./open-order-table.component.scss'],
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
export class OpenOrderComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<AllOrders[]> = new ReplaySubject<AllOrders[]>(1);
  data$: Observable<AllOrders[]> = this.subject$.asObservable();
  customers: AllOrders[];
  @Output() changeMode = new EventEmitter();
  @Input() status: string = '';
  @Input() currentPage: string = '';
  @Input() activeStatus: string;
  @Input() activeTab: string;

  columns: TableColumn<AllOrders>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Id', property: 'id', type: 'text', visible: false },
    { label: 'Po Number', property: 'orderNo', type: 'text', visible: false, cssClasses: ['font-medium'] },
    { label: 'PI Number', property: 'proformaInvoiceNo', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Customer', property: 'customerName', type: 'text', visible: true },
    { label: 'Ship To', property: 'shippingLocationId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Pi Date', property: 'proformaInvoiceDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Shipment Date', property: 'shipmentDate', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Remaining', property: 'paymentTerms', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Paking Progress', property: 'packingProgress', type: 'text', visible: true },
    { label: 'Status', property: 'status', type: 'text', visible: true },
    { label: 'Order QTY', property: 'orderQty', type: 'text', visible: false },
    // { label: 'Labels', property: 'labels', type: 'button', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 50;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<AllOrders> | null;
  selection = new SelectionModel<AllOrders>(true, []);
  searchCtrl = new FormControl();

  showCreateButton = true;
  componentTableTitle = 'Orders';

  labels = aioTableLabels;

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

  icShare = icShare;
  icDownload = icDownload;
  theme = theme;
  ordersData: any;
  customerId: any;
  branchid: any;
  getCustomer: any;
  getCustomerName: any;
  getShipLocation: any;
  getShipLocatioName: any;
  products: any = [];
  varitions: any = [];
  veriations: any = [];
  veriationsName: any = '';
  varitionsObj: any = [];
  oderDataNo: any;
  PiNo: any;
  allStatus: any = [];
  ordersCountObj: any = {};
  productsArray: any = [];
  packingSpecificationsProperties: any = [];
  cartonSpecificationProperties: any = [];
  currency: any;
  getVariation: any;
  staticPackingMaterials: any = [];
  
  shippingLocationsData: any = [];

  @Input() showCtnGrid: Boolean;
  @Input() title: String;
  @Input() tableTitle;
  // showCtnGrid: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filterForm = new FormGroup({
    fromOrderDate: new FormControl(),
    toOrderDate: new FormControl(),
    fromShipmentDate: new FormControl(),
    toShipmentDate: new FormControl(),
    customer: new FormControl(),
    statuses: new FormControl(),
    sizes: new FormControl(),
    shippingLocations: new FormControl(),
  });


  get fromOrderDate() { return this.filterForm.get('fromOrderDate'); }
  get toOrderDate() { return this.filterForm.get('toOrderDate'); }
  get fromShipmentDate() { return this.filterForm.get('fromShipmentDate'); }
  get toShipmentDate() { return this.filterForm.get('toShipmentDate'); }
  get statuses() { return this.filterForm.get('statuses'); }
  get customer() { return this.filterForm.get('customer'); }
  get sizes() { return this.filterForm.get('sizes'); }
  get shippingLocations() { return this.filterForm.get('shippingLocations'); }

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private alertService: AlertService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar,
    private _decimalPipe: DecimalPipe
  ) {
    this.titleService.setTitle("Order");
    this.customerId = this.route.snapshot.paramMap.get('cId');
    this.branchid = this.route.snapshot.paramMap.get('branchId');
    
    
  }


  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {
    return of(this.ordersData.map(customer => new AllOrders(customer)));
  }

  ngOnInit() {
    if (this.currentPage !== 'dashboard') {
      this.getOrdersCount();
    }

    if (this.currentPage === 'dashboard') {
      this.columns = this.columns.map(c => {
        const obj:any = {
          ...c
        };
        if (c.property === 'proformaInvoiceNo') {
          obj.visible = true;
        } else if (c.property === 'customerName') {
          obj.visible = true;
        } else if (c.property === 'shipmentDate') {
          obj.visible = true;
        } else if (c.property === 'orderQty') {
          obj.visible = true;
        } else {
          obj.visible = false;
        }
        return obj;
      });
      this.pageSize = 6;
      this.showCreateButton = false;
      this.componentTableTitle = this.tableTitle;
    }
    this.allOrderFetch();
    this.getPropertyTypes();
    this.getCurrency();
    this.getVaraition();
    this.getStaticPackingMaterials();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadOrders();
  }
  
  loadOrders() {
    if (this.status) {
      this.getOrders();
    }
  }
  allOrderFetch() {

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<AllOrders[]>(Boolean)
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
    this.router.navigate(['/create-order']);

    return;
    this.dialog.open(OpenOrderCreateUpdateComponent).afterClosed().subscribe((customer: AllOrders) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customers.unshift(new AllOrders(customer));
        this.subject$.next(this.customers);
      }
    });
  }

  goToPage(tab, index) {
    this.router.navigate(['/order-view/all', { tab, index }]);
  }

  goToEditOrder(customer: AllOrders) {
    this.router.navigate(['/edit-order', { orderId: customer.id }]);
    return;
    this.dialog.open(OpenOrderCreateUpdateComponent, {
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
        this.customers[index] = new AllOrders(updatedCustomer);
        //  console.log(this.customers);
        this.subject$.next(this.customers);
      }
    });
  }

  deleteOrder(order: AllOrders) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    if (confirm('Do you want to delete this order?')) {

    this.orderService
      .deleteOrder(order.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
           // this.getCustomer = data;
            this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === order.id), 1);
            this.selection.deselect(order);
            this.subject$.next(this.customers);
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
    }

  }

  deleteCustomers(customers: AllOrders[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteOrder(c));
    }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.filter = value.trim().toLowerCase();
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

  onLabelChange(change: MatSelectChange, row: AllOrders) {
    const index = this.customers.findIndex(c => c === row);
    this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  ngOnDestroy() {
  }

  selectMethod(event: MatSelectChange, controlName: any, state: any) {
    if (event.source.selected) {
      //console.log('You selected: ', state);
      this.filterForm.controls[controlName].setValue(state);
      return true;


    }
    return true;
  }




  setActiveMode(event) {
    console.log('in order table');
    console.log(event);
    this.changeMode.emit(event)
  }
  async  getOrders() {

    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.orderService
      .getAllOrders()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            let ordersData:any = data;
            ordersData = _.map(ordersData, (d:any) => {
              const orderProductsQuantity = d.orderProducts ? _.compact(_.pluck(d.orderProducts, 'quantity')) : [];
              const orderProductsQuantityPacked = d.orderProducts ? _.compact(_.pluck(d.orderProducts, 'quantityPacked')) : [];
              const quantitySum = orderProductsQuantity.reduce(function(a, b){
                  return a + b;
              }, 0);
              const quantityPackedSum = orderProductsQuantityPacked.reduce(function(a, b){
                  return a + b;
              }, 0);
              return {
                ...d,
                customerName: d.customer ? d.customer.name : '',
                packingProgress: {
                  totalQuantity: quantitySum,
                  totalQuantityPacked: quantityPackedSum
                }
              };
            });

            this.allStatus = _.sortBy(_.unique(_.compact(_.pluck(ordersData, 'status'))));

            this.ordersData = ordersData;
            if (this.status) {

              if (this.branchid) {
                console.log('in branch--------------')
                if (this.status == 'all-orders') {
                  this.ordersData = this.ordersData.filter(elm => elm.customerBranchId == this.branchid);
                } else {
                  this.ordersData = this.ordersData.filter(elm => {
                    if (this.status === Utils.status().InProgress && elm.customerBranchId == this.branchid && (elm.status === Utils.status().InProgress || elm.status === Utils.status().ReadyForShipment)) {
                      return true;
                    } if (this.status === Utils.status().Shipped && elm.customerBranchId == this.branchid && (elm.status === Utils.status().Shipped)) {
                      return true;
                    } else {
                      return elm.status == this.status && elm.customerBranchId == this.branchid;
                    }
                  });
                }

              }
              else if (this.customerId) {
                console.log('in customer--------------')
                if (this.status == 'all-orders') {
                  this.ordersData = this.ordersData.filter(elm => elm.customerId == this.customerId);
                } else {
                  this.ordersData = this.ordersData.filter(elm => {
                    if (this.status === Utils.status().InProgress && elm.customerId == this.customerId && (elm.status === Utils.status().InProgress || elm.status === Utils.status().ReadyForShipment)) {
                      return true;
                    } if (this.status === Utils.status().Shipped && elm.customerId == this.customerId && (elm.status === Utils.status().Shipped)) {
                      return true;
                    } else {
                      return elm.status == this.status && elm.customerId == this.customerId;
                    }
                  });
                }

              } else {
                console.log('nothin find id--------------')
                if (this.status == 'all-orders') {
                  this.ordersData = this.ordersData;
                } else {
                  this.ordersData =  this.ordersData.filter(elm => {
                    if (this.status === Utils.status().InProgress && (elm.status === Utils.status().InProgress || elm.status === Utils.status().ReadyForShipment)) {
                      return true;
                    } if (this.status === Utils.status().Shipped && (elm.status === Utils.status().Shipped)) {
                      return true;
                    } else {
                      //console.log(' in 3', elm.status.toLowerCase(), this.status)
                      return elm.status === this.status;
                    }
                  });
                }

              }

            }
            this.loadCompanyData();
          } else {
            this.ordersData = [];
            this.loadCompanyData();
          }
          this.getAllCustomers();// get All customer
          this.getShippingLocationCountry(); // get All shipping Location

        },
        err => {

          this.alertService.error(err);
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
  getAllCustomers() {

    this.customerService
      .getCustomer()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            let cus:any = data;
            cus = cus.map(c => {
              return {
                ...c,
                name: c.name.trim()
              };
            });
            this.getCustomer = _.sortBy(cus, 'name');
          }
        },
        err => {
          console.log(err);
        }
      );

  }

  getShippingLocationCountry() {

    return this.commonService.getCountries((data: any) => {
      this.getShipLocation = data;
     
    }, (error: any) => {
      console.log('get countries:', error)
    });

  }
  getShippingLocationName(row:any ) {
    const getShipLocation = this.getShipLocation;
    const shippingLocation = row && row.shippingLocation && row.shippingLocation ? row.shippingLocation : '';
    let country:any = '' ;
    if (getShipLocation) {
      country = this.getCountryName(shippingLocation.countryId);
    }
    return (shippingLocation ? shippingLocation.name : '') + ', ' +(country && country.name ? country.name : '');
  }

  getCountryName(countryId) {
    const getShipLocation = this.getShipLocation;
    const country = getShipLocation.find(c => c.id == countryId);
    return country;
  }
  
  
  ordersDetails(id?: number) {
    this.router.navigate(['/order-details', { orderId: id }]);
  }
  getPiId(cId?: number) {
    this.oderDataNo = this.ordersData.filter(elm => elm.customerId == cId);

    const shippingLocationsData = _.compact(_.pluck(this.ordersData, 'shippingLocation'));
    let filteredShipping = _.unique(shippingLocationsData.filter(s => s.customerId == cId), 'id');
    this.shippingLocationsData = filteredShipping;
    console.log('order *****', shippingLocationsData, '>>', filteredShipping)

  }

  getVariationById(pId?: number) {
    const variationArray: any = [];
    return this.productService
      .getProductById(pId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.varitions = data;
          //    this.varitions = this.varitions['productVariations'].filter(elm => elm.productId == pId);

          this.varitions = this.products.find(elm => elm.id == pId);

          if (this.varitions) {

            this.varitions.productVariations.forEach(veration => {

              let obj = {
                "id": veration.id ? veration.id : '',
                "priority": veration.priority ? veration.priority : '',
                "productId": veration.productId ? veration.productId : '',
                "name": veration.variationId ? this.getSizeName(veration.variationId) : '',
                "variation": veration.variation ? veration.variation : '',
                "unitId": veration.unitId ? veration.unitId : '',
                "unit": veration.unit ? veration.unit : '',
                "productProperties": veration.productProperties ? veration.productProperties : []
              }
              //   this.varitions = this.veriations.find(elm => elm.id == veration.variationId);

              variationArray.push(obj);

            });
          }


          this.varitionsObj = variationArray;
        }
      });
  }
  getSizesVariations() {
    return this.commonService
      .getSizesVariations(
        data => {
          if (data) {
            this.veriations = data;
          }
        });
  }
  getSizeName(variationNameid?: number) {

    this.veriationsName = this.veriations.find(elm => elm.id == variationNameid);
    return this.veriationsName = this.veriationsName.name ? this.veriationsName.name : '';
  }
  parseDate(str?: any) {
    var mdy = str.split('/');
   
    if(mdy){
      return new Date(mdy[2], mdy[0] - 1, mdy[1]);
    }
   
  }

  datediff(first?: any, second?: any) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }
  getRemaingDays(first?: any, second?: any) {
      // const ff = moment(first);
      const ff = moment(new Date());
      const ss = moment(second);
      // let diff = moment.duration(ss.diff(ff)).humanize(); // 'a month'
      let diff:any = ss.diff(ff, 'days');
      if (diff > 0) {
        diff = moment.duration(ss.diff(ff)).humanize(); // 'a month'
        if (diff == 'a day') {
          diff = '1 day';
        } else if (diff == 'a few seconds') {
          diff = '0 day';
        } 
      } else {
        diff = diff + ' days';
      }

      return diff;
  }
 


  clearFormValue() {
    this.filterForm.setValue({
      fromOrderDate: '',
      toOrderDate: '',
      fromShipmentDate: '',
      toShipmentDate: '',
      customer: '',
      statuses: '',
      sizes: '',
      shippingLocations: ''
    });
    // api
    this.dataSource.data = this.customers;
  }

  getCurrency() {
    return this.customerService
      .getCurrency()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.currency = data;
        }
      });
  }
  getCurrencyName(cId) {
    let currencyObj: any = '';
    if (!_.isEmpty(this.currency)) {
      currencyObj = this.currency.find(f => f.id === cId);
    }
    return currencyObj ? currencyObj.name : '';
  }

  filterOrders(value?: any) {
    this.dataSource.data = this.ordersData;
    // getting date from calendar
    const customer = value.customer;
    const status = value.statuses;

    const fromOrderDate = value.fromOrderDate;
    const toOrderDate = value.toOrderDate ;
    const fromShipmentDate = value.fromShipmentDate;
    const toShipmentDate = value.toShipmentDate ;
    const shippingLocations = value.shippingLocations ;
   
   
    

    const format = 'MMM d yyyy';
    const locale = 'en-US';
    this.dataSource.data = this.dataSource.data.filter(e => {
    
      let fromCustomerCheck = true,
        statusCheck = true,
        poCheck = true,
        piCheck = true,
        orderDateCheck = true,
        isShippingLocations = true,
        shipmentDateCheck = true;

      if (customer) {
        fromCustomerCheck = e.customerId == customer;
      }

      if (shippingLocations) {
        isShippingLocations = e.shippingLocationId == shippingLocations;
      }

      if (status) {
        statusCheck = e.status == status;
      }      

      if (fromOrderDate && toOrderDate) {
        const d1 = formatDate(e.proformaInvoiceDate, format, locale);
        const d2 = formatDate(fromOrderDate, format, locale);
        const d3 = formatDate(toOrderDate, format, locale);
        const d11 = Date.parse(d1);
        const d22 = Date.parse(d2);
        const d33 = Date.parse(d3);
        orderDateCheck = d11 >= d22 && d11 <= d33;
      }

      if (fromShipmentDate && toShipmentDate) { 
        const d4 = formatDate(e.shipmentDate, format, locale);
        const d5 = formatDate(fromShipmentDate, format, locale);
        const d6 = formatDate(toShipmentDate, format, locale);
        const d44 = Date.parse(d4);
        const d55 = Date.parse(d5);
        const d66 = Date.parse(d6);
        shipmentDateCheck = d44 >= d55 && d44 <= d66;
      }
  
      return fromCustomerCheck
        && statusCheck
        && poCheck
        && piCheck
        && orderDateCheck
        && shipmentDateCheck
        && isShippingLocations
      }).sort(  );
      console.log(
        customer,
        status,
    //    formatDate(fromOrderDate, format, locale) ,
   //    formatDate(toOrderDate, format, locale),
    //    formatDate(fromShipmentDate, format, locale),
    //    formatDate(toShipmentDate, format, locale)
      
      );     
  
  }

  getOrdersCount() {
    this.orderService
      .getOrderCounts()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data >>', data)
          this.ordersCountObj = data;
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  dateFormate(date) {
    return this.datePipe.transform(date, Utils.getDateFormate());
  }

  totalPackedPercentage(packedQuantity, totalQuantity) {
    let q:any = (((packedQuantity ? parseInt(packedQuantity) : 0) * 100) / (totalQuantity ? parseInt(totalQuantity) : 0)).toFixed(2);
    if (q == 'NaN') {
      q = 0;
    }
    return q;
  }

  getSumOfQuantity(products, name) {
    const qtyArray = products ? _.compact(_.pluck(products, name)) : [];
    const quantitySum = qtyArray.reduce(function(a, b){
        return a + b;
    }, 0);
    return quantitySum;
  }  

  getBalance(product) {
    const quantity = product && product.quantity ? product.quantity : 0;
    const quantityShipped = product && product.quantityShipped ? product.quantityShipped : 0;
    return parseInt(quantity) -  parseInt(quantityShipped);
  }

  getVaraition() {
    this.commonService
      .getSizesVariations(
        data => {
          if (data) {
            this.getVariation = data;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  getStaticPackingMaterials() {
    return this.commonService
      .getStaticPackingMaterials(
        data => {
          if (data) {
            this.staticPackingMaterials = data;
          }
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
  }

  getExport() {
    let ordersDataArray = [];
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      ordersDataArray = this.selection.selected;
    }

    const orderProducts = _.flatten(_.compact(_.pluck(ordersDataArray, 'orderProducts')));
    let productIds = [];
    if (!_.isEmpty(orderProducts) && orderProducts.length > 0) {
      productIds = _.unique(_.pluck(orderProducts, 'productId'));
    }
    this.getAllProducts(productIds, (data) => {
      this.productsArray = data;
      const ordersData = this.setCartonsPieces(ordersDataArray);
      this.csvExport(ordersData);
    }, (err) => {
      this.alertService.error(err);
    });
  }

  getAllProducts(productIds, successCallBack, errorCallback) {
    this.productService
      .getProductsByIds(productIds)
      .pipe(first())
      .subscribe(
        data => {          
          successCallBack(data);          
        },
        err => {
          errorCallback(err);
        }
    );
  }

  filtersAllProducts(allProducts?: any) {
    const setArray: any = [];
    if (allProducts) {
      allProducts.forEach((product) => {
        const selectedProduct = this.productsArray.find(elm => elm.id == product.productId);
        const obj = {
          ...product,
          productCode: selectedProduct.code ? selectedProduct.code : '',
          productBrand: selectedProduct.customerBrand ? selectedProduct.customerBrand : '', 
        };
        if (selectedProduct.productVariations) {
          obj.productName = selectedProduct.name;
          const productVariant = selectedProduct.productVariations.find(f => f.id === product.productVariationId);
          if (productVariant){
            const variantName = this.getVariation.find(f => f.id === productVariant.variationId);
            if (variantName) {
              obj.variantName = variantName.name;
            }
          }
        }
        setArray.push(obj);
      });
    }
    return setArray;
  }
  
  getCsvPackingMaterials() {
    let ordersDataArray = [];
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      ordersDataArray = this.selection.selected;
    }
    let orderProducts = _.flatten(_.compact(_.pluck(ordersDataArray, 'orderProducts')));
    let productIds = [];
    if (!_.isEmpty(orderProducts) && orderProducts.length > 0) {
      productIds = _.unique(_.pluck(orderProducts, 'productId'));
    }
    this.getAllProducts(productIds, (data) => {
      this.productsArray = data;
      const packingMaterialOrdersArray = this.setCartonsPiecesForPackingMaterials(ordersDataArray);
      const ordersData = this.setCartonsPieces(ordersDataArray);
      const allOrderProducts = _.flatten(_.compact(_.pluck(ordersData, 'orderProducts')));
      const variationIds = _.sortBy(_.unique(_.compact(_.pluck(allOrderProducts, 'variationId'))));
      
      this.packingMaterialCsvExport(packingMaterialOrdersArray, orderProducts, variationIds)
    }, (err) => {
      this.alertService.error(err);
    });    
  }

  setCartonsPiecesForPackingMaterials(ordersDataArray) {
    const dataOrdersDataArray = _.clone(ordersDataArray);
    if (dataOrdersDataArray && dataOrdersDataArray.length > 0) {
      dataOrdersDataArray.forEach(singleOrder => {
        if (singleOrder.packingMaterials) {
          const orderProducts = singleOrder.packingMaterials.products ? singleOrder.packingMaterials.products : [];
          //let piecesOfProductsArray:any = [];
          let totalCartons:any = 0;
          let totalPieces:any = 0;
          let totalVolume:any = 0;
          let totalWeight:any = 0;

          if (orderProducts.length > 0) {
            orderProducts.forEach((o, i) => {
              const product = this.productsArray.find(p => p.id === o.productId);
              const productVariations = product && product.productVariations ? product.productVariations : [];
              const productProperties = product && product.productProperties ? product.productProperties : [];
      
              const vData = productVariations.find(v => v.id === o.productVariationId);
              if (vData) {
                const variation = this.getVariation.find(v => v.id === vData.variationId);
                o.variationId = variation.id;
                o.variationName = variation.name;
              }
              let packingSpecData:any = [];
              let cartonSpecData:any = [];
              if (!_.isEmpty(productProperties)) {
                productProperties.forEach(pp => {
                  this.packingSpecificationsProperties.forEach(f => {
                    if (f.id === pp.propertyId) {
                      packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
                    }
                  });
                  this.cartonSpecificationProperties.forEach(f => {
                    if (f.id === pp.propertyId) {
                      cartonSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
                    }
                  });
                  
                });
              }
      
              if (packingSpecData && packingSpecData.length > 0) {
                packingSpecData.forEach(f => {
                  
                  if ((f && f.data && f.data.value && vData) && (parseInt(f.data.value) === parseInt(vData.variationId))) {
                    const quantityPacked = o.quantityPacked ? parseInt(o.quantityPacked) : 0;
                    const quantityShipped = o.quantityShipped ? parseInt(o.quantityShipped) : 0;
                    const totalPiecesCount = (o.quantity ? parseInt(o.quantity) : 0) * parseInt(f.pcsCarton ? f.pcsCarton : 0);              
                    o.piecesPerCarton = parseInt(f.pcsCarton ? f.pcsCarton : 0);
                    o.piecesOfAllCartons = totalPiecesCount;
                    o.piecesOfPackedCartons = parseInt(f.pcsCarton ? f.pcsCarton : 0) * quantityPacked;
                    o.piecesOfShippedCartons = parseInt(f.pcsCarton ? f.pcsCarton : 0) * quantityShipped;
      
                    totalCartons = totalCartons + parseInt(o.quantity);
                    totalPieces = totalPieces + totalPiecesCount;
      
                  }
                });
              }
              o.totalCartons = totalCartons;
              o.totalPieces = totalPieces;
              if (cartonSpecData && cartonSpecData.length > 0) {
                cartonSpecData.forEach(f => {
      
                  if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {              
      
                    totalVolume = ((f.volume && f.volume ? parseFloat(f.volume) : 0) * parseInt(o.quantity));
                    totalWeight = ((f.weight && f.weight ? parseFloat(f.weight) : 0) * parseInt(o.quantity) );
                  }
                });
              }
              o.totalVolume = totalVolume;
              o.totalWeight = totalWeight;
      
            });
            singleOrder.products = orderProducts;
          }
        }
      });
    }
    return dataOrdersDataArray;    
  }

  setCartonsPieces(ordersDataArray) {
    const ordersData = ordersDataArray;

    ordersData.forEach((singleOrder) => {
      const orderProducts = singleOrder ? singleOrder.orderProducts : [];
      //let piecesOfProductsArray:any = [];
      let totalCartons:any = 0;
      let totalPieces:any = 0;
      let totalVolume:any = 0;
      let totalWeight:any = 0;

      orderProducts.forEach((o, i) => {
        const product = this.productsArray.find(p => p.id === o.productId);
        const productVariations = product && product.productVariations ? product.productVariations : [];
        const productProperties = product && product.productProperties ? product.productProperties : [];

        const vData = productVariations.find(v => v.id === o.productVariationId);
        if (vData) {
          const variation = this.getVariation.find(v => v.id === vData.variationId);
          o.variationId = variation.id;
          o.variationName = variation.name;
        }

        let packingSpecData:any = [];
        let cartonSpecData:any = [];
        if (!_.isEmpty(productProperties)) {
          productProperties.forEach(pp => {
            this.packingSpecificationsProperties.forEach(f => {
              if (f.id === pp.propertyId) {
                packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
              }
            });
            this.cartonSpecificationProperties.forEach(f => {
              if (f.id === pp.propertyId) {
                cartonSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
              }
            });
            
          });
        }

        if (packingSpecData && packingSpecData.length > 0) {
          packingSpecData.forEach(f => {
            
            if ((f && f.data && f.data.value && vData) && (parseInt(f.data.value) === parseInt(vData.variationId))) {
              const quantityPacked = o.quantityPacked ? parseInt(o.quantityPacked) : 0;
              const quantityShipped = o.quantityShipped ? parseInt(o.quantityShipped) : 0;
              const totalPiecesCount = parseInt(o.quantity) * parseInt(f.pcsCarton ? f.pcsCarton : 0);
              o.piecesPerCarton = parseInt(f.pcsCarton ? f.pcsCarton : 0);
              o.piecesOfAllCartons = totalPiecesCount;
              o.piecesOfPackedCartons = quantityPacked * parseInt(f.pcsCarton ? f.pcsCarton : 0) ;
              o.piecesOfShippedCartons = quantityShipped * parseInt(f.pcsCarton ? f.pcsCarton : 0);
              o.totalValue = parseInt(o.quantity) * parseFloat(o.unitPrice);

              totalCartons = totalCartons + parseInt(o.quantity);
              totalPieces = totalPieces + totalPiecesCount;
            }
          });
        }
        o.totalCartons = totalCartons;
        o.totalPieces = totalPieces;
        if (cartonSpecData && cartonSpecData.length > 0) {
          cartonSpecData.forEach(f => {

            if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {              

              totalVolume = ((f.volume && f.volume ? parseFloat(f.volume) : 0) * parseInt(o.quantity));
              totalWeight = ((f.weight && f.weight ? parseFloat(f.weight) : 0) * parseInt(o.quantity) );
            }
          });
        }
        o.totalVolume = totalVolume;
        o.totalWeight = totalWeight;

      });

    });
    return ordersData;    
  }

  async getPropertyTypes() {
    return this.commonService
      .getPropertyTypes(
        data => {
          this.setPropertiesTypes(data);
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  setPropertiesTypes(data) {
    if (data) {
      let getData: any = data;

      // this.sizeSpecificationProperties = getData.find(elm => elm.name === "Size Specification");
      // this.sizeSpecificationProperties = this.sizeSpecificationProperties['properties'] ? this.sizeSpecificationProperties['properties'] : [];

      this.cartonSpecificationProperties = getData.find(elm => elm.name === "Carton Specification");
      this.cartonSpecificationProperties = this.cartonSpecificationProperties['properties'] ? this.cartonSpecificationProperties['properties'] : [];
      
      this.packingSpecificationsProperties = getData.find(elm => elm.name === "Packing Specifications");
      this.packingSpecificationsProperties = this.packingSpecificationsProperties['properties'] ? this.packingSpecificationsProperties['properties'] : [];
      

    } else {
      // this.sizeSpecificationProperties = [];
      this.cartonSpecificationProperties = [];
      this.packingSpecificationsProperties = [];
    }
  }  

  csvExport(ordersData) {
    const setCsvJson = this.setCsvJson(ordersData);
    let data = [
      {
        'a': 'Invoice Details',
        'b': '',
        'c': '',
        'd': '',
        'e': '',
        'f': '',
        'g': '',
        'h': '',
        'i': '',
        'j': '',
        'k': '',
        'l': 'Order Summary',
        'm': '',
        'n': '',
        'o': '',
        'p': '',
        'q': '',
        'r': '',
        's': '',
        't': 'Progress (Cartons)',
        'u': '',
        'v': '',
        'w': '',
        'x': 'Progress (Pieces)',
        'y': '',
        'z': '',	
        'aa': '',	
        'ab': 'Additional Information',	
        'ac': '', 	
        'ad': '',
        'ae': '',	
        'af': '',
        'ag': ''
      },
      {
        'a': 'PI Number',
        'b': 'PI Date',
        'c': 'Shipment Date',
        'd': 'PO Number',
        'e': 'PO Date',
        'f': 'Customer',
        'g': 'Branch',
        'h': 'Ship To',
        'i': 'Country',
        'j': 'Ship From',
        'k': 'Ship By',
        'l': 'Total Cartons',
        'm': 'Total Pieces',
        'n': 'Total Volume (m3)',
        'o': 'Gross Weight (kgs)',
        'p': 'Total Value',
        'q': 'Currency',
        'r': 'Payment Status',
        's': 'Order Status',
        't': 'Order Qty',		
        'u': 'Packed Qty', 	
        'v': 'Shipped Qty',
        'w': 'Balance Qty',
        'x': 'Order Qty',
        'y': 'Packed Qty',
        'z': 'Shipped Qty',	
        'aa': 'Balance Qty',	
        'ab': 'Contact Person',	
        'ac': 'Contact Details', 	
        'ad': 'Delivery Terms',
        'ae': 'Origin of Goods',	
        'af': 'Transhipment',
        'ag': 'Type'
      },
      {
        'a': '-',
        'b': '-',
        'c': '-',
        'd': '-',
        'e': '-',
        'f': '-',
        'g': '-',
        'h': '-',
        'i': '-',
        'j': '-',
        'k': '-',

        'l': this._decimalPipe.transform(setCsvJson.totalCartons,"1.0-2"),
        'm': this._decimalPipe.transform(setCsvJson.totalPieces,"1.0-2"),
        'n': this._decimalPipe.transform(setCsvJson.totalVolume,"1.2-2"),
        'o': this._decimalPipe.transform(setCsvJson.totalGrossWeight,"1.2-2"),
        'p': this._decimalPipe.transform(setCsvJson.totalValue,"1.2-2"),
        'q': '-',
        'r': '-',
        's': '-',

        't': this._decimalPipe.transform(setCsvJson.totalCartons,"1.0-2"),
        'u': this._decimalPipe.transform(setCsvJson.totalCartonsPackedQty,"1.0-2"),
        'v': this._decimalPipe.transform(setCsvJson.totalCartonsShippedQty,"1.0-2"),
        'w': this._decimalPipe.transform(setCsvJson.totalCartonsBalanceQty,"1.0-2"),
        
        'x': this._decimalPipe.transform(setCsvJson.totalPieces,"1.0-2"),
        'y': this._decimalPipe.transform(setCsvJson.totalPiecesPackedQty,"1.0-2"),
        'z': this._decimalPipe.transform(setCsvJson.totalPiecesShippedQty,"1.0-2"),	
        'aa': this._decimalPipe.transform(setCsvJson.totalPiecesBalanceQty,"1.0-2"),
        
        'ab': '-',	
        'ac': '-', 	
        'ad': '-',
        'ae': '-',	
        'af': '-',
        'ag': '-'
      },
      
    ];
    
    data = data.concat(setCsvJson.csv);
    
      const options = { 
        filename: 'OMS_OrderProgress',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: false, 
        showTitle: false,
        title: '',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        //headers: ["First Name", "Last Name", "ID"]
      };
     
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(data);
  }

  setCsvJson(ordersData) {
    //const ordersData = this.ordersData;
    const arr = [];
    let totalCartons = 0;
    let totalPieces = 0;
    let totalVolume = 0;
    let totalGrossWeight = 0;
    let totalValue = 0;
    let totalCartonsPackedQty = 0;
    let totalCartonsShippedQty = 0;
    let totalCartonsBalanceQty = 0;
    let totalPiecesPackedQty = 0;
    let totalPiecesShippedQty = 0;
    let totalPiecesBalanceQty = 0;


    ordersData.forEach((order, i) => {
      const originOfGoods = order.originOfGoods && this.getCountryName(order.originOfGoods) ? this.getCountryName(order.originOfGoods).name :'';
      const fromPort = order.fromPort ? order.fromPort : '';
      const shipFrom = fromPort +','+ originOfGoods;
      const orderProducts = order.orderProducts ? order.orderProducts : [];
      const quantitySum = this.getSumOfQuantity(orderProducts, 'quantity');
      const quantityPackedSum = this.getSumOfQuantity(orderProducts, 'quantityPacked');
      const quantityShippedSum = this.getSumOfQuantity(orderProducts, 'quantityShipped');
      const piecesOfAllCartonsSum = this.getSumOfQuantity(orderProducts, 'piecesOfAllCartons');
      const piecesOfPackedCartonsSum = this.getSumOfQuantity(orderProducts, 'piecesOfPackedCartons');
      const piecesOfShippedCartonsSum = this.getSumOfQuantity(orderProducts, 'piecesOfShippedCartons');
      const totalVolumeSum = parseFloat(this.getSumOfQuantity(orderProducts, 'totalVolume')).toFixed(2);
      const totalWeightSum = parseFloat(this.getSumOfQuantity(orderProducts, 'totalWeight')).toFixed(2);
      const totalValueSum = parseFloat(this.getSumOfQuantity(orderProducts, 'totalValue')).toFixed(2);
      
      const cartonsPackedBalance = parseInt(quantitySum, 10) - parseInt(quantityPackedSum, 10);
      const piecesPackedBalance = parseInt(piecesOfAllCartonsSum, 10) - parseInt(piecesOfPackedCartonsSum, 10);

      totalCartons += parseInt(quantitySum, 10);
      totalPieces += parseInt(piecesOfAllCartonsSum, 10);
      totalVolume += parseFloat(totalVolumeSum);
      totalGrossWeight += parseFloat(totalWeightSum);
      totalValue += parseFloat(totalValueSum);
      totalCartonsPackedQty += parseInt(quantityPackedSum, 10);
      totalCartonsShippedQty += parseInt(quantityShippedSum, 10);
      totalCartonsBalanceQty += cartonsPackedBalance;
      totalPiecesPackedQty += parseFloat(piecesOfPackedCartonsSum);
      totalPiecesShippedQty += parseFloat(piecesOfShippedCartonsSum);
      totalPiecesBalanceQty += piecesPackedBalance;

      const obj = {
        'a': order.proformaInvoiceNo,
        'b': order.proformaInvoiceDate ? this.dateFormate(order.proformaInvoiceDate) : '',
        'c': order.shipmentDate ? this.dateFormate(order.shipmentDate) : '',
        'd': order.orderNo,
        'e': order.orderDate ? this.dateFormate(order.orderDate) : '',
        'f': order.customer ? order.customer.name : '',
        'g': order.customerBranch ? order.customerBranch.name : '',
        'h': order.shippingLocation ? order.shippingLocation.name : '',
        'i': this.getCountryName(order.countryId) ? this.getCountryName(order.countryId).name :'',
        'j': shipFrom ,
        'k': order.shipBy ? order.shipBy : '',
        
        'l': this._decimalPipe.transform(quantitySum,"1.0-2"),
        'm': this._decimalPipe.transform(piecesOfAllCartonsSum,"1.0-2"),
        'n': this._decimalPipe.transform(parseFloat(totalVolumeSum).toFixed(2),"1.2-2"),
        'o': this._decimalPipe.transform(parseFloat(totalWeightSum).toFixed(2),"1.2-2"),
        'p': this._decimalPipe.transform(parseFloat(totalValueSum).toFixed(2),"1.2-2"),
        'q': this.getCurrencyName(order.currencyId),
        'r': '-',
        's': Utils.getStatusName(order.status),

        't': this._decimalPipe.transform(quantitySum,"1.0-2"),
        'u': this._decimalPipe.transform(quantityPackedSum,"1.0-2"),
        'v': this._decimalPipe.transform(quantityShippedSum,"1.0-2"),
        'w': this._decimalPipe.transform(cartonsPackedBalance,"1.0-2"),

        'x': this._decimalPipe.transform(piecesOfAllCartonsSum,"1.0-2"),
        'y': this._decimalPipe.transform(piecesOfPackedCartonsSum,"1.0-2"),
        'z': this._decimalPipe.transform(piecesOfShippedCartonsSum,"1.0-2"),
        'aa': this._decimalPipe.transform(piecesPackedBalance,"1.0-2"),

        'ab': order.customerContact ? order.customerContact.name : '',	
        'ac': order.contactDetails && order.contactDetails !== null ? "'"+order.contactDetails : '',
        'ad': order.shippingLocation ? order.shippingLocation.deliveryTerms : '',
        'ae': originOfGoods,	
        'af': order.isTranshipmentAllowed ? 'Allowed' : 'Not Allowed',
        'ag': order.shippingType ? order.shippingType : ''
      };
      arr.push(obj);
    });

    return {
      csv: arr,
      totalCartons,
      totalPieces,
      totalVolume,
      totalGrossWeight,
      totalValue,
      totalCartonsPackedQty,
      totalCartonsShippedQty,
      totalCartonsBalanceQty,
      totalPiecesPackedQty,
      totalPiecesShippedQty,
      totalPiecesBalanceQty,
    }
  }

  packingMaterialCsvExport(packingMaterialOrdersArray, orderProducts, variationIds) {
    const setCsvJson = this.setPackingMaterialCsvJson(packingMaterialOrdersArray, variationIds);
    const topHeading = ['', '', '', '', '', ''];
    const titles = [
      'Product Name',
      'Packing Material',
      'PI Number',
      'PI Date',
      'Shipment Date',
      'Customer',
    ];
    const totalHeading = ['-', '-', '-', '-', '-', '-'];

    const totalQtyArray = setCsvJson.totalQtyArray;
    const variantGroup = _.groupBy(totalQtyArray, 'variationId')
    let rowTotalQty = 0;
    let rowTotalReceivedQtyy = 0;
    let rowTotalBalanceQty = 0;
    if (packingMaterialOrdersArray && packingMaterialOrdersArray.length > 0) {
      if (variationIds && variationIds.length > 0) {
        variationIds.forEach((v) => {
          const vData = this.getVariation.find(variant => variant.id === v);
          const variant = variantGroup[v];
          let orderQty = 0;
          let receivedQty = 0;
          let balanceQty = 0;
          if (variant && variant.length > 0) {
            orderQty = this.getSumOfQuantity(variant, 'orderQty');
            receivedQty = this.getSumOfQuantity(variant, 'receivedQty');
            balanceQty = this.getSumOfQuantity(variant, 'balanceQty');
            rowTotalQty += orderQty;
            rowTotalReceivedQtyy += receivedQty;
            rowTotalBalanceQty += balanceQty;
          }
          if (vData) {
            topHeading.push(vData.name);
            topHeading.push('');
            topHeading.push(''); 
            titles.push('Order Qty');
            titles.push('Received Qty');
            titles.push('Balance Qty');
            totalHeading.push(this._decimalPipe.transform(orderQty,"1.0-2"));
            totalHeading.push(this._decimalPipe.transform(receivedQty,"1.0-2"));
            totalHeading.push(this._decimalPipe.transform(balanceQty,"1.0-2"));
          }
        });
      }
      topHeading.push('Total');
      topHeading.push('');
      topHeading.push('');
      topHeading.push('');
      titles.push('Order Qty');
      titles.push('Received Qty');
      titles.push('Balance Qty');
      titles.push('Next D/D');
      totalHeading.push(this._decimalPipe.transform(rowTotalQty,"1.0-2"));
      totalHeading.push(this._decimalPipe.transform(rowTotalReceivedQtyy,"1.0-2"));
      totalHeading.push(this._decimalPipe.transform(rowTotalBalanceQty,"1.0-2"));
      totalHeading.push('-');
    }
    
    let data = [
      topHeading,
      titles,
      totalHeading,
    ];

    data = data.concat(setCsvJson.csv);
      const options = { 
        filename: 'OMS_PackingMaterials',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: false, 
        showTitle: false,
        title: '',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        //headers: ["First Name", "Last Name", "ID"]
      };
     
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(data);
  }

  setPackingMaterialCsvJson(packingMaterialOrdersArray, variationIds) {
    const arr = [];
    let totalQtyArray = [];
    if (packingMaterialOrdersArray && packingMaterialOrdersArray.length > 0) {
      packingMaterialOrdersArray.forEach(singleOrder => {
        const order:any = singleOrder;
        const packingMaterialArray = singleOrder.packingMaterials && singleOrder.packingMaterials.products ? singleOrder.packingMaterials.products : [];

        if (singleOrder.orderProducts && singleOrder.orderProducts.length > 0) {
          const groupByProduct = _.groupBy(singleOrder.orderProducts,'productId');
          const groupByProductKeys = Object.keys(groupByProduct)
          groupByProductKeys.forEach((productId, groupIndex) => { // loop group by product
            const productData:any = _.sortBy(groupByProduct[productId], 'variationId');
            
            const selectedProduct = this.productsArray.find(elm => elm.id == productId);
            const packingMaterialId = selectedProduct && selectedProduct.packingMaterialId ? selectedProduct.packingMaterialId : '';
            const seletedMaterial = this.staticPackingMaterials.find(p => p.id == packingMaterialId);
            const packingMaterialName = seletedMaterial ? seletedMaterial.name : '';
            const firstArry = [
              selectedProduct ? selectedProduct.name : '',
              packingMaterialName,
              order.proformaInvoiceNo ? order.proformaInvoiceNo : '',
              order.proformaInvoiceDate ? this.dateFormate(order.proformaInvoiceDate) : '',
              order.shipmentDate ? this.dateFormate(order.shipmentDate) : '',
              order.customer ? order.customer.name : '',
            ];
            
            let rowOrderQty = 0;
            let rowReceivedQty = 0;
            let rowBalanceQty = 0;
            let nextDeliveryDate = '';

            let orderDataArray = [];
            const productVariantsArray = [];
            variationIds.forEach(vId => {
              const productVariationFound = productData.find(singleProduct => singleProduct.variationId === vId);

              if (productVariationFound) {
                const isFoundPackingMaterial = packingMaterialArray ? packingMaterialArray.find(pma => pma.productId === productVariationFound.productId && pma.productVariationId === productVariationFound.productVariationId) : '';
                  if (isFoundPackingMaterial && isFoundPackingMaterial.variationId === vId) {
                    const product = isFoundPackingMaterial;
                      if (!nextDeliveryDate) {
                        nextDeliveryDate = product && product.nextDeliveryDate ? this.dateFormate(product.nextDeliveryDate) : '';
                      }

                      let orderQty = parseInt(product.quantity, 10);
                      let receivedQty = parseInt(product.quantityReceived);
                      let balanceQty = orderQty - receivedQty;
                      rowOrderQty += orderQty;
                      rowReceivedQty += receivedQty;
                      rowBalanceQty += balanceQty;
                      productVariantsArray.push(orderQty);
                      productVariantsArray.push(receivedQty);
                      productVariantsArray.push(balanceQty);
                      totalQtyArray.push({
                        variationId: product.variationId,
                        variationName: product.variationName,
                        orderQty,
                        receivedQty,
                        balanceQty
                      })
                  } else { 
                    productVariantsArray.push('0');
                    productVariantsArray.push('0');
                    productVariantsArray.push('0');
                  }
                } else { // if variation not found 
                  productVariantsArray.push('0');
                  productVariantsArray.push('0');
                  productVariantsArray.push('0');
                }
            });
              
            productVariantsArray.forEach((v) => {
              firstArry.push(v);
            });

            firstArry.push(this._decimalPipe.transform(rowOrderQty,"1.0-2"));
            firstArry.push(this._decimalPipe.transform(rowReceivedQty,"1.0-2"));
            firstArry.push(this._decimalPipe.transform(rowBalanceQty,"1.0-2"));
            firstArry.push(nextDeliveryDate);        
            orderDataArray.push(firstArry);

            if (orderDataArray && orderDataArray.length > 0) {
              orderDataArray.forEach(element => {
                arr.push(element);
              });
            }
          }); // group by Product
        }
      });
    }

    return {
      csv: arr,
      totalQtyArray
    }
  }

  getCsvOrdersByProductBreakDown() {
    let ordersDataArray = [];
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      ordersDataArray = this.selection.selected;
    }
    let orderProducts = _.flatten(_.compact(_.pluck(ordersDataArray, 'orderProducts')));
    let productIds = [];
    if (!_.isEmpty(orderProducts) && orderProducts.length > 0) {
      productIds = _.unique(_.pluck(orderProducts, 'productId'));
    }
    this.getAllProducts(productIds, (data) => {
      this.productsArray = data;
      const ordersData = this.setCartonsPieces(ordersDataArray);
      this.getCsvOrdersByProductBreakDownExport(ordersData)
    }, (err) => {
      this.alertService.error(err);
    });    
  }
  getCsvOrdersByProductBreakDownExport(ordersData) {  
    const setCsvJson:any = this.setOrdersByProductBreakDownJson(ordersData);
    const topHeading = ['Product Details'];
    for(var i = 0; i < 15; i++) {
      topHeading.push('');
    }
    topHeading.push('Progress (Cartons)');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('Progress (Pieces)');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('');

    const titles = [
      'PI Number',
      'Brand',
      'Product Name',
      'Product Code',
      'Size',
      'Cartons',
      'Pieces',
      'Gross Weight (kgs)',
      'Total Volume (m3)',
      'Price / Carton',
      'Total Value',
      'Customer',
      'Ship To',
      'Shipment Date',
      'Order Status',
      'Payment Status',

      'Order Qty',
      'Packed Qty',
      'Shipped Qty',
      'Balance Qty',

      'Order Qty',
      'Packed Qty',
      'Shipped Qty',
      'Balance Qty'
    ];
  
    const totalHeading = ['-', '-', '-', '-', '-'];
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalGrossWeightSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalVolumeSum,"1.0-2"));
    totalHeading.push('-'); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalValueSum,"1.0-2"));
    
    totalHeading.push('-'); 
    totalHeading.push('-'); 
    totalHeading.push('-'); 
    totalHeading.push('-'); 
    totalHeading.push('-'); 
    
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsPackedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsshippedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsBalanceSum,"1.0-2")); 

    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesPackedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesShippedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesBalanceSum,"1.0-2")); 
    
    let data = [
      topHeading,
      titles,
      totalHeading,
    ];

    data = data.concat(setCsvJson.csv);
    const options = { 
      filename: 'OMS_OrdersByProductsBreakdown',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false, 
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      //headers: ["First Name", "Last Name", "ID"]
    };
     
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(data);
  }
  setOrdersByProductBreakDownJson(ordersData) {
    const arr = [];
    let totalCartonsSum = 0;
    let totalPiecesSum = 0;
    let totalGrossWeightSum = 0;
    let totalVolumeSum = 0;
    let totalValueSum = 0;
    let totalCartonsPackedSum = 0;
    let totalCartonsshippedSum = 0;
    let totalCartonsBalanceSum = 0;
    let totalPiecesPackedSum = 0;
    let totalPiecesShippedSum = 0;
    let totalPiecesBalanceSum = 0;

    if (ordersData && ordersData.length > 0) {
      ordersData.forEach(order => {
        const orderProducts:any = order.orderProducts ? _.sortBy(order.orderProducts, 'variationId') : [];
        orderProducts.forEach((singleOrder, z) => {
          const dataCell = [];
          const product = this.productsArray.find(p => p.id === singleOrder.productId);
          const totatValue = parseInt(singleOrder.quantity, 10) * parseFloat(singleOrder.unitPrice);
          const country = this.getCountryName(order.countryId) ? this.getCountryName(order.countryId).name : '';
          const shipTo = (order.shippingLocation && order.shippingLocation.name ? order.shippingLocation.name : '') +','+ country;
          const quantityPacked = singleOrder.quantityPacked ? singleOrder.quantityPacked : 0;
          const quantityShipped = singleOrder.quantityShipped ? singleOrder.quantityShipped : 0;
          const cartonsPackedBalance = parseInt(singleOrder.quantity, 10) - parseInt(quantityPacked, 10);
          
          const piecesOfAllCartons =  singleOrder.piecesOfAllCartons ? singleOrder.piecesOfAllCartons : 0;
          const piecesOfPackedCartons =  singleOrder.piecesOfPackedCartons ? singleOrder.piecesOfPackedCartons : 0;
          const piecesOfShippedCartons =  singleOrder.piecesOfShippedCartons ? singleOrder.piecesOfShippedCartons : 0;
          const piecesPackedBalance = parseInt(piecesOfAllCartons, 10) - parseInt(piecesOfPackedCartons, 10);
          
          totalCartonsSum += parseInt(singleOrder.quantity, 10);
          totalPiecesSum += parseInt(piecesOfAllCartons, 10);
          totalGrossWeightSum += parseFloat(singleOrder.totalWeight);
          totalVolumeSum += parseFloat(singleOrder.totalVolume);
          totalValueSum += totatValue;
          totalCartonsPackedSum += parseInt(quantityPacked, 10);
          totalCartonsshippedSum += parseInt(quantityShipped, 10);
          totalCartonsBalanceSum += cartonsPackedBalance;
          totalPiecesPackedSum += parseInt(piecesOfPackedCartons, 10);
          totalPiecesShippedSum += parseInt(piecesOfShippedCartons, 10);
          totalPiecesBalanceSum += piecesPackedBalance;
          
          let brand  = '';
          let productName = '';
          let productCode = '';

          if (product) {
            brand = product.customerBrand ? product.customerBrand.name : '';
            productName = product.name;
            productCode = product.code;
          }
          dataCell.push(order.proformaInvoiceNo);
          dataCell.push(brand);
          dataCell.push(productName);
          dataCell.push(productCode);
          dataCell.push(singleOrder.variationName);
          dataCell.push(this._decimalPipe.transform(singleOrder.quantity,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfAllCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(singleOrder.totalWeight,"1.2-2"));
          dataCell.push(this._decimalPipe.transform(singleOrder.totalVolume,"1.2-2"));
          dataCell.push(this._decimalPipe.transform(singleOrder.unitPrice,"1.2-2"));
          dataCell.push(this._decimalPipe.transform(totatValue,"1.2-2"));
          dataCell.push(order.customer ? order.customer.name : '');
          dataCell.push(shipTo);
          dataCell.push(order.shipmentDate ? this.dateFormate(order.shipmentDate) : '');
          dataCell.push(Utils.getStatusName(order.status));
          dataCell.push('');

          dataCell.push(this._decimalPipe.transform(singleOrder.quantity,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(quantityPacked,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(quantityShipped,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(cartonsPackedBalance,"1.0-2"));

          dataCell.push(this._decimalPipe.transform(piecesOfAllCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfPackedCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfShippedCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesPackedBalance,"1.0-2"));
          
          arr.push(dataCell);
        });
      });
    }

    return {
      csv: arr,
      totalCartonsSum,
      totalPiecesSum,
      totalGrossWeightSum,
      totalVolumeSum,
      totalValueSum,
      totalCartonsPackedSum,
      totalCartonsshippedSum,
      totalCartonsBalanceSum,
      totalPiecesPackedSum,
      totalPiecesShippedSum,
      totalPiecesBalanceSum
    }
  }

  // by product
  getCsvOrdersByProduct() {
    let ordersDataArray = [];
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      ordersDataArray = this.selection.selected;
    }

    let orderProducts = _.flatten(_.compact(_.pluck(ordersDataArray, 'orderProducts')));
    let productIds = [];
    if (!_.isEmpty(orderProducts) && orderProducts.length > 0) {
      productIds = _.unique(_.pluck(orderProducts, 'productId'));
    }


    this.getAllProducts(productIds, (data) => {
      this.productsArray = data;
      const ordersData = this.setCartonsPieces(ordersDataArray);
      const pluckOrderProducts = _.flatten(_.compact(_.pluck(ordersData, 'orderProducts')));
      const pluckByProduct = _.groupBy(pluckOrderProducts, 'productId')
      this.getCsvOrdersByProductExport(pluckByProduct)
    }, (err) => {
      this.alertService.error(err);
    });    
  }
  getCsvOrdersByProductExport(pluckByProduct) {  
    const setCsvJson:any = this.setOrdersByProductJson(pluckByProduct);
    
    const topHeading = ['Product Details'];
    for(var i = 0; i < 7; i++) {
      topHeading.push('');
    }
    topHeading.push('Progress (Cartons)');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('Progress (Pieces)');
    topHeading.push('');
    topHeading.push('');
    topHeading.push('');

    const titles = [
      'Brand',
      'Product Name',
      'Product Code',
      'Size',
      'Cartons',
      'Pieces',
      'Gross Weight (kgs)',
      'Total Volume (m3)',

      'Order Qty',
      'Packed Qty',
      'Shipped Qty',
      'Balance Qty',

      'Order Qty',
      'Packed Qty',
      'Shipped Qty',
      'Balance Qty'
    ];
  
    const totalHeading = ['-', '-', '-', '-'];
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalGrossWeightSum,"1.0-2"));
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalVolumeSum,"1.0-2"));
    
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsPackedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsshippedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalCartonsBalanceSum,"1.0-2")); 

    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesPackedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesShippedSum,"1.0-2")); 
    totalHeading.push(this._decimalPipe.transform(setCsvJson.totalPiecesBalanceSum,"1.0-2")); 
    
    let data = [
      topHeading,
      titles,
      totalHeading,
    ];

    data = data.concat(setCsvJson.csv);
    const options = { 
      filename: 'OMS_OrdersByProducts',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false, 
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      //headers: ["First Name", "Last Name", "ID"]
    };
     
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(data);
  }
  setOrdersByProductJson(pluckByProduct) {
    const arr = [];
    let totalCartonsSum = 0;
    let totalPiecesSum = 0;
    let totalGrossWeightSum = 0;
    let totalVolumeSum = 0;
    let totalValueSum = 0;
    let totalCartonsPackedSum = 0;
    let totalCartonsshippedSum = 0;
    let totalCartonsBalanceSum = 0;
    let totalPiecesPackedSum = 0;
    let totalPiecesShippedSum = 0;
    let totalPiecesBalanceSum = 0;
    
    const keys = Object.keys(pluckByProduct)

    for (const key of keys) {      
      const ordersData = pluckByProduct[key];
      const orderProducts:any = pluckByProduct[key] ? _.sortBy(pluckByProduct[key], 'variationId') : [];

      if (orderProducts && orderProducts.length > 0) {
          let groupCartonsSum = 0;
          let groupPiecesSum = 0;
          let groupGrossWeightSum = 0;
          let groupVolumeSum = 0;

          let groupCartonsPackedSum = 0;
          let groupCartonsshippedSum = 0;
          let groupCartonsBalanceSum = 0;
          let groupPiecesPackedSum = 0;
          let groupPiecesShippedSum = 0;
          let groupPiecesBalanceSum = 0;

        const groupByVariation = _.groupBy(orderProducts, 'variationId');
        const vKeys = Object.keys(groupByVariation);
        for (const vKey of vKeys) {   
          const singleOrder:any = groupByVariation[vKey][0];
          const dataCell = [];
          const product = this.productsArray.find(p => p.id === singleOrder.productId);
          
          const pluckQuantity = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'quantity')));
          const pluckQuantityPacked = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'quantityPacked')));
          const pluckQuantityShipped = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'quantityShipped')));
          const pluckPiecesOfAllCartons = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'piecesOfAllCartons')));
          const pluckPiecesOfPackedCartons = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'piecesOfPackedCartons')));
          const pluckPiecesOfShippedCartons = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'piecesOfShippedCartons')));
          const pluckTotalWeight = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'totalWeight')));
          const pluckTotalVolume = _.flatten(_.compact(_.pluck(groupByVariation[vKey], 'totalVolume')));
          
          const quantity = pluckQuantity ? Utils.numberArraySum(pluckQuantity) : 0;

          const quantityPacked = pluckQuantityPacked ? Utils.numberArraySum(pluckQuantityPacked) : 0;
          const quantityShipped = pluckQuantityShipped ? Utils.numberArraySum(pluckQuantityShipped) : 0;
          const cartonsPackedBalance = parseInt(quantity, 10) - parseInt(quantityPacked, 10);
          
          const piecesOfAllCartons =  pluckPiecesOfAllCartons ? Utils.numberArraySum(pluckPiecesOfAllCartons) : 0;
          const piecesOfPackedCartons =  pluckPiecesOfPackedCartons ? Utils.numberArraySum(pluckPiecesOfPackedCartons) : 0;
          const piecesOfShippedCartons =  pluckPiecesOfShippedCartons ? Utils.numberArraySum(pluckPiecesOfShippedCartons) : 0;
          const piecesPackedBalance = parseInt(piecesOfAllCartons, 10) - parseInt(piecesOfPackedCartons, 10);

          const totalWeight =  pluckTotalWeight ? Utils.numberArraySum(pluckTotalWeight) : 0;
          const totalVolume =  pluckTotalVolume ? Utils.numberArraySum(pluckTotalVolume) : 0;
          
          groupCartonsSum += parseInt(quantity, 10); 
          groupPiecesSum += parseInt(piecesOfAllCartons, 10); 
          groupGrossWeightSum += parseFloat(totalWeight); 
          groupVolumeSum += parseFloat(totalVolume); 
          groupCartonsPackedSum += parseInt(quantityPacked, 10); 
          groupCartonsshippedSum += parseInt(quantityShipped, 10); 
          groupCartonsBalanceSum += cartonsPackedBalance; 
          groupPiecesPackedSum += parseInt(piecesOfPackedCartons, 10); 
          groupPiecesShippedSum += parseInt(piecesOfShippedCartons, 10); 
          groupPiecesBalanceSum += piecesPackedBalance; 

          totalCartonsSum += parseInt(quantity, 10);
          totalPiecesSum += parseInt(piecesOfAllCartons, 10);
          totalGrossWeightSum += parseFloat(totalWeight);
          totalVolumeSum += parseFloat(totalVolume);

          totalCartonsPackedSum += parseInt(quantityPacked, 10);
          totalCartonsshippedSum += parseInt(quantityShipped, 10);
          totalCartonsBalanceSum += cartonsPackedBalance;
          totalPiecesPackedSum += parseInt(piecesOfPackedCartons, 10);
          totalPiecesShippedSum += parseInt(piecesOfShippedCartons, 10);
          totalPiecesBalanceSum += piecesPackedBalance;
          
          let brand  = '';
          let productName = '';
          let productCode = '';

          if (product) {
            brand = product.customerBrand ? product.customerBrand.name : '';
            productName = product.name;
            productCode = product.code;
          }
          dataCell.push(brand);
          dataCell.push(productName);
          dataCell.push(productCode);
          dataCell.push(singleOrder.variationName);

          dataCell.push(this._decimalPipe.transform(quantity,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfAllCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(totalWeight,"1.2-2"));
          dataCell.push(this._decimalPipe.transform(totalVolume,"1.2-2"));

          dataCell.push(this._decimalPipe.transform(quantity,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(quantityPacked,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(quantityShipped,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(cartonsPackedBalance,"1.0-2"));

          dataCell.push(this._decimalPipe.transform(piecesOfAllCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfPackedCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesOfShippedCartons,"1.0-2"));
          dataCell.push(this._decimalPipe.transform(piecesPackedBalance,"1.0-2"));
          
          arr.push(dataCell);
        }

        // Group Sum 
        const groupSumRow = [];
        groupSumRow.push('');
        groupSumRow.push('');
        groupSumRow.push('');
        groupSumRow.push('');

        groupSumRow.push(this._decimalPipe.transform(groupCartonsSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupPiecesSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupGrossWeightSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupVolumeSum, "1.0-2"));

        groupSumRow.push(this._decimalPipe.transform(groupCartonsSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupCartonsPackedSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupCartonsshippedSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupCartonsBalanceSum, "1.0-2"));

        groupSumRow.push(this._decimalPipe.transform(groupPiecesSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupPiecesPackedSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupPiecesShippedSum, "1.0-2"));
        groupSumRow.push(this._decimalPipe.transform(groupPiecesBalanceSum, "1.0-2"));
        
        arr.push(groupSumRow);
      }
    }

    return {
      csv: arr,
      totalCartonsSum,
      totalPiecesSum,
      totalGrossWeightSum,
      totalVolumeSum,
      totalValueSum,
      totalCartonsPackedSum,
      totalCartonsshippedSum,
      totalCartonsBalanceSum,
      totalPiecesPackedSum,
      totalPiecesShippedSum,
      totalPiecesBalanceSum
    }
  }
  // end by product

  getOrderPackingByOrderId(orderId, callBack) {
    this.orderService
      .getOrderPackingByOrderId(orderId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          callBack(data)
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  getProdutsByIds(productIds, callBack) {
    this.productService
    .getProductsByIds(productIds)
    .pipe(first())
    .subscribe(
      pDdata => {
        callBack(pDdata);
      },
      err => {
        this.showMessage(err, 'snackbar-error');
      }
    );
  }

  getOrdersPacking(orderIds, callBack) {
    this.orderService
      .getOrdersPacking(orderIds)
      .pipe(first())
      .subscribe(
        (data: any) => {
          callBack(data)
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  getDailyReport() {
    const selectedOrder = this.selection.selected;
    

    const dataArray = [];

    const ids = _.pluck(selectedOrder,'id');
    this.getOrdersPacking(ids, (orders) => {
      
      orders.forEach(order => {
        const mainHeadingRow = []
        const titleRow = []        

        let createdDates = [];
        if (order.orderPackings.length > 0) {
          let dates = _.sortBy(_.compact(_.pluck(order.orderPackings, 'createdAt')));
          dates = dates.map(d => {
            const dateFormate= moment(d).format("Do MMM, YYYY");
            return dateFormate;
          });
          createdDates = _.unique(dates);
        }
        mainHeadingRow.push(order.proformaInvoiceNo);
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('Packing Output: '+ createdDates[0] + ' - ' + createdDates[createdDates.length - 1]);
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('');
        mainHeadingRow.push('');

        titleRow.push('Customer');
        titleRow.push(order.customer ? order.customer.name : '-');
        titleRow.push('');
        titleRow.push('');
        titleRow.push('Brand');
        titleRow.push('Product Name');
        titleRow.push('Product Code');
        titleRow.push('Product Size');
        titleRow.push('Order Qty');
        titleRow.push('Packed Qty');
        titleRow.push('Balance Qty');        

        dataArray.push(mainHeadingRow);
        dataArray.push(titleRow);                

        if (order.orderProducts.length > 0) {
          if (order.orderProducts.length === 1) {
            order.orderProducts.forEach((item) => {
              const itemsRow = [];
              itemsRow.push('Shipment Date')
              itemsRow.push(createdDates[0] + ' - ' + createdDates[createdDates.length - 1])
              itemsRow.push('');
              itemsRow.push('');
              itemsRow.push(item.product ? item.product.customerBrand : '');
              itemsRow.push(item.product ? item.product.name : '');
              itemsRow.push(item.product ? item.product.code : '');
              itemsRow.push(item.product ? item.product.productVariation.variation.name : '');
              itemsRow.push(this._decimalPipe.transform(item.quantity,"1.0-2"));
              itemsRow.push(this._decimalPipe.transform(item.quantityPacked,"1.0-2"));
              itemsRow.push(this._decimalPipe.transform(item.quantity - item.quantityPacked,"1.0-2"));
              dataArray.push(itemsRow);
            });
            const itemsRow = [];
            const quantitySum = Utils.numberArraySum(_.pluck(order.orderProducts, 'quantity'));
            const packedSum = Utils.numberArraySum(_.pluck(order.orderProducts, 'quantityPacked'));
            const balanceSum = quantitySum - packedSum;

            itemsRow.push('Status')
            itemsRow.push(Utils.getStatusName(order.status))
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('Total');
            itemsRow.push(this._decimalPipe.transform(quantitySum,"1.0-2"));
            itemsRow.push(this._decimalPipe.transform(packedSum,"1.0-2"));
            itemsRow.push(this._decimalPipe.transform(balanceSum,"1.0-2"));
            dataArray.push(itemsRow);
          } else {
            order.orderProducts.forEach((item, i) => {
              const itemsRow = [];
              if (i == 0) {
                itemsRow.push('Shipment Date')
                itemsRow.push(createdDates[0] + ' - ' + createdDates[createdDates.length - 1])
              } else if (i == 1) {
                itemsRow.push('Status')
                itemsRow.push(Utils.getStatusName(order.status))
              } else {
                itemsRow.push('')
                itemsRow.push('')
              }
              itemsRow.push('');
              itemsRow.push('');
              itemsRow.push(order.product ? order.product.customerBrand : '-');
              itemsRow.push(item.product ? item.product.name : '');
              itemsRow.push(item.product ? item.product.code : '');
              itemsRow.push((item.productVariation && item.productVariation.variation )? item.productVariation.variation.name : '');
              itemsRow.push(this._decimalPipe.transform(item.quantity,"1.0-2"));
              itemsRow.push(this._decimalPipe.transform(item.quantityPacked,"1.0-2"));
              itemsRow.push(this._decimalPipe.transform(item.quantity - item.quantityPacked,"1.0-2"));
              dataArray.push(itemsRow);
            });
            const itemsRow = [];
            const quantitySum = Utils.numberArraySum(_.pluck(order.orderProducts, 'quantity'));
            const packedSum = Utils.numberArraySum(_.pluck(order.orderProducts, 'quantityPacked'));
            const balanceSum = quantitySum - packedSum;
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('');
            itemsRow.push('Total');
            itemsRow.push(this._decimalPipe.transform(quantitySum,"1.0-2"));
            itemsRow.push(this._decimalPipe.transform(packedSum,"1.0-2"));
            itemsRow.push(this._decimalPipe.transform(balanceSum,"1.0-2"));
            dataArray.push(itemsRow);
          }
        }

        const emptyRow = [];
        for (let index = 0; index < 11; index++) {
          emptyRow.push('');
          
        }
        dataArray.push(emptyRow);

      });


        const options = { 
        filename: 'STOCK_REPORT',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: false, 
        showTitle: false,
        title: '',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        //headers: ["First Name", "Last Name", "ID"]
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(dataArray);
    })

  }
  

}
