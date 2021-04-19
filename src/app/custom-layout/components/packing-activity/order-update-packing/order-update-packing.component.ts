import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Pipe, ChangeDetectorRef, Inject } from "@angular/core";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDetails from "@iconify/icons-ic/details";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import keyboardArrowUp from "@iconify/icons-ic/keyboard-arrow-up";
import keyboardArrowDown from "@iconify/icons-ic/keyboard-arrow-down";
import icCallSplit from "@iconify/icons-ic/call-split";
import icClose from "@iconify/icons-ic/twotone-close";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPhone from "@iconify/icons-ic/twotone-phone";
import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../../@vex/animations/stagger.animation";
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { CountryState } from '../../customer-component/customer-details/branches/branches-details/branch-components/branch-detail/branch-form-elements.component';
import { map, startWith, tap, first, filter } from 'rxjs/operators';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ProductService } from 'src/app/custom-layout/_services/product.service';


@Component({
  selector: 'vex-order-update-packing',
  templateUrl: './order-update-packing.component.html',
  styleUrls: ['./order-update-packing.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
})
export class OrderUpdatePackingComponent implements OnInit {


  layoutCtrl = new FormControl("fullwidth");

  stateCtrl: FormControl;
  filteredProducts$: any;
  productsList: any [];
  singleProduct: any = [];

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
  icArrowDropDown = icArrowDropDown;

  totalSizesSelected: boolean = false;
  veriations: any = [];
  checked: boolean = true;
  packingSpecificationsProperties: any = [];
  orderPrizeArray: any = [];
  getCurrencyName: any;

  ordersArray: any = [];
  allInvoice: any = [];
  invoiceProducts: any = [];

  variationsArray: any;
  productsArray: any;
  orderId: '';

  disableBtn = true;

  keyword = 'name';
  optionsData = [
  ];
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrderUpdatePackingComponent>,
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
    private productService: ProductService,
  ) {
    
  }

  form: FormGroup;
  productsData: MapData[];

  subject$: ReplaySubject<MapData[]> = new ReplaySubject<MapData[]>(1);
  data$: Observable<MapData[]> = this.subject$.asObservable();

  columns: TableColumn<MapData>[] = [
    { label: "Checkbox",property: "checkbox",type: "checkbox",visible: true},
    { label: "name", property: "name", type: "text", visible: true},
    { label: "size", property: "size", type: "text", visible: true},
    { label: "orderQty", property: "orderQty", type: "text", visible: true},
    { label: "packedQty", property: "packedQty", type: "text", visible: true},
    { label: "balance", property: "balance", type: "text", visible: true},
    { label: "progress", property: "progress", type: "text", visible: true},
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<MapData> | null;
  selection = new SelectionModel<MapData>(true, []);
  searchCtrl = new FormControl();
  
  ngOnInit() {
    const orderData = this.data.orderData;
    this.form = this.fb.group({
      date: null,
      invoiceField: [{value: orderData.proformaInvoiceNo, disabled: true}],
    });
    
    this.loadTableInitial();
    this.getData(this.data.orderData);
 
  }

  getData(orderData) {
    const data = [];
    if (orderData && orderData.orderProducts.length > 0) {
      this.productsData = orderData.orderProducts.map((data: any) => {
        return {
          id: data.id,
          name: this.getProductById(data.productId, 'name'),
          code: this.getProductById(data.productId, 'code'),
          size: this.getProductVariant(data.productId, data.productVariationId),
          orderQty: data.quantity,
          packedQty: data.quantityPacked,
          balance: data.quantity - data.quantityPacked,
          quantityReceived: 0,
          progress: this.totalPackedPercentage(data.quantityPacked, data.quantity)
        }
      });
      this.dataSource.data = this.productsData;
    }
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
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

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
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
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
  }

  getProductById(id: any, key: any) {
    const product = this.data.productsArray.find(f => f.id === id);
    if (_.isEmpty(key)) {
      return product;
    } else {
      return product ? product[key] : '';
    }
  }

  getProductVariant(pId: any, variantId: any) {
    const product = this.data.productsArray.find(f => f.id === pId);
    let name = '';
    if (!_.isEmpty(product) && !_.isEmpty(product.productVariations)) {
      product.productVariations.forEach(variant => {
        if (variant.id === variantId) {
          const orignalVariantObj = this.data.variationsArray.find(f => f.id === variant.variationId);
          name = orignalVariantObj ? orignalVariantObj.name : '';
        }
      });
    }
    return name;
  }

  autoSelect(value, row) {
    if (value && parseInt(value, 10) > 0) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }

  checkBalance(value, row) {
    if (value > row.balance) {
      row.quantityReceived = row.balance;
    } else {
      row.quantityReceived = value;
    }
  }

  submit() {
    if (!this.form.value.date) {
      this.showMessage('Please select Date', 'snackbar-error');
      return;
    }
    const orderData = this.data.orderData;
    const invoiceId = this.data.orderData && this.data.orderData.invoices.length > 0 ? this.data.orderData.invoices[0].id : '';
    const products = [];
    if (this.selection.selected.length > 0) {
      this.selection.selected.forEach(p => {
        products.push({
          orderProductId: p.id,
          quantityPacked: p.quantityReceived
        });
      });
    }
    const obj = {
      orderId: orderData.id,
      invoiceId,
      createdAt: this.form.value.date,
      products
    };
console.log('obj >', obj)

    this.orderService
    .addOrderPacking(obj)
    .pipe(first())
    .subscribe(
      data => {
        this.dialogRef.close({isRefresh: true});
      },
      err => {
        this.showMessage(err, 'snackbar-error');
      }
    );
    
  }

}

export interface MapData{
  id: number;
  name: string;
  code: string;
  size: string;
  orderQty: number;
  packedQty: number;
  balance: number;
  quantityReceived: number;
  progress: string;
}