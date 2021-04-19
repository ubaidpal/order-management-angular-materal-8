import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Pipe } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { filter, first, map, startWith, take } from "rxjs/operators";
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
import icCheckCircle from "@iconify/icons-ic/check-circle";
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
import * as moment from 'moment'; 
import _ from 'underscore';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { MatSnackBar } from '@angular/material';
import Utils from "../../../_utils/utils";
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';

const format = 'MMM dd yyyy';
const locale = 'en-US';

@Component({
  selector: 'vex-packing-output',
  templateUrl: './packing-output.component.html',
  styleUrls: ['./packing-output.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
})
export class PackingOutputComponent implements OnInit {
  @Input() orderData;
  @Input() productsArray;
  @Input() variationsArray;
  @Input() orderPackingData;

  layoutCtrl = new FormControl("boxed");
  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  tables = [0];
  
  subject$: ReplaySubject<MapData[]> = new ReplaySubject<MapData[]>(1);
  data$: Observable<MapData[]> = this.subject$.asObservable();

  columns: TableColumn<MapData>[] = null;
  displayedFooterColumns: string[] = null;
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
  icCheckCircle = icCheckCircle;

  theme = theme;
  productsData: MapData[];

  totalQuantity;
  totalBalance;
  totalPacked;

  storesList = [];
  unitsList = [];
  

  filterForm = new FormGroup({
    storesField: new FormControl(),
    unitsField: new FormControl(),
    fromOrderDate: new FormControl(),
    toOrderDate: new FormControl()
  });

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }

  ngOnChanges(changes) {
    const orderData = changes.orderData ? changes.orderData.currentValue : this.orderData;
    const orderPackingData = changes.orderPackingData ? changes.orderPackingData.currentValue: this.orderPackingData;
    
    if ((changes.orderData && !changes.orderData.firstChange) || (changes.orderPackingData && !changes.orderPackingData.firstChange)) {
      setTimeout(() => {
        this.getData(orderData, orderPackingData);
      }, 500);
    }
  }

  ngOnInit(): void {
    this.loadTableInitial();
    setTimeout(() => {
      this.getData(this.orderData, this.orderPackingData);
    }, 500);
     

    // var daysInMonth = [];

    // var monthDate = moment().startOf('month'); // change to a date in the month of interest

    // _.times(monthDate.daysInMonth(), function (n) {
    // 	 daysInMonth.push(monthDate.format('MMM DD ddd'));  // your format
    // 	 monthDate.add(1, 'day');
    // });
    
    // // console.log(daysInMonth)
    // if (daysInMonth.length > 0) {
    //   daysInMonth.forEach((day, i) => {
    //     this.columns.push(
    //       { label: day, property: day+i, type: "date", visible: true}
    //     );
    //   })
    // }

  }

  get visibleColumns() {
    return this.columns && this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  getData(orderData, orderPackingData) {
    const staticLabels: TableColumn<MapData>[] = [
      { label: "name", property: "name", type: "text", visible: true},
      { label: "ordered", property: "ordered", type: "text", visible: true},
      { label: "packed", property: "packed", type: "text", visible: true},
      { label: "balance", property: "balance", type: "text", visible: true},
    ];
    const staticFooterColumns: string[] = ['name', 'ordered', 'packed', 'balance'];
    this.columns = staticLabels;
    this.displayedFooterColumns = staticFooterColumns;
    // this.orderService
    //   .getOrderPackingByOrderId(orderData.id)
    //   .pipe(first())
    //   .subscribe(
    //     (data: any) => {
          let dates = _.sortBy(_.compact(_.pluck(orderPackingData, 'createdAt')));
          dates = dates.map(d => {
            const dateFormate= this.getDateFormate(d);
            return dateFormate;
          });
          const createdDates = _.unique(dates);
          createdDates.forEach((date, i) => {
            this.columns.push(
              { label: date, property: 'date'+i, type: "date", visible: true}
            );
            this.displayedFooterColumns.push('date'+i);
          })
          const orderPackingDataMap = orderPackingData.map(o => {
            const dateFormate= this.getDateFormate(o.createdAt);
            return {
              ...o,
              createdAt: dateFormate
            }
          })
          const groupByDate = _.groupBy(orderPackingDataMap, 'createdAt')

          if (orderData && orderData.orderProducts.length > 0) {
            this.productsData = orderData.orderProducts.map((orderData: any) => {
              const dates = {};
              createdDates.forEach((d, i) => {
                const updatedPackingArray = groupByDate[d];
                const pluckProducts = _.flatten(_.compact(_.pluck(updatedPackingArray, 'products')));
                const filterProducts = pluckProducts.filter(p => p.orderProductId === orderData.id);
                const quantityPacked = _.compact(_.pluck(filterProducts, 'quantityPacked'));
                const quantityPackedSum = Utils.numberArraySum(quantityPacked);
                dates['date'+i] = quantityPackedSum ? quantityPackedSum : 0;

              });
              return {
                name: this.getProductById(orderData.productId, 'name'),
                size: this.getProductVariant(orderData.productId, orderData.productVariationId),
                ordered: orderData.quantity,
                packed: orderData.quantityPacked,
                balance: orderData.quantity - orderData.quantityPacked,
                ...dates
              }
            });
            this.dataSource.data = this.productsData;
      
            const quantityArray = _.flatten(_.compact(_.pluck(this.productsData, 'ordered')));
            const balanceArray = _.flatten(_.compact(_.pluck(this.productsData, 'balance')));
            const packedQtyArray = _.flatten(_.compact(_.pluck(this.productsData, 'packed')));
            this.totalQuantity = Utils.numberArraySum(quantityArray);
            this.totalPacked = Utils.numberArraySum(packedQtyArray);
            this.totalBalance = Utils.numberArraySum(balanceArray);
          }
        // },
        // err => {
        //   this.showMessage(err, 'snackbar-error');
        // }
      // );

  }
 
  getDateFormate(date) {
    const check = moment(date, 'YYYY/MM/DD');
    const month = check.format('MMM');
    const day   = check.format('ddd');
    const dayNum   = check.format('DD');
    return month + ' ' +dayNum + ' ' + day;
  }

  loadTableInitial() {
    this.dataSource = new MatTableDataSource();
    this.data$.pipe(filter<MapData[]>(Boolean)).subscribe((resData) => {
      this.dataSource.data = resData;
    });
    this.searchCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => this.onFilterChange(value));
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
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

  totalPackedPercentage(packedQuantity, totalQuantity) {
    return (((packedQuantity ? parseInt(packedQuantity) : 0) * 100) / (totalQuantity ? parseInt(totalQuantity) : 0)).toFixed(2);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  clearFormValue() {
    this.filterForm.setValue({
      storesField: "",
      unitsField: ""
    });
    this.dataSource.data = this.productsData;
  }

  formFilter(value?: any) {
    const storesField = value.storesField  ;
    const unitsField = value.unitsField;
  
    this.dataSource.data = this.dataSource.data.filter(e => {
      let fromStore = true,
        isUnits = true;
       
      if (storesField) {
        // fromStore = e.storeName == storesField;
      }

      if (unitsField) {
        // const isFound = e.productUnits.find(u => {
        //   return u.unitId === unitsField;
        // })
        // isUnits = isFound ? true : false;
      }
   
      return fromStore
      && isUnits;

    }).sort(  );
  }

  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
  }

  getProductById(id: any, key: any) {
    const product = this.productsArray.find(f => f.id === id);
    if (_.isEmpty(key)) {
      return product;
    } else {
      return product ? product[key] : '';
    }
  }

  getProductVariant(pId: any, variantId: any) {
    const product = this.productsArray.find(f => f.id === pId);
    let name = '';
    if (!_.isEmpty(product) && !_.isEmpty(product.productVariations)) {
      product.productVariations.forEach(variant => {
        if (variant.id === variantId) {
          const orignalVariantObj = this.variationsArray.find(f => f.id === variant.variationId);
          name = orignalVariantObj ? orignalVariantObj.name : '';
        }
      });
    }
    return name;
  }

  getTotalCount(column) {
    if (column.type === 'date') {
      const packedCount = _.compact(_.pluck(this.productsData, column.property))
      const packedCountSum = Utils.numberArraySum(packedCount);
      return packedCountSum ? packedCountSum : 0;
    }
  }


}
export interface MapData{
  name: string,
  code: string,
  size: string,
  orderQty: number,
  packedQty: number,
  balance: number,
  progress: string,
}