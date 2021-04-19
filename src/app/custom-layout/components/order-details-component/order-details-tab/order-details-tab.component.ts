import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import Utils from 'src/app/custom-layout/_utils/utils';


@Component({
  selector: 'vex-order-details-tab',
  templateUrl: './order-details-tab.component.html',
  styleUrls: ['./order-details-tab.component.scss']
})
export class OrderDetailsTabComponent implements OnInit {

  @Input() ordersArray?: any;
  @Input() productsArray?: any;
  @Input() variationsArray?: any;

  orderProducts = [];

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) {

  }

  

  ngOnInit() {
    const orderProducts = this.ordersArray ? this.ordersArray.orderProducts : [];
    this.orderProducts = Utils.sortProductsByVariant(orderProducts, this.productsArray);
  }

  getProductById(id:any, key:any) {
    const product = this.productsArray.find(f => f.id === id);
    if (_.isEmpty(key)) {
      return product;
    } else {
      return product ? product[key] : '';
    }
  }

  getProductVariant(pId:any, variantId:any) {
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
  dashReplace(str?: any, orderNo?: any) {

    str = str.replace(/-/g, '/');
    if (str) {

      if (orderNo) {
        return str + '/' + orderNo;
      } else {
        return str;
      }

    } else {
      if (orderNo) {
        return str + '-' + orderNo;
      } else {
        return str;
      }
    }

  }

}
