import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Pipe, ChangeDetectorRef } from "@angular/core";
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
import Utils from "../../../_utils/utils";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'vex-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
})
export class OrderDetailsComponent implements OnInit {

@Input() orderData;
@Input() productsArray;
@Input() variationsArray;

  layoutCtrl = new FormControl("boxed");
  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<MapData[]> = new ReplaySubject<MapData[]>(1);
  data$: Observable<MapData[]> = this.subject$.asObservable();

  columns: TableColumn<MapData>[] = [
    { label: "name", property: "name", type: "text", visible: true},
    { label: "code", property: "code", type: "text", visible: true},
    { label: "size", property: "size", type: "text", visible: true},
    { label: "orderQty", property: "orderQty", type: "text", visible: true},
    { label: "packedQty", property: "packedQty", type: "text", visible: true},
    { label: "balance", property: "balance", type: "text", visible: true},
    { label: "progress", property: "progress", type: "text", visible: true},
  ];
  displayedFooterColumns: string[] = ['name', 'code', 'size', 'orderQty', 'packedQty', 'balance', 'progress'];
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

  storesList = [];
  unitsList = [];
  totalQuantity;
  totalBalance;
  totalPacked;

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
    private snackbar: MatSnackBar,
  ) {
   
  }

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }
  
  ngOnChanges(changes) {
    const orderData = changes.orderData ? changes.orderData.currentValue : this.orderData;
    console.log('changes >', changes)
    if (changes.orderData && !changes.orderData.firstChange) {
      console.log(' in in ')
      this.getData(orderData);
    }
  }

  ngOnInit(): void {
    this.loadTableInitial();
    this.getData(this.orderData);
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  getData(orderData) {
    if (orderData && orderData.orderProducts.length > 0) {
      this.productsData = orderData.orderProducts.map((data: any) => {
        return {
          name: this.getProductById(data.productId, 'name'),
          code: this.getProductById(data.productId, 'code'),
          size: this.getProductVariant(data.productId, data.productVariationId),
          orderQty: data.quantity,
          packedQty: data.quantityPacked,
          balance: data.quantity - data.quantityPacked,
          progress: this.totalPackedPercentage(data.quantityPacked, data.quantity)
        }
      });
      this.dataSource.data = this.productsData;

      const quantityArray = _.flatten(_.compact(_.pluck(this.productsData, 'orderQty')));
      const balanceArray = _.flatten(_.compact(_.pluck(this.productsData, 'balance')));
      const packedQtyArray = _.flatten(_.compact(_.pluck(this.productsData, 'packedQty')));
      this.totalQuantity = Utils.numberArraySum(quantityArray);
      this.totalPacked = Utils.numberArraySum(packedQtyArray);
      this.totalBalance = Utils.numberArraySum(balanceArray);
    }
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
  }

  totalPackedPercentage(packedQuantity, totalQuantity) {
    return (((packedQuantity ? parseInt(packedQuantity) : 0) * 100) / (totalQuantity ? parseInt(totalQuantity) : 0)).toFixed(2);
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