import { Component, OnInit, Input } from '@angular/core';
import icKeyboardArrowDown from '@iconify/icons-ic/keyboard-arrow-down';
import icKeyboardArrowUp from '@iconify/icons-ic/keyboard-arrow-up';
import icMoreHoriz from '@iconify/icons-ic/more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icEditPen from '@iconify/icons-ic/edit';
import icDelete from "@iconify/icons-ic/twotone-delete";
import * as _ from 'underscore';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { first } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { OrdersCreateShipmentDailogComponent } from "../orders-create-shipment-dailog/orders-create-shipment-dailog.component";
import { MatDialog } from "@angular/material";
import Utils from 'src/app/custom-layout/_utils/utils';

@Component({
  selector: 'vex-shipment-summary-tab',
  templateUrl: './shipment-summary-tab.component.html',
  styleUrls: ['./shipment-summary-tab.component.scss']
})
export class ShipmentSummaryTabComponent implements OnInit {

  @Input() ordersArray?: any;
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
  
  icKeyboardArrowDown = icKeyboardArrowDown;
  icKeyboardArrowUp = icKeyboardArrowUp;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icEditPen = icEditPen;
  icDelete = icDelete;

  showEmptyGrid: Boolean = true;
  orderProducts:any = [];
  rowArray= [];
  createShipmentModal: any;
  shipmentsSummaryArray: any;

  constructor(
    private orderService: OrderService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) { }    
  ngOnInit() {    
    if (this.shipmentsArray && this.shipmentsArray.length > 0){
      this.shipmentsArray.forEach(shipment => {
        const sortedProducts = Utils.sortProductsByVariant(shipment.shipmentProducts, this.productsArray);
        shipment.shipmentProducts = sortedProducts;
      });
      this.showEmptyGrid = false;
    }
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

  getCountry(countryId?:any) {
    const country = this.countries.find(f => f.id == countryId);

    let name = '';
    if (!_.isEmpty(country)) {
          name =  country.name;
    
    }
    return name;
  } 

  getCustomer(id?:any) {
    const customer = this.customerList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(customer)) {
          name =  customer.name;
    
    }
    return name;
  } 



  getCurrency(id?:any) {
    const currency = this.currencyList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(currency)) {
          name =  currency.name;
    
    }
    return name;
  } 

  getBranches(id?:any) {
    const branches = this.customerBranchList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(branches)) {
          name =  branches.name;
    
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

  deleteShipment(shipment) {
    if (confirm('Do you want to delete this shipment?')) {
      this.orderService
        .deleteShipment(shipment.id)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/order-details', { orderId: this.ordersArray.id }]);
            });
          },
          err => {
            this.showMessage(err, 'snackbar-error');
          }
        );
    }
  }

  openCreateShipmentDailog(singleShipment) {
    this.createShipmentModal = this.dialog.open(OrdersCreateShipmentDailogComponent,{
      data: {
        singleShipment,
        allInvoice: this.allInvoice,
        ordersArray: this.ordersArray,
        productsArray: this.productsArray,
        variationsArray: this.variationsArray,
        packingSpecificationsProperties: this.packingSpecificationsProperties,
        cartonSpecificationProperties: this.cartonSpecificationProperties,
        shipmentsArray: this.shipmentsArray
      }
    });
    this.createShipmentModal.afterClosed().subscribe((dataObj) => {
      if (dataObj && dataObj.isRefresh) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/order-details', { orderId: dataObj.orderId }]);
        });
      }
    });
  }

  

}
