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
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UpdateShipmentDateDailogComponent } from '../update-shipment-date-dailog/update-shipment-date-dailog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShipmentDateHistoryDailogComponent } from '../shipment-date-history-dailog/shipment-date-history-dailog.component';
import { CompleteInvoiceDailogComponent } from '../complete-invoice-dailog/complete-invoice-dailog.component';
import Utils from 'src/app/custom-layout/_utils/utils';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'vex-invoice-details-tab',
  templateUrl: './invoice-details-tab.component.html',
  styleUrls: ['./invoice-details-tab.component.scss']
})
export class InvoiceDetailsTabComponent implements OnInit {

  @Input() allInvoice?: any;
  @Input() ordersArray?: any;
  @Input() productsArray?: any;
  @Input() variationsArray?: any;
  @Input() countries?: any;
  @Input() currencyList?: any;
  @Input() customerList?: any;
  @Input() customerBranchList?: any;
  @Input() packingSpecificationsProperties: any = [];


  constructor(
    private titleService: Title,
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.titleService.setTitle("Invoice Details");

  }

  icKeyboardArrowDown = icKeyboardArrowDown;
  icKeyboardArrowUp = icKeyboardArrowUp;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icEditPen = icEditPen;
  icDelete = icDelete;
  orderProducts: any = [];
  rowArray:any=[];
  setVeriable:any;

  ngOnInit() {
    this.rowArray = this.allInvoice ? this.allInvoice : [];
    this.rowArray.forEach((invoice, key) => {
      const invoiceProducts = invoice ? invoice.invoiceProducts : [];
      const products = Utils.sortProductsByVariant(invoiceProducts, this.productsArray);
      this.rowArray[key].invoiceProducts = products;
    });
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

  getCountry(countryId?: any) {
    const country = this.countries.find(f => f.id === parseInt(countryId));
    let name = '';
    if (!_.isEmpty(country)) {
      name = country.name;

    }
    return name;
  }

  getCustomer(id?: any) {
    const customer = this.customerList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(customer)) {
      name = customer.name;

    }
    return name;
  }



  getCurrency(id?: any) {
    const currency = this.currencyList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(currency)) {
      name = currency.name;

    }
    return name;
  }

  getBranches(id?: any) {
    const branches = this.customerBranchList.find(f => f.id === id);
    let name = '';
    if (!_.isEmpty(branches)) {
      name = branches.name;

    }
    return name;
  }

  deleteInovice(invoice: any) {

    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    if (confirm("Are you sure you want to delete " + invoice.invoiceNo)) {

      this.orderService
        .deleteInovice(invoice.id)
        .pipe(first())
        .subscribe(
          data => {
            if (data) {
              this.rowArray.splice(
                this.rowArray.find(
                  e => e.id == invoice.id
                ),
                1
              );


            }
          },
          err => {
            console.log(err);

          }
        );
    }


  }

  updateInvoice(inovice?: any) {
    this.router.navigate(['/create-orders-invoice', { orderNo: inovice.invoiceNo, orderId: inovice.orderId, invoiceId: inovice.id }]);
  }

  grandTotal(data) {
    let total = 0;
    if (data && data.invoiceProducts) {
      data.invoiceProducts.forEach(invoice => {
        const amount = invoice && invoice.totalAmount ? invoice.totalAmount : 0;
        total = total + parseFloat(amount);
      });
    }
    return total.toFixed(2);
  }

  openUpdateShipmentDateDailogComponent(invoiceId?: any, date?: any) {
    let shipmentModel = this.dialog.open(UpdateShipmentDateDailogComponent);
    shipmentModel.componentInstance.invoiceId = invoiceId;
    shipmentModel.componentInstance.currentDate = date;

    shipmentModel.afterClosed().subscribe((dataObj) => {
      const obj = dataObj ? dataObj : '';

      if(obj){
        this.orderService
        .addShipmentDate(obj)
        .pipe(first())
        .subscribe(
          data => {
            if (data) {
               
              let updateItem = this.rowArray.find(elm => elm.id == obj.invoiceId);
              updateItem.shipmentDates.push(data);
              let index = this.rowArray.indexOf(updateItem);
              this.rowArray[index] = updateItem;
            
              this.showMessage('New Shipment date added Successfully');
            }
          },
          err => {
            console.log(err);

          }
        );
      }
     
    });
  }

  openShipmentDateHistoryDailogComponent(invoiceDates?: any, shipmentDate?: any) {
    let shipmentModel = this.dialog.open(ShipmentDateHistoryDailogComponent);
    shipmentModel.componentInstance.invoiceDates = invoiceDates;
    shipmentModel.componentInstance.shipmentDate = shipmentDate;

  }

  openCompleteInvoice(invoice?: any) {
    let shipmentModel = this.dialog.open(CompleteInvoiceDailogComponent);
    shipmentModel.componentInstance.invoiceDetails = invoice;
    shipmentModel.componentInstance.productsArray = this.productsArray;
    shipmentModel.componentInstance.variationsArray = this.variationsArray;
    shipmentModel.afterClosed().subscribe((dataObj) => {
      const obj = dataObj ? dataObj : '';

      if(obj){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/order-details', { orderId: invoice.orderId }]);
        });

        this.orderService
        .invoiceComplete(obj)
        .pipe(first())
        .subscribe(
          data => {
            if (data) {

                this.orderService
                .updateInvoiceStatus(obj.invoiceId, 'shipped')
                .pipe(first())
                .subscribe(
                  status => {
                    if (status) {
                    
                      let updateItem  = this.rowArray.find(elm => elm.id == obj.invoiceId);
                      updateItem['vesselId'] = data['vesselId'];
                      updateItem['status'] = status['status'];
                      let index = this.rowArray.indexOf(updateItem);
                      this.rowArray[index] = updateItem;
                      this.showMessage('Complete invoice successfully');
                     // console.log('final Array' , this.rowArray);
                      
                    }

                  },
                  err => {
                    console.log(err);

                  }
                );

            }
          },
          err => {
            console.log(err);

          }
        );
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

  packedCalculation(product) {
    let packedPercentage:any = '';
    const quantity = product && product.quantity ? parseInt(product.quantity) : 0;
    const quantityPacked = product && product.quantityPacked ? parseInt(product.quantityPacked) : 0;
    packedPercentage = (quantityPacked * 100)/ quantity;
    return packedPercentage.toFixed(2);
  }

  dateFormate(date) {
    return this.datePipe.transform(date, Utils.getDateFormate());
  }

  getContactPerson() {
    return '';
  }

}
