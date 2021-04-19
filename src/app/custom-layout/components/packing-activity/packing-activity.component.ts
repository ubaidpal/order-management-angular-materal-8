import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { CommonService } from '../../_services/common.service';
import { CustomerService } from '../../_services/customer.service';
import { OrderService } from '../../_services/orders.service';
import { PackingService } from '../../_services/packing.service';
import { OrderUpdatePackingComponent } from './order-update-packing/order-update-packing.component';
import * as _ from "underscore";
import { ProductService } from '../../_services/product.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'vex-packing-activity',
  templateUrl: './packing-activity.component.html',
  styleUrls: ['./packing-activity.component.scss']
})
export class PackingActivityComponent implements OnInit {
  breadcrumbsParams: any = [{ title: "Orders", url: "" }];

  ordersList;
  customersList;
  selectedOrder = null;
  countries: any;
  productsArray: any = [];
  variationsArray: any = [];
  orderPackingData: any = [];

  constructor(
    private dialog: MatDialog,
    private packingService: PackingService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private commonService: CommonService,
    private productService: ProductService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getOrders();

    this.customerService
    .getCustomer()
    .pipe(first())
    .subscribe(
      data => {
        this.customersList = data;
      },
      err => {
        this.showMessage(err, 'snackbar-error');
      }
    );
    this.commonService
    .getCountries(data => {
      if (data) {
        this.countries = data;
      }
    });

    this.commonService
      .getSizesVariations(
        data => {
          this.variationsArray = data;
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }
   
  getOrders(isRefresh?) {
    this.orderService
      .getAllOrders()
      .pipe(first())
      .subscribe(
        (data:any) => {
          let productIds = [];
          if (!_.isEmpty(data)) {
            const allOrderedProducts = _.flatten(_.compact(_.pluck(data, 'orderProducts')));
            productIds = _.unique(_.flatten(_.compact(_.pluck(allOrderedProducts, 'productId'))));
          }
          this.productService
          .getProductsByIds(productIds)
          .pipe(first())
          .subscribe(
            pDdata => {
              this.productsArray = pDdata;
              this.ordersList = data;
              if (isRefresh) {
                const isFound = this.ordersList.find(o => o.id == this.selectedOrder.id);
                if (isFound) this.selectOrder(isFound);
              }
            },
            err => {
              this.showMessage(err, 'snackbar-error');
            }
          );
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }
  checkTabtype(event) {
    console.log('evn', event)
  }

  openUpdatePackingModalComponent() {
    this.dialog.open(OrderUpdatePackingComponent,{
      data: {
        orderData: this.selectedOrder,
        variationsArray: this.variationsArray,
        productsArray: this.productsArray
      }
    }).afterClosed().subscribe((dataObj) => {
      if (dataObj && dataObj.isRefresh) {
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //     this.router.navigate(['/order-details', { orderId: this.orderId }]);
        // });
        this.getOrderPackingByOrderId(this.selectedOrder);
        this.getOrders(true);
      }
    });
  }

  getOrderPackingByOrderId(isFound) {
    this.orderService
      .getOrderPackingByOrderId(isFound.id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.orderPackingData = data;          
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );

  }

  selectOrder(data) {   
    this.selectedOrder = null; 
    if (data) {
      const isFound = this.ordersList.find(o => o.id === data.id);
      if (isFound) {
        this.getOrderPackingByOrderId(isFound); 
        this.selectedOrder = isFound;
      }
    }
  }

  getCountry(countryId?: any) {
    const country = this.countries.find(f => f.id === parseInt(countryId));
    let name = '';
    if (!_.isEmpty(country)) {
      name = country.name;
    }
    return name;
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: customClass
    });
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
    let format = 'm/d/yyyy',
      locale = 'en-US',
      f = formatDate(first, format, locale),
      s = formatDate(second, format, locale),
      date = this.datediff(this.parseDate(f), this.parseDate(s));

    if (date && date > 0) {
      return date + ' days';
    } else {
      return '0 days';
    }

  }

}
