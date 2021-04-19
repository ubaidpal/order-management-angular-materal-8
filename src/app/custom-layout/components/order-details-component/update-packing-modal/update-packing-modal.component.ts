import { Component, OnInit, Input, Inject, EventEmitter } from '@angular/core';
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
import { Observable } from 'rxjs';
import { CountryState } from '../../customer-component/customer-details/branches/branches-details/branch-components/branch-detail/branch-form-elements.component';
import { map, startWith, tap, first } from 'rxjs/operators';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

export interface Invoice {
  id: number;
  name: string;
}
export interface User {
  name: string;
}
@Component({
  selector: 'vex-update-packing-modal',
  templateUrl: './update-packing-modal.component.html',
  styleUrls: ['./update-packing-modal.component.scss']
})
export class UpdatePackingModalComponent implements OnInit {


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
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<UpdatePackingModalComponent>,
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
  ) {
    
  }

  form: FormGroup;

  
  ngOnInit() {
    this.form = this.fb.group({
      name: [{value: '', disabled: false}, RxwebValidators.required()],
      invoice: '',
      isAllSelected: false,
      invoiceProducts: this.fb.array([]) || []
    });
    
    const props = this.dialogRef.componentInstance.defaults;

    this.allInvoice = props.allInvoice ? props.allInvoice : [];
    this.ordersArray = props.ordersArray ? props.ordersArray : [];
    const invoiceProducts = props.allInvoice && props.allInvoice[0] && props.allInvoice[0].invoiceProducts ? props.allInvoice[0].invoiceProducts : [];

    this.variationsArray = props.variationsArray ? props.variationsArray : [];
    this.productsArray = props.productsArray ? props.productsArray : [];
    this.orderId = props.orderId;

    if (this.allInvoice) {
      this.optionsData = _.map(this.allInvoice, (f:any) => {
        return {id: f.id, name: f.invoiceNo }
      });
      if (this.optionsData && this.optionsData.length > 0) {
        this.form.patchValue({
          invoice: this.optionsData[0],
          name: this.optionsData[0].name
        });
        this.selectProductVariant(this.optionsData[0]);
      }
    }
    
   
    

    
    // setTimeout(() => {
    //   this.addProducts(invoiceProducts);
    // }, 0);

  }


  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e){
    // do something when input is focused
  }
  //

  get invoiceProductsArray():any {
    return this.form.get("invoiceProducts") as FormArray;
  }

  addProducts(invoiceProducts) {
    invoiceProducts.forEach(el => {console.log('el >>', el )
      this.invoiceProductsArray.push(this.fb.group({
        isSelected: false,
        id: el.id,
        productId: el.productId,
        productVariationId: el.productVariationId,
        quantity: el.quantity,
        unitPrice: el.unitPrice,
        pieces: el.pieces,
        quantityPacked: el.quantityPacked,
        //cartonsPacked: [{value: '', disabled: true}]
        cartonsPacked: [{value: el.quantityPacked, disabled: true}, RxwebValidators.required()]
      }));
      console.log('invoiceProductsArray >>', this.invoiceProductsArray)
    });
  }
  
  selectProductVariant(e) {
    const value = e;
    if (value && value.id) {
      this.form.patchValue({
        invoice: value
      });
    }
    const selectedIvoice = this.form.value.invoice;
    if (selectedIvoice) {
      const invoice = this.allInvoice.find(f => selectedIvoice.id === f.id);
      const invoiceProducts = invoice && invoice.invoiceProducts ? invoice.invoiceProducts  :[];
      const oldInvProducts = this.form.value.invoiceProducts;
      if (oldInvProducts && oldInvProducts.length > 0) {
        let keys = Object.keys(oldInvProducts)
        keys = keys.reverse();
        keys.forEach(k => this.invoiceProductsArray.removeAt(parseInt(k)));
      }

      if (invoiceProducts && invoiceProducts.length > 0) {
        this.addProducts(invoiceProducts);
      }
    }
  }

  getSizeName(variationNameid?: number) {
    const variationName = this.veriations.find(elm => elm.id == variationNameid);
    return variationName.name ? variationName.name : '';
  }

  getProductById(data:any, key:any) {
    const id = data && data.value ? data.value.productId : '';
    let product = '';
    if (this.productsArray && this.productsArray.length > 0) {
      product = this.productsArray.find(f => f.id === id);
    }
    if (_.isEmpty(key)) {
      return product;
    } else {
      return product ? product[key] : '';
    }
  }

  getProductVariant(data:any) {
    const pId = data && data.value ? data.value.productId : '';
    const variantId = data && data.value ? data.value.productVariationId : '';

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

  numberValidation(e, name, index, product) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    const quantity = product && product.quantity ? product.quantity : 0;
    let q = val;
    if ( parseInt(val) > quantity ) {
      q = 0;
    }
    this.invoiceProductsArray.controls[index].patchValue({
      [name]: q
    });
  }

  getBalance(formData) {
    const product = formData.value;
    const quantityPacked = product && product.quantityPacked ? product.quantityPacked : 0;
    const quantity = product && product.quantity ? product.quantity : 0;
    return parseInt(quantity) - parseInt(quantityPacked);
  }

  enabelDisableCartons(index) {
    const invoiceProducts = this.form.value.invoiceProducts;
    if (invoiceProducts[index].isSelected) {
      this.invoiceProductsArray.controls[index].controls['cartonsPacked'].enable();
      if (this.invoiceProductsArray.controls[index].controls['cartonsPacked'].value == 0) {
        this.invoiceProductsArray.controls[index].patchValue({cartonsPacked: ''});
      }
    } else {
      this.invoiceProductsArray.controls[index].controls['cartonsPacked'].disable();
    }
    
    let isEnable = false;
    invoiceProducts.forEach(e => {
      if (e.isSelected)
        isEnable = e.isSelected;
    });
    if (isEnable) {
      this.disableBtn = false;
    } else {
      this.disableBtn = true;
    }
  }

  selectAllProducts() {
    const isAllSelected = this.form.value.isAllSelected;
    this.invoiceProductsArray.controls.forEach((e, key) => {
    if (isAllSelected) {
        e.controls['cartonsPacked'].enable();
        e.patchValue({isSelected: true});
        this.disableBtn = false;
        
        if (e.controls['cartonsPacked'].value == 0) {
          e.patchValue({cartonsPacked: ''});
        }
      } else {
        e.controls['cartonsPacked'].disable();
        e.patchValue({isSelected: false});
        this.disableBtn = true;
      }
    });
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
  }

  submit() {    
    const orderProducts = this.ordersArray && this.ordersArray.orderProducts ? this.ordersArray.orderProducts : [];
    const values = this.form.value;
    const invoiceId = values.invoice ? values.invoice.id : '';

    const packedProducts = [];
    if (values.invoiceProducts && values.invoiceProducts.length > 0) {
     // console.log('values.invoiceProducts', values.invoiceProducts)
      values.invoiceProducts.forEach(el => {
        if (el.isSelected) {
          const selectedProduct = orderProducts.find(p => p.productId === el.productId);
          packedProducts.push({productId: el.productId, productVariationId: el.productVariationId, quantityPacked: el.cartonsPacked ? parseInt(el.cartonsPacked) : 0});
        }
      });
    }
    const obj = {
      orderId: parseInt(this.orderId),
      invoiceId,
      packedProducts
    }

    this.orderService
      .updatePacking(obj)
      .pipe(first())
      .subscribe(
        data => {
          this.showMessage('Packing detail updated ...', 'snackbar-success');
          this.dialogRef.close({
            isRefresh: true
          });
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
   // console.log('vales *****  >>', values )
    //this.dialogRef.close({data: productData, productId: singleProductId});
    
  }

}
