import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icClose from "@iconify/icons-ic/twotone-close";
import icPrint from "@iconify/icons-ic/twotone-print";
import icDownload from "@iconify/icons-ic/twotone-cloud-download";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icPerson from "@iconify/icons-ic/twotone-person";
import icMyLocation from "@iconify/icons-ic/twotone-my-location";
import icLocationCity from "@iconify/icons-ic/twotone-location-city";
import icEditLocation from "@iconify/icons-ic/twotone-edit-location";
import expandLess from "@iconify/icons-ic/expand-less";
import expandMore from "@iconify/icons-ic/expand-more";
import icSearch from "@iconify/icons-ic/search";
import icAdd from "@iconify/icons-ic/add";
import icBlock from "@iconify/icons-ic/block";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { AlertService } from "../../_services/alert.service";
import { Router } from "@angular/router";
import { OrdersCreateShipmentDailogComponent } from "./orders-create-shipment-dailog/orders-create-shipment-dailog.component";
import { MatDialog } from "@angular/material";
import { OrderService } from "src/app/custom-layout/_services/orders.service";
import { ProductService } from "src/app/custom-layout/_services/product.service";
import { first } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from '../../_services/common.service';
import { CustomerService } from '../../_services/customer.service';
import { UpdatePackingModalComponent } from './update-packing-modal/update-packing-modal.component';

@Component({
  selector: "order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
  animations: [fadeInUp400ms, stagger40ms]
})
export class OrderDetailsComponent implements OnInit {
  //icons  
  icMoreVert = icMoreVert;
  icClose = icClose;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  expandLess = expandLess;
  expandMore = expandMore;
  icSearch = icSearch;
  icAdd = icAdd;
  icBlock = icBlock;

  ordersArray: any = {};
  showFirstTab: boolean = false;

  productsArray: any = [];
  variationsArray: any = [];

  firstApiCall: boolean = false;
  secondApiCall: boolean = false;
  thirdApiCall: boolean = false;

  sizeSpecificationProperties: any = [];
  cartonSpecificationProperties: any = [];
  packingSpecificationsProperties: any = [];
  totalPiecesOfProducts: any = 0;
  totalCartonsOfProducts: any = 0;
  totalPackedCartons: any = 0 ;
  totalShippedCartons: any = 0 ;

  breadCrum:any = [];
  orderId:any;

  countries:any=[];
  currencyList:any=[];
  customerList:any=[];
  customerBranchList:any=[];
  allInvoice:any=[];
  updatePackingModal: any;
  createShipmentModal: any;
  shipmentsArray: any = [];

  constructor(
    //@Inject(MAT_DIALOG_DATA) public defaults: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router,
    private orderService: OrderService,
    private commonService: CommonService,
    private productService: ProductService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get("orderId");
        
    this.getSizesVariations();
    this.getCountry();
    this.getAllCustomers();
    this.getBranches();
    this.getCurrency();
    this.getPropertyTypes();
    

    if (!_.isEmpty( this.orderId)) {
      //this.getAllInvoice();
      this.getShipments();
      this.getOrder(this.orderId);
     
    }
  }

  async getShipments() {
    this.orderService
      .getShipmentByOrderId(this.orderId)
      .pipe(first())
      .subscribe(
        data => {
          this.shipmentsArray = data;
        },
        err => {
          this.showMessage(err, 'snackbar-error');
        }
      );
  }

  async getOrder(id: any) {
    this.orderService
      .getOrdersById(id)
      .pipe(first())
      .subscribe(
        data => {
console.log('data >>', data)
          this.ordersArray = data;
          let productIds = [];
          if (!_.isEmpty(this.ordersArray) && this.ordersArray.orderProducts.length > 0) {
            productIds = _.pluck(this.ordersArray.orderProducts, 'productId');
          }
          this.getAllProducts(productIds);
          this.allInvoice = this.ordersArray.invoices ? this.ordersArray.invoices : [];
          //this.allInvoice = this.allInvoice.filter(elm => elm.orderId ==this.orderId );
          this.showFirstTab = true;
          this.firstApiCall = true;          
          this.getCustomerName();
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  async getAllProducts(productIds) {
    this.productService
      .getProductsByIds(productIds)
      .pipe(first())
      .subscribe(
        data => {
          this.productsArray = data;
          this.secondApiCall = true;
          
          this.setCartonsPieces();
          this.setCartonsPiecesOfInvoices();
          this.setCartonsPiecesOfShipments();
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  async getSizesVariations() {
    return await this.commonService
      .getSizesVariations(
        data => {
          this.variationsArray = data;
          this.thirdApiCall = true;
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  async getCountry() {

    return await this.commonService.getCountries((data: any) => {
      this.countries = data;
      
    }, (error: any) => {
      console.log('get countries:', error)
    });

  
  }

  async getCurrency() {
    return await this.customerService
      .getCurrency()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.currencyList = data; 
        }
      });
  }

  getCustomerName() {
    const cId = this.ordersArray ? this.ordersArray.customerId : null;
    if (this.customerList && this.customerList.length > 0 && cId) {
      const isCus = this.customerList.find(c => c.id === cId);
      this.breadCrum = [{title: 'Orders' ,url: '/order-view'}, 
      {title: isCus && isCus.name , paramsUrl: '/customer-details', query: [{cId: cId}]}, 
      {title: this.ordersArray.proformaInvoiceNo, url: '' , isActive: true}];
    }
  }
  async getAllCustomers() {

    return await this.customerService
      .getCustomer()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.customerList = data;
            this.getCustomerName();
          }
        },
        err => {
          console.log(err);
        }
      );

  }
  async getBranches() {
    return await this.customerService
      .getBranches()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.customerBranchList = data; 
        }
      });
  }

  async getAllInvoice() {
    return await this.orderService
      .getAllInvoice()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.allInvoice = data; 
          this.allInvoice = this.allInvoice.filter(elm => elm.orderId ==this.orderId );
          this.getOrder( this.orderId);      
          this.getSizesVariations();
          this.getCountry();
          this.getAllCustomers();
          this.getBranches();
          this.getCurrency();
        }else{
          this.allInvoice = [];
          this.getOrder( this.orderId);      
          this.getSizesVariations();
          this.getCountry();
          this.getAllCustomers();
          this.getBranches();
          this.getCurrency();
        }
      });
  }
  updateOrderStatus(status: string) {
    const orderId = this.ordersArray.id;    
    if (
      status === "completed" &&
      confirm("Do you want to complete this order?")
    ) {
      this.orderService
        .markAsCompelte(orderId)
        .pipe(first())
        .subscribe(
          data => {
            this.showMessage('Order status has been updated');
            setTimeout(() => {
              this.router.navigateByUrl('/order-view/all');
            }, 3000);
          },
          err => {
            this.showMessage(err);
          }
        );
    } else if (
      status === "Cancelled" &&
      confirm("Do you want to cancel this order?")
    ) {
      this.orderService
        .updateStatus(orderId, status)
        .pipe(first())
        .subscribe(
          data => {
            this.showMessage('Order status has been cancelled');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/order-details', { orderId: this.orderId }]);
            });
          },
          err => {
            this.showMessage(err);
          }
        );
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

  openCreateShipmentDailog() {
    this.createShipmentModal = this.dialog.open(OrdersCreateShipmentDailogComponent,{
      data: {
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
            this.router.navigate(['/order-details', { orderId: this.orderId }]);
        });
      }
    });
  }
  openUpdatePackingModalComponent() {
    this.updatePackingModal = this.dialog.open(UpdatePackingModalComponent,{
      data: {
        allInvoice: this.allInvoice,
        variationsArray: this.variationsArray,
        productsArray: this.productsArray,
        orderId: this.orderId,
        ordersArray: this.ordersArray
      }
    });
    this.updatePackingModal.afterClosed().subscribe((dataObj) => {
      if (dataObj && dataObj.isRefresh) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/order-details', { orderId: this.orderId }]);
        });
      }
    });
  }
  
  goToEdit() {
    this.router.navigate(['/edit-order', { orderId: this.orderId }]);
  }
  createInovoice(){
    this.router.navigate(['/create-orders-invoice', { orderNo:this.ordersArray.proformaInvoiceNo,orderId: this.orderId }]);
  }

  async getPropertyTypes() {
    return this.commonService
      .getPropertyTypes(
        data => {
          this.setPropertiesTypes(data);
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  setPropertiesTypes(data) {
    if (data) {
      let getData: any = data;

      this.sizeSpecificationProperties = getData.find(elm => elm.name === "Size Specification");
      this.sizeSpecificationProperties = this.sizeSpecificationProperties['properties'] ? this.sizeSpecificationProperties['properties'] : [];

      this.cartonSpecificationProperties = getData.find(elm => elm.name === "Carton Specification");
      this.cartonSpecificationProperties = this.cartonSpecificationProperties['properties'] ? this.cartonSpecificationProperties['properties'] : [];
      
      this.packingSpecificationsProperties = getData.find(elm => elm.name === "Packing Specifications");
      this.packingSpecificationsProperties = this.packingSpecificationsProperties['properties'] ? this.packingSpecificationsProperties['properties'] : [];
      

    } else {
      this.sizeSpecificationProperties = [];
      this.cartonSpecificationProperties = [];
      this.packingSpecificationsProperties = [];
    }
  }

  setCartonsPieces() {
    const orderProducts = this.ordersArray ? this.ordersArray.orderProducts : [];    
    let piecesOfProductsArray:any = [];
    let cartons = 0;
    let packedCartons = 0;
    let shippedCartons = 0;
    orderProducts.forEach((o, i) => {
      const product = this.productsArray.find(p => p.id === o.productId);
      const productVariations = product && product.productVariations ? product.productVariations : [];
      const productProperties = product && product.productProperties ? product.productProperties : [];
      cartons = cartons + (o.quantity ? parseInt(o.quantity) : 0);
      packedCartons += (o.quantityPacked ? parseInt(o.quantityPacked) : 0);
      shippedCartons += (o.quantityShipped ? parseInt(o.quantityShipped) : 0);
      let packingSpecData:any = [];
      if (!_.isEmpty(productProperties)) {
        productProperties.forEach(pp => {
          this.packingSpecificationsProperties.forEach(f => {
            if (f.id === pp.propertyId) {
              packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
            }
          });
          
        });
      }
      
      if (packingSpecData && packingSpecData.length > 0) {
        packingSpecData.forEach(f => {
          const vData = productVariations.find(v => v.id === o.productVariationId);
          
          if ((f && f.data && f.data.value && vData) && (parseInt(f.data.value) === parseInt(vData.variationId))) {
            const totalPieces = parseInt(o.quantity) * parseInt(f.pcsCarton ? f.pcsCarton : 0);
            this.ordersArray.orderProducts[i].pieces = totalPieces;
            this.ordersArray.orderProducts[i].piecesPerCarton = f.pcsCarton;
            this.ordersArray.orderProducts[i].totalAmount = parseInt(o.quantity) * parseFloat(o.unitPrice);
            piecesOfProductsArray.push(totalPieces);
          }
        });
      }

    });

    const values = Object.values(piecesOfProductsArray);
    const total = _.reduce(values, (memo: any, num: any) => {
      return parseInt(memo) + parseInt(num);
    }, 0);
    this.totalPiecesOfProducts = total ? total : 0;
    this.totalCartonsOfProducts = cartons;
    this.totalPackedCartons = packedCartons;
    this.totalShippedCartons = shippedCartons;
  }

  setCartonsPiecesOfInvoices() {
    const allInvoices = this.allInvoice ? this.allInvoice : [];
    
    allInvoices.forEach((invoice, key) => {
      let totalCartons:any = 0;
      let totalPieces:any = 0;
      let totalVolume:any = 0;
      let totalWeight:any = 0;
      const invoiceProducts = invoice ? invoice.invoiceProducts : [];      
      invoiceProducts.forEach((o, i) => {
        const product = this.productsArray.find(p => p.id === o.productId);
        const productVariations = product && product.productVariations ? product.productVariations : [];
        const productProperties = product && product.productProperties ? product.productProperties : [];

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
              const totalPiecesCount = parseInt(o.quantity) * parseInt(f.pcsCarton ? f.pcsCarton : 0);
              this.allInvoice[key].invoiceProducts[i].pieces = totalPiecesCount;
              this.allInvoice[key].invoiceProducts[i].totalAmount = parseInt(o.quantity) * parseFloat(o.unitPrice);

              totalCartons = totalCartons + parseInt(o.quantity);
              totalPieces = totalPieces + totalPiecesCount;

            }
          });
        }
        this.allInvoice[key].totalCartons = totalCartons;
        this.allInvoice[key].totalPieces = totalPieces;
        if (cartonSpecData && cartonSpecData.length > 0) {
          cartonSpecData.forEach(f => {
            const vData = productVariations.find(v => v.id === o.productVariationId);

            if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {              
              totalVolume = totalVolume + ((f.volume && f.volume ? parseFloat(f.volume) : 0) * parseInt(o.quantity));
              totalWeight = totalWeight + ((f.weight && f.weight ? parseFloat(f.weight) : 0) * parseInt(o.quantity) );
            }
          });
        }
        this.allInvoice[key].totalVolume = totalVolume;
        this.allInvoice[key].totalWeight = totalWeight;

      });
    });
    // const values = Object.values(piecesOfProductsArray);
    // const total = _.reduce(values, (memo: any, num: any) => {
    //   return parseInt(memo) + parseInt(num);
    // }, 0);
    // this.totalPiecesOfProducts = total ? total : 0;

  }

  setCartonsPiecesOfShipments() {
    const allShipments = this.shipmentsArray ? this.shipmentsArray : [];

    allShipments.forEach((shipment, key) => {
      let totalCartons:any = 0;
      let totalPieces:any = 0;
      let totalVolume:any = 0;
      let totalWeight:any = 0;
      const shipmentProducts = shipment ? shipment.shipmentProducts : [];      
      shipmentProducts.forEach((o, i) => {
        const product = this.productsArray.find(p => p.id === o.productId);
        const productVariations = product && product.productVariations ? product.productVariations : [];
        const productProperties = product && product.productProperties ? product.productProperties : [];

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
              const totalPiecesCount = parseInt(o.shippedQuantity) * parseInt(f.pcsCarton ? f.pcsCarton : 0);
              this.shipmentsArray[key].shipmentProducts[i].pieces = totalPiecesCount;

              totalCartons = totalCartons + parseInt(o.shippedQuantity);
              totalPieces = totalPieces + totalPiecesCount;

            }
          });
        }
        this.shipmentsArray[key].totalCartons = totalCartons;
        this.shipmentsArray[key].totalPieces = totalPieces;
        if (cartonSpecData && cartonSpecData.length > 0) {
          cartonSpecData.forEach(f => {
            const vData = productVariations.find(v => v.id === o.productVariationId);

            if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {
              
              totalVolume = totalVolume + ((f.volume && f.volume ? parseFloat(f.volume) : 0) * parseInt(o.shippedQuantity));
              totalWeight = totalWeight + ((f.weight && f.weight ? parseFloat(f.weight) : 0) * parseInt(o.shippedQuantity) );
            }
          });
        }
        this.shipmentsArray[key].totalVolume = totalVolume;
        this.shipmentsArray[key].totalWeight = totalWeight;

      });
    });
  }

  

}
