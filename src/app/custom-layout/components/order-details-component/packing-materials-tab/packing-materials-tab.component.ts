import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { MatSnackBar } from '@angular/material';
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
import { Router } from "@angular/router";

@Component({
  selector: 'vex-packing-materials-tab',
  templateUrl: './packing-materials-tab.component.html',
  styleUrls: ['./packing-materials-tab.component.scss']
})
export class PackingMaterialsTabComponent implements OnInit {

  @Input() singleOrder?: any;
  @Input() productsArray?: any;
  @Input() variationsArray?: any;
  @Input() countries?: any;
  @Input() currencyList?: any;
  @Input() customerList?: any;
  @Input() customerBranchList?: any;
  @Input() shipmentsArray?: any;
  @Input() allInvoice?: any;
  @Input() packingSpecificationsProperties?: any;
  @Input() cartonSpecificationProperties?: any;

  orderProducts: any = [];
  form: FormGroup;
  staticPackingMaterials: any = [];
  packingMaterials: any = [];
  firstApiLoaded = false;
  secondApiLoaded = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getStaticPackingMaterials();
    console.log('singleOrder', this.singleOrder)
    this.orderProducts = this.singleOrder ? this.singleOrder.orderProducts : [];
    this.getPackingByOrderId();
    // this.getPacking();
    this.form = this.fb.group({
      orderProducts: this.fb.array([]) || []
    });
    this.checkAllApi();
  }

  get orderProductsArray():any {
    return this.form.get("orderProducts") as FormArray;
  }

  addProducts(orderProducts) {
    const packingMaterialsProducts = this.packingMaterials ? this.packingMaterials.products : [];

    orderProducts.forEach(el => {
      const selectedProduct = this.productsArray.find(p => p.id == el.productId);

      let quantity = el.quantity;
      let quantityReceived = el.quantityReceived ? parseInt(el.quantityReceived, 10) : 0;
      let balanceQty = parseInt(el.quantity, 10) - quantityReceived;
      let nextDeliveryDate = el.nextDeliveryDate ? el.nextDeliveryDate : '';
      const packingMaterialId = selectedProduct.packingMaterialId ? selectedProduct.packingMaterialId : '';
      const seletedMaterial = this.staticPackingMaterials.find(p => p.id == packingMaterialId);
      const packingMaterialName = seletedMaterial ? seletedMaterial.name : '';
      
      if (packingMaterialsProducts && packingMaterialsProducts.length > 0) {
        const isFoundMaterial = packingMaterialsProducts.find(p => p.productId === el.productId && p.productVariationId === el.productVariationId);
        if (isFoundMaterial) {
          quantity = isFoundMaterial.quantity;
          quantityReceived = isFoundMaterial.quantityReceived;
          balanceQty = parseInt(quantity, 10) - quantityReceived;
          nextDeliveryDate = isFoundMaterial.nextDeliveryDate;
        }
      }

      if (packingMaterialId) {
        this.orderProductsArray.push(this.fb.group({        
          quantity,
          productId: el.productId,
          productName: selectedProduct ? selectedProduct.name : '',
          productCode: selectedProduct ? selectedProduct.code : '',
          productVariationId: el.productVariationId,
          packingMaterialId,
          packingMaterialName,
          quantityReceived,
          balanceQty,
          nextDeliveryDate,
          
        }));
      }
    });
  }

  checkAllApi() {
    const delayTime = 500;
    let count = 0;
    const intervalId = setInterval(() => {
        if (this.firstApiLoaded && this.secondApiLoaded) {
          this.addProducts(this.orderProducts);
          clearInterval(intervalId);
        }
        if (count > 100) {
          clearInterval(intervalId);
        }
        count++;
    }, delayTime);
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
  
  getBalance(e, formData, index) {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    const product = formData.value;
    const quantity = product && product.quantity ? product.quantity : 0;
    const balanceQty = parseInt(quantity) - value;
    this.orderProductsArray.controls[index].patchValue({
      balanceQty
    });
  }

  numberValidation(e, name, index, product) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    const quantity = product && product.quantity ? product.quantity : 0;
    let q = val;
    if ( parseInt(val) > quantity ) {
      q = 0;
    }
    this.orderProductsArray.controls[index].patchValue({
      [name]: q
    });
  }

  getStaticPackingMaterials() {
    return this.commonService
      .getStaticPackingMaterials(
        data => {
          if (data) {
            this.staticPackingMaterials = data;            
            this.firstApiLoaded = true;
          }
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  async getPackingByOrderId() {
    this.orderService
      .getPackingByOrderId(this.singleOrder.id)
      .pipe(first())
      .subscribe(
        data => {
          this.packingMaterials = data;
          this.secondApiLoaded = true;
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  async getPacking() {
    this.orderService
      .getPacking()
      .pipe(first())
      .subscribe(
        data => {

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

  getGrandQty(name) {
    let orderProducts = this.form.value.orderProducts;
    const sum = _.compact(_.pluck(orderProducts, name));
    return Utils.numberArraySum(sum);
  }

  submit() {
    const packingMaterialsProducts = this.packingMaterials ? this.packingMaterials.products : [];
    const products = this.form.value.orderProducts;
    const packingMaterialsOrderProduct = [];
    products.forEach(product => {
      const selectedProduct = this.productsArray.find(f => f.id === product.productId);
      const p:any = {
        productId: product.productId,
        productVariationId: product.productVariationId,        
        quantity: product.quantity,
        quantityReceived: product.quantityReceived,
        nextDeliveryDate: product.nextDeliveryDate
      };
      
      if (packingMaterialsProducts && packingMaterialsProducts.length > 0) {
        const isFoundMaterial = packingMaterialsProducts.find(p => p.productId === product.productId && p.productVariationId === product.productVariationId);
        if (isFoundMaterial) {
          p.id = isFoundMaterial.id;
          p.packingMaterialsOrderId = isFoundMaterial.packingMaterialsOrderId;
        }
      }

      packingMaterialsOrderProduct.push(p);
      if (selectedProduct.packingMaterialId) {
        p.packingMaterialId = selectedProduct.packingMaterialId;
      }
    });
    const obj:any = {
      orderId: this.singleOrder.id,
      products: packingMaterialsOrderProduct
    }
    
    console.log('obj >', obj)

    // if (!_.isEmpty(this.packingMaterials)) {
    //   this.orderService
    //     .createPackingMaterial(this.packingMaterials.id)
    //     .pipe(first())
    //     .subscribe(
    //       data => {
    //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //             this.router.navigate(['/order-details', { orderId: this.singleOrder.id }]);
    //         });
    //       },
    //       err => {
    //         this.showMessage(err, 'snackbar-error');
    //       }
    //     );
    // } else {
      this.orderService
        .createPackingMaterial(obj)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/order-details', { orderId: this.singleOrder.id }]);
            });
          },
          err => {
            this.showMessage(err, 'snackbar-error');
          }
        );
    //}
  }

}
