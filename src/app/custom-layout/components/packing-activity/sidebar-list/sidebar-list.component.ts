import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Pipe, Output, EventEmitter } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { filter, map, startWith, take } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { aioTableLabels, aioTableData } from "src/static-data/aio-table-data";

import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import { SelectionModel } from "@angular/cdk/collections";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import icCalendar from "@iconify/icons-ic/baseline-calendar-today";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { FormControl, FormGroup } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import { MatSelectChange } from "@angular/material/select";
import theme from "src/@vex/utils/tailwindcss";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'vex-sidebar-list',
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
})
export class SidebarListComponent implements OnInit {
  layoutCtrl = new FormControl("boxed");

  @Input() ordersList;
  @Input() customersList;
  @Output() selectOrder: EventEmitter<any> = new EventEmitter();
  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<MapData[]> = new ReplaySubject<MapData[]>(1);
  data$: Observable<MapData[]> = this.subject$.asObservable();

  columns: TableColumn<MapData>[] = [
    { label: "proformaInvoiceNo", property: "proformaInvoiceNo", type: "text", visible: true}
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<MapData> | null;
  selection = new SelectionModel<MapData>(true, []);
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
  icCalendar = icCalendar;

  theme = theme;
  productsData: MapData[];

  UtilsStatus = Utils.status();

  statusList = [];
  selectedRow = null;

  filterForm = new FormGroup({
    customerField: new FormControl(),
    statusField: new FormControl(),
    startShipmentDate: new FormControl(),
    endShipmentDate: new FormControl()
  });

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.loadTableInitial();
    this.getData(this.ordersList);
  }

  ngOnChanges(changes) {
    const ordersList = changes.ordersList ? changes.ordersList.currentValue : this.ordersList;
    
    if ((changes.ordersList && !changes.ordersList.firstChange)) {
      setTimeout(() => {
        this.getData(ordersList);
      }, 500);
    }
  }

  suggestionWasClicked(row) {
    this.selectOrder.emit(row);
    this.selectedRow = row;
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  getData(ordersList) {

    if (ordersList && ordersList.length > 0) {
      this.statusList = _.unique(_.compact(_.pluck(ordersList, 'status')))
      this.statusList = this.statusList.map(s => {
        return {
          id: s,
          name: Utils.getStatusName(s)
        };
      });
      this.productsData = ordersList.map(data => {
        const quantity = _.compact(_.pluck(data.orderProducts, 'quantity'))
        const quantityPacked = _.compact(_.pluck(data.orderProducts, 'quantityPacked'))
        const quantitySum = Utils.numberArraySum(quantity);
        const quantityPackedSum = Utils.numberArraySum(quantityPacked);
        const packedPercentage = this.totalPackedPercentage(quantityPackedSum, quantitySum);
        return {
          id: data.id,
          proformaInvoiceNo: data.proformaInvoiceNo,
          customer: data.customer ? data.customer.name : '',
          customerId: data.customer ? data.customer.id : '',
          packedPercentage,
          status: data.status ? data.status : '',
          statusName: Utils.getStatusName(data.status),
          shipmentDate: data.shipmentDate
        }
      });

      setTimeout(() => {
        this.dataSource.data = this.productsData;
      }, 100);
    }
    

  }

  totalPackedPercentage(packedQuantity, totalQuantity) {
    const num =  (((packedQuantity ? parseInt(packedQuantity) : 0) * 100) / (totalQuantity ? parseInt(totalQuantity) : 0)).toFixed(2);
    return num && num !== 'NaN' ? num : 0.00;
  }

 
  loadTableInitial() {
    this.dataSource = new MatTableDataSource();
    this.data$.pipe(filter<MapData[]>(Boolean)).subscribe((resData) => {
      this.dataSource.data = resData;
    });
    this.searchCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => this.onFilterChange(value));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  clearFormValue() {
    this.filterForm.setValue({
      customerField: "",
      statusField: "",
      startShipmentDate: null,
      endShipmentDate: null
    });
    this.dataSource.data = this.productsData;
  }

  formFilter(value?: any) {
    const format = 'MMM d yyyy';
    const locale = 'en-US';
    const customerField = value.customerField  ;
    const statusField = value.statusField;
    const startShipmentDate = value.startShipmentDate;
    const endShipmentDate = value.endShipmentDate;
  
    this.dataSource.data = this.dataSource.data.filter(e => {
      let isCustomer = true,
          isStatus = true,
          isShipmentDate = true;
      if (customerField) {
        isCustomer = e.customerId == customerField;
      }

      if (statusField) {
        isStatus = e.status == statusField;
      }

      if (startShipmentDate && !endShipmentDate) {
        const d1 = formatDate(e.shipmentDate, format, locale);
        const d2 = formatDate(startShipmentDate, format, locale);
        const parseDate1 = Date.parse(d1);
        const parseDate2 = Date.parse(d2);
        isShipmentDate = parseDate1 >= parseDate2;
      } else if (endShipmentDate && !startShipmentDate) {
        const d1 = formatDate(e.shipmentDate, format, locale);
        const d2 = formatDate(endShipmentDate, format, locale);
        const parseDate1 = Date.parse(d1);
        const parseDate2 = Date.parse(d2);
        isShipmentDate = parseDate1 <= parseDate2;
      } else if (startShipmentDate && endShipmentDate) {
        const d1 = formatDate(e.shipmentDate, format, locale);
        const d2 = formatDate(startShipmentDate, format, locale);
        const d3 = formatDate(endShipmentDate, format, locale);
        const parseDate1 = Date.parse(d1);
        const parseDate2 = Date.parse(d2);
        const parseDate3 = Date.parse(d3);
        isShipmentDate = parseDate1 >= parseDate2 && parseDate1 <= parseDate3;
      }
   
      return isCustomer
      && isStatus
      && isShipmentDate;

    }).sort(  );
  }

  getStringFromHtml(row){
    const format = 'MMM d yyyy';
    const locale = 'en-US';
    let sDate = null;
    if (row.shipmentDates && row.shipmentDates.length > 0) {
      const lastData:any = _.last(row.shipmentDates);
      sDate = lastData.newShipmentDate
    } else {
      sDate = row.shipmentDate;
    }
    const dateFormate = formatDate(sDate, format, locale);
   
    return 'Shipment Date: ' + dateFormate;
}


}
export interface MapData{
  id: number;
  proformaInvoiceNo: string;
  customer: string;
  customerId: number;
  packedPercentage: string;
  status: string;
  shipmentDate: Date
}