import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { ProductService } from 'src/app/custom-layout/_services/product.service';
import Utils from 'src/app/custom-layout/_utils/utils';

@Component({
  selector: 'vex-order-progress',
  templateUrl: './order-progress.component.html',
  styleUrls: ['./order-progress.component.scss']
})
export class OrderProgressComponent implements OnInit {

  @Input() ordersArray?: any;
  @Input() productsArray?: any;
  @Input() variationsArray?: any;
  @Input() sizeSpecificationProperties: any;
  @Input() cartonSpecificationProperties: any;
  @Input() packingSpecificationsProperties: any;
  @Input() totalPiecesOfProducts = 0;
  @Input() totalCartonsOfProducts = 0;
  @Input() totalPackedCartons = 0;
  @Input() totalShippedCartons = 0;
  
  orderProducts = [];

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {


  }



  ngOnInit() {
    const orderProducts = this.ordersArray ? this.ordersArray.orderProducts : [];
    this.orderProducts = Utils.sortProductsByVariant(orderProducts, this.productsArray);
    console.log('this.orderProducts >', this.orderProducts)
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

  totalPackedPercentage(packedQuantity, totalQuantity) {
    return (((packedQuantity ? parseInt(packedQuantity) : 0) * 100) / (totalQuantity ? parseInt(totalQuantity) : 0)).toFixed(2);
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
  getProducedPieces(product, action) {
    const pieces = product.pieces ? product.pieces : 0;
    const quantity = product.quantity ? product.quantity : 0;
    const quantityPacked = product.quantityPacked ? product.quantityPacked : 0;
    const piecePerQuantity: any = pieces/quantity;
    const producedPieces = parseInt(piecePerQuantity) * parseInt(quantityPacked);
    if (action === 'pieces')
      return producedPieces;
    if (action === 'pieces_percentage')
      return ((producedPieces * 100) / pieces).toFixed(2);
  }
}