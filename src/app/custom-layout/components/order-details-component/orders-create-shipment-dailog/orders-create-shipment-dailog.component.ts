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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { first } from 'rxjs/operators';
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';

@Component({
  selector: 'vex-orders-create-shipment-dailog',
  templateUrl: './orders-create-shipment-dailog.component.html',
  styleUrls: ['./orders-create-shipment-dailog.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
})
export class OrdersCreateShipmentDailogComponent implements OnInit {

  layoutCtrl = new FormControl("fullwidth");
  
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

  dummyRow = [1,2,3,3,4]
  form: FormGroup;
  allInvoice = [];
  ordersArray:any = {};
  productsArray = [];
  variationsArray = [];
  disableBtn = true;
  singleShipment:any = {};
  dailogTitle = 'Create Shipment';
  buttonTitle = 'Confirm';
  packingSpecificationsProperties: any = [];
  cartonSpecificationProperties: any = [];
  shipmentsArray: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<OrdersCreateShipmentDailogComponent>,
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
  ) {
    
  }

  ngOnInit() {
    const props = this.dialogRef.componentInstance.defaults;
    this.allInvoice = props.allInvoice ? props.allInvoice : [];
    this.ordersArray = props.ordersArray ? props.ordersArray : {};
    this.productsArray = props.productsArray ? props.productsArray : [];
    this.variationsArray = props.variationsArray ? props.variationsArray :[];
    this.singleShipment = props.singleShipment ? props.singleShipment :{};
    this.packingSpecificationsProperties =  props.packingSpecificationsProperties ? props.packingSpecificationsProperties : '';
    this.cartonSpecificationProperties =  props.cartonSpecificationProperties ? props.cartonSpecificationProperties : '';
    this.shipmentsArray = props.shipmentsArray ? props.shipmentsArray : [];
    const orderProducts = this.ordersArray.orderProducts ? this.ordersArray.orderProducts : [];


    let defaultInvoiceId = this.allInvoice && this.allInvoice.length > 0 ? this.allInvoice[0].id : '';
    let shipmentDate = this.allInvoice && this.allInvoice.length > 0 ? this.allInvoice[0].shipmentDate : '';
    let shippedOn = '';
    let vesselId = '';
    let shipmentProducts:any = '';
    if (this.singleShipment && !_.isEmpty(this.singleShipment)) {
      this.dailogTitle = 'Update Shipment';
      this.buttonTitle = 'Update';
      defaultInvoiceId = this.singleShipment.invoiceId;

      shipmentDate = this.singleShipment.shipmentDate;
      shippedOn = this.singleShipment.shippedOn;
      vesselId = this.singleShipment.vesselId;
      shipmentProducts = this.singleShipment.shipmentProducts;
    }

    console.log('shipmentDate >>', shipmentDate)
    console.log('shippedOn >>', shippedOn)
    this.form = this.fb.group({
      invoice: defaultInvoiceId,
      shipmentDate,
      shippedOn: [{value: shippedOn, disable: false}, RxwebValidators.required()],
      vesselId: vesselId,
      isAllSelected: false,
      orderProducts: this.fb.array([]) || []
    });  
    this.form.patchValue({
      shippedOn
    });
    console.log('orderProducts >>', orderProducts)
    this.addProducts(orderProducts, shipmentProducts);
  }

  get ordersProductsArray():any {
    return this.form.get("orderProducts") as FormArray;
  }

  addProducts(orderProducts, shipmentProducts) {
    const orderProductsSorted = Utils.sortProductsByVariant(orderProducts, this.productsArray);
    orderProductsSorted.forEach(el => {      
      const shipmentProduct = shipmentProducts ? shipmentProducts.find(sp => sp.productId === el.productId && sp.productVariationId === el.productVariationId) : '';
      const shippedQuantity = shipmentProduct ? shipmentProduct.shippedQuantity :'';
      const quantity = el && el.quantity ? el.quantity : 0;
      const pieces = el && el.pieces ? el.pieces : 0;
      const piecesPerCartons = parseInt(pieces, 10) / parseInt(quantity, 10);
      const shippedPieces =  parseInt(shippedQuantity, 10) * piecesPerCartons;
      let shipedQty = 0;
      this.shipmentsArray.forEach(shipment => {
        shipment.shipmentProducts.forEach(prod => {
          if (prod.productId === el.productId && prod.productVariationId === el.productVariationId) {
            shipedQty += parseInt(prod.shippedQuantity, 10);
          }
        });
      });
      let quantityPacked = el.quantityPacked - shipedQty;
      if (shipmentProducts && shipmentProducts.length > 0 && shipmentProduct) {
          quantityPacked = (el.quantityPacked + parseInt(shipmentProduct.shippedQuantity, 10)) - shipedQty;
      }
      const piecesPacked = quantityPacked * piecesPerCartons;
      this.ordersProductsArray.push(this.fb.group({
        id: shipmentProduct && shipmentProduct.id ? shipmentProduct.id : '',
        shipmentId: shipmentProduct && shipmentProduct.shipmentId ? shipmentProduct.shipmentId : '',
        isSelected: parseInt(shippedQuantity, 10) > 0 ? true : false,
        productId: el.productId,
        productVariationId: el.productVariationId,
        quantity: el.quantity,
        quantityPacked,
        piecesPacked,
        unitPrice: el.unitPrice,
        pieces: el.pieces,
        shippedCartons: [{value: shippedQuantity, disabled: parseInt(shippedQuantity, 10) > 0 ? false : true}, RxwebValidators.required()],
        shippedPieces: shippedPieces ? shippedPieces : ''
      }));
    });
  }

  getTotalDetailForShipment() {
    let products = this.form.value.orderProducts;
    let totalCartons:any = 0;
    let totalPieces:any = 0;
    let totalVolume:any = 0;
    let totalWeight:any = 0;

      products.forEach((o, i) => {
        const product = this.productsArray.find(p => p.id === o.productId);
        const productVariations = product && product.productVariations ? product.productVariations : [];
        const productProperties = product && product.productProperties ? product.productProperties : [];
        const shippedCartons = o.shippedCartons ? o.shippedCartons : 0;

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
            const vData = productVariations.find(v => v.id === o.productVariationId);
            
            if ((f && f.data && f.data.value && vData) && (parseInt(f.data.value) === parseInt(vData.variationId))) {
              const totalPiecesCount = parseInt(shippedCartons) * parseInt(f.pcsCarton ? f.pcsCarton : 0);
              //products[i].pieces = totalPiecesCount;

              totalCartons = totalCartons + parseInt(shippedCartons);
              totalPieces = totalPieces + totalPiecesCount;

            }
          });
        }

        if (cartonSpecData && cartonSpecData.length > 0) {
          cartonSpecData.forEach(f => {
            const vData = productVariations.find(v => v.id === o.productVariationId);

            if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {
              // products[i].volumePerCarton = f.volume && f.volume ? parseFloat(f.volume) : 0;
              // products[i].weightPerCarton = f.weight && f.weight ? parseFloat(f.weight) : 0;
              totalVolume = totalVolume + ((f.volume && f.volume ? parseFloat(f.volume) : 0) * parseInt(shippedCartons));
              totalWeight = totalWeight + ((f.weight && f.weight ? parseFloat(f.weight) : 0) * parseInt(shippedCartons) );
            }
          });
        }
        // this.shipmentsArray[key].totalVolume = totalVolume;
        // this.shipmentsArray[key].totalWeight = totalWeight;
      });

      // if (action === 'products') {
      //   return products;
      // } else if (action === 'total') {
        return {
          totalCartons,
          totalPieces,
          totalVolume,
          totalWeight
        }
      //}
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
    const quantityPacked = product && product.quantityPacked ? product.quantityPacked : 0;
    const pieces = product && product.pieces ? product.pieces : 0;
    const quantity = product && product.quantity ? product.quantity : 0;
    const piecesPerCartons = parseInt(pieces, 10) / parseInt(quantity, 10);
    let q = val;
    if ( parseInt(val) > quantityPacked ) {
      q = 0;
    }

    const shippedPieces =  parseInt(q, 10) * piecesPerCartons;

    this.ordersProductsArray.controls[index].patchValue({
      [name]: q,
      shippedPieces
    });
  }

  enabelDisableCartons(index) {
    const orderProducts = this.form.value.orderProducts;
    if (orderProducts[index].isSelected) {
      this.ordersProductsArray.controls[index].controls['shippedCartons'].enable();
    } else {
      this.ordersProductsArray.controls[index].controls['shippedCartons'].disable();
    }
    
    let isEnable = false;
    orderProducts.forEach(e => {
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
    this.ordersProductsArray.controls.forEach((e, key) => {
    if (isAllSelected) {
        e.controls['shippedCartons'].enable();
        e.patchValue({isSelected: true});
        this.disableBtn = false;
      } else {
        e.controls['shippedCartons'].disable();
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

  getBalance(formData) {
    const product = formData.value;

    const shippedCartons = product && product.shippedCartons ? product.shippedCartons : 0;
    const quantityPacked = product && product.quantityPacked ? product.quantityPacked : 0;
    const cartonsBalance = parseInt(quantityPacked) - parseInt(shippedCartons);
    
    const shippedPieces = product && product.shippedPieces ? product.shippedPieces : 0;
    const piecesPacked = product && product.piecesPacked ? product.piecesPacked : 0;
    const piecesBalance = parseInt(piecesPacked) - parseInt(shippedPieces);    
    
    return {
      cartonsBalance,
      piecesBalance
    }
  }

  submit() {
    const values = this.form.value;    
    console.log('values >>', values)
    let orderProducts = [];
    if (values.orderProducts && values.orderProducts.length > 0) {
      orderProducts = values.orderProducts.map(o => {
        if (o.isSelected) {
          const obj:any = {
            productId: o.productId,
            productVariationId: o.productVariationId,
            shippedQuantity: o.shippedCartons
          };
          if (this.singleShipment && !_.isEmpty(this.singleShipment)) { // Update case
            if (o.id)
              obj.id = o.id;
            if (obj.shipmentId)
              obj.shipmentId = o.shipmentId;
          }
          return obj;
        }
      });
      orderProducts = _.compact(orderProducts);
    }

    const params = {
      id: this.singleShipment.id,
      shipmentDate: values.shipmentDate,
      shippedOn: values.shippedOn,
      vesselId: values.vesselId,
      invoiceId: values.invoice,
      shipmentProducts: orderProducts
    }
    console.log('params >>', params)
    if (this.singleShipment && !_.isEmpty(this.singleShipment)) { // Update
      this.orderService
        .updateShipment(params, this.singleShipment.id)
        .pipe(first())
        .subscribe(
          data => {
            this.showMessage('Shipping detail updated ...', 'snackbar-success');
            this.dialogRef.close({
              isRefresh: true,
              orderId: this.ordersArray.id
            });
          },
          err => {
            this.showMessage(err, 'snackbar-error');
          }
        );
    } else { // Create
    this.orderService
      .createShipment(params)
      .pipe(first())
      .subscribe(
        data => {
          this.showMessage('Shipping detail updated ...', 'snackbar-success');
          this.dialogRef.close({
            isRefresh: true,
            orderId: this.ordersArray.id
          });
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
    }
  }

}
