import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { AlertService } from "../../../_services/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from 'rxjs/operators';
import { OrderService } from 'src/app/custom-layout/_services/orders.service';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { ProductService } from 'src/app/custom-layout/_services/product.service';
import { MatSnackBar } from "@angular/material/snack-bar";

import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
import * as _ from "underscore";
import Utils from 'src/app/custom-layout/_utils/utils';
import { AddProductsDailogComponent } from '../../../../custom-layout/components/common/add-products-dailog/add-products-dailog.component';
import { Title } from '@angular/platform-browser';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
  selector: "vex-orders-create-invoice",
  templateUrl: "./orders-create-invoice.component.html",
  styleUrls: ["./orders-create-invoice.component.scss"],
  animations: [fadeInUp400ms, stagger40ms]
})
export class OrdersCreateInvoiceComponent implements OnInit {
  static id = 100;

  form: FormGroup;
  mode: "create" | "update" = "create";

  public show: boolean = false;
  public buttonName: any = "Show addtional Information";

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
  breadCrum: any = [];
  subTotal: number;
  orderNo: any;
  orderId: any;
  orderDetailsUrl: any;
  ordersData: any;
  contacts: any = [];
  shipToData: any = [];
  countries: any = [];
  originCountryData: any = [];
  shipping: any = [];
  getContactNumber: any = [];
  shippingType: any;
  products: any = [];
  varitionsArray: any = [];
  productPropertiesArray: any = [];
  veriations: any = [];
  variationName: any;

  piecesObj: any = {};
  prizesObj: any = {};
  totalValue: any = {};

  sizeSpecificationProperties: any = [];
  cartonSpecificationProperties: any = [];
  packingSpecificationsProperties: any = [];

  addProdcutModal: any;

  NewPiecesVal: any;
  total: any;
  updateCreateDisabled = true;
  currency: any;
  getData: any;
  invoiceId:any;
  orderProducts:any=[];
  isPatchComplete:boolean = false;


  constructor(
    //@Inject(MAT_DIALOG_DATA) public defaults: any, 
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle("Invoice");
    this.orderNo = this.route.snapshot.paramMap.get("orderNo");
    this.orderId = this.route.snapshot.paramMap.get("orderId");
    this.invoiceId = this.route.snapshot.paramMap.get("invoiceId");

    if( this.invoiceId){
      this.breadCrum = [
        { title: 'Order', url: '/order-view' },
        { title: this.orderNo, url3: this.orderId },
        { title: 'Update Invoice', url: '', isActive: true }
      ];
  
    }else{
      this.breadCrum = [
        { title: 'Order', url: '/order-view' },
        { title: this.orderNo, url3: this.orderId },
        { title: 'Create Invoice', url: '', isActive: true }
      ];
  
    }
   
    this.getPropertyTypes();
    this.getCountry();
    this.getShippingMethod();
    this.getShippingType();
    this.getSizesVariations();
  }

  ngOnInit() {

    if(this.invoiceId){
      this.getInoviceById(this.invoiceId);
    }else{ 
      this.getOrders(this.orderId);
    }

    this.form = this.fb.group({
      customerName: [{value: '', disabled: true}],
      piNumber: ['', RxwebValidators.required()],
      piDate: ['', RxwebValidators.required()],
      currency: '',
      shipmentDate: ['', RxwebValidators.required()],
      contactPerson: '',
      shipBy: '',
      deleveryTerms: '',
      contactDetails: '',
      originOfGoods: '',
      transhipment: '',
      shippingType: '',
      orderPrize: this.fb.array([]) || [],
      paymentTerms: '',
      specialClause: '',

    });
    //  this.form.get('piNumber4').disable({ onlySelf: true });
    // this.form.get('contactDetails').disable({ onlySelf: true });
    // this.form.controls['orderPrize'].valueChanges.subscribe(value => {
    //   value.forEach(el => {
    //     this.NewPiecesVal = el.cartons;
    //     this.total = this.totalAmount(el.cartons, el.price);
    //   })

    // });



  }
  get orderPrize() {
    return this.form.get("orderPrize") as FormArray;
  }
  totalAmount(cartons: number, price: number) {

    let total = 0;
    total += (cartons * price);
    return total;
  }
  save() {

    if(this.invoiceId){
      this.updateInvoice(this.invoiceId);
    }else{
      this.createInvoice();
    }
  
 
  }
  async getOrdersById(id?: number) {
    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.orderService
      .getOrdersById(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.getData = data;

          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  async createInvoice() {
    const orders = this.form.value;
    this.delay(200);
    const variationArray: any = [];
    if (orders.orderPrize) {
      orders.orderPrize.forEach(veration => {

        let ob = {
          "productId": veration.itemName ? veration.itemName : '',
          "productVariationId": veration.size ? veration.size : '',
          "quantity": veration.cartons ? veration.cartons : '',
          "unitPrice": veration.price ? veration.price : 0.00
        }
        variationArray.push(ob);

      });
    }

    const obj: any = {
   
      "invoiceDate": orders.piDate,
      "shipmentDate": orders.shipmentDate,
      "actualShipmentDate":  orders.shipmentDate,
      "customerContactId": orders.contactPerson,
      "shipBy": orders.shipBy,
      "contactPerson": orders.contactPerson,
      "isTranshipmentAllowed": orders.transhipment,
      "contactDetails": orders.contactDetails,
      "originOfGoods": orders.originOfGoods,
      "invoiceNo": orders.piNumber,
    
      "paymentTerms": orders.paymentTerms,
      "specialClause": orders.specialClause,
      "invoiceProducts": variationArray,
      "deliveryTerms": orders.deleveryTerms,
      "shippingType": orders.shippingType ? orders.shippingType : '',

      "shippingLocationId":  this.ordersData.shippingLocationId,
      "currencyId":  this.ordersData.currencyId,
      "countryId": this.ordersData.countryId,
      "orderId": this.ordersData.id,
      "customerId": this.ordersData.customerId,
      "orderNo": this.ordersData.orderNo,
      "customerBranchId": this.ordersData.customerBranchId,
      "status": this.ordersData.status,
      "fromPort": this.ordersData.fromPort ? this.ordersData.fromPort : '',

    }


    return await this.orderService
      .addUpdateOrderInvoice(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.showMessage('invoice add successfully');
            setTimeout(() => {
              this.router.navigate(["/order-details", {orderId: this.orderId}]);
            }, 2000);

          }
        },
        err => {
          this.showMessage(err);
        }
      );


  }
  async updateInvoice(id?:any) {
    const ordersData = this.ordersData;
    const orders = this.form.value;
    
    this.delay(200);
    const variationArray: any = [];
    if (orders.orderPrize) {
      const invoiceProducts = this.ordersData && this.ordersData.invoiceProducts ? this.ordersData.invoiceProducts : [];
      orders.orderPrize.forEach(veration => {
        const product = invoiceProducts.find(f => {
          return f.productId === veration.itemName && f.productVariationId === veration.size;
        });
        let ob:any = {
          "productId": veration.itemName ? veration.itemName : '',
          "productVariationId": veration.size ? veration.size : '',
          "quantity": veration.cartons ? veration.cartons : '',
          "unitPrice": veration.price ? veration.price : 0.00
        };

        if (product && product.id) {
          //ob.id = product.id;
          ob.invoiceId = product.invoiceId;
        }
        variationArray.push(ob);
      });
    }
  
    const obj: any = {
   
      "id": id,
      "invoiceDate": orders.piDate,
      "shipmentDate": orders.shipmentDate,
      "actualShipmentDate":  ordersData.actualShipmentDate,
      "customerContactId": orders.contactPerson,
      "shipBy": orders.shipBy,
      "contactPerson": orders.contactPerson,
      "isTranshipmentAllowed": orders.transhipment,
      "contactDetails": orders.contactDetails,
      "originOfGoods": orders.originOfGoods,
      "invoiceNo": orders.piNumber,
    
      "paymentTerms": orders.paymentTerms,
      "specialClause": orders.specialClause,
      "invoiceProducts": variationArray,
      "deliveryTerms": orders.deleveryTerms,
      "shippingType": orders.shippingType ? orders.shippingType : '',

      "shippingLocationId":  this.getData.shippingLocationId,
      "currencyId":  this.getData.currencyId,
      "countryId": this.getData.countryId,
      "orderId": this.getData.id,
      "customerId": this.getData.customerId,
      "orderNo": this.getData.orderNo,
      "customerBranchId": this.getData.customerBranchId,
      "status": this.getData.status,
      "fromPort": this.getData.fromPort ? this.getData.fromPort : ''

    
    }
    
    return await this.orderService
      .addUpdateOrderInvoice(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.showMessage('invoice updated successfully');
            setTimeout(() => {
              this.router.navigate(["/order-details", {orderId: this.orderId}]);
            }, 2000);
          }
        },
        err => {
          this.showMessage(err);
        }
      );
  }
 
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getOrders(orderId?: number) {

    this.delay(1000);
    return await this.orderService.getOrdersById(orderId).pipe(first()).subscribe(
      data => {
        if (data) {
          this.ordersData = data;

          this.getContactPerson(this.ordersData.customerId); // get by contact person id
          this.getShipToByBranchId(null, this.ordersData.customerId);
          this.getProductsByCustomerId(this.ordersData.customerId);
          this.getCustomerById(this.ordersData.customerId);
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  async getInoviceById(invioceId?: number) {
    this.getOrdersById(this.orderId);
    this.delay(1000);
    return await this.orderService.getInoviceById(invioceId).pipe(first()).subscribe(
      data => {
        if (data) {
          this.ordersData = data;
          this.getContactPerson(this.ordersData.customerId); // get by contact person id
          this.getShipToByBranchId(null, this.ordersData.customerId);
          this.getProductsByCustomerId(this.ordersData.customerId);
          this.getCustomerById(this.ordersData.customerId);
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  patchFormValues(data?: any) {

    let piN = [],
    contactPerson = '';
    contactPerson = data && data.contactPerson ? data.contactPerson : ''
    if(data.invoiceNo){
      piN = data && data.invoiceNo ? data.invoiceNo : '';
      this.orderProducts = data.invoiceProducts;
      //contactPerson =  data.customerContactId;

    }else{
      piN = data ? data.proformaInvoiceNo : '';
      this.orderProducts = data.orderProducts;
      //contactPerson =  data.contactPerson;
    }
 

    this.form.patchValue({
      piNumber: piN,
      piDate: data.proformaInvoiceDate ? data.proformaInvoiceDate : data.invoiceDate ? data.invoiceDate : '' ,
      currency: this.ordersData.currencyId ? this.ordersData.currencyId : '',
      shipmentDate: data.shipmentDate,
      contactPerson: parseInt(contactPerson),
      shipBy: data.shipBy,
      deleveryTerms:  data.deliveryTerms,
      contactDetails: data.contactDetails,
      originOfGoods: parseInt(data.originOfGoods),
      transhipment: data.isTranshipmentAllowed ? data.isTranshipmentAllowed : false,
      shippingType: data.shippingType,
      paymentTerms: data.paymentTerms,
      specialClause: data.specialClause || '',

    });
    //this.form.get('piNumber4').disable({ onlySelf: true });
    // this.form.get('contactDetails').disable({ onlySelf: true });
    if (this.orderProducts) {
      const orderProducts = Utils.sortProductsByVariant(this.orderProducts, this.products);
      orderProducts.forEach((veration, index) => {

        let obj = this.fb.group({
          itemId: veration.id ? veration.id : '',
          itemName: [veration.productId ? veration.productId : '', RxwebValidators.required()] ,
          size: [veration.productVariationId ? veration.productVariationId : '', RxwebValidators.required()],
          cartons: [veration.quantity ? veration.quantity : '', RxwebValidators.required()],
          price: [veration.unitPrice ? parseFloat(veration.unitPrice).toFixed(2) : 0.00, RxwebValidators.required()],
          currency: '',
          prizeCartan: veration.unitPrice,
          totalValue: '',
          pieces: '',
        });
        
        this.orderPrize.push(obj);
        this.onFieldChange(veration.quantity, index, 'cartons');

      });
    }
   
  }



  getVariationById(pId?: number, index?: number) {
    const selectedRowProduct = this.form.value.orderPrize[index];
    const singleProduct: any = this.products.find(p => p.id === pId);
    if (!_.isEmpty(singleProduct)) {
      this.openAddProductsModal(singleProduct);
      if (selectedRowProduct.itemName !== singleProduct.id)
        this.resetProductListValues(index);
    }
  }

  onVariantSelect(variantId, index) {
    const orderPrize = this.form.value.orderPrize;
    const selectedRow = orderPrize[index];
    const cartons = selectedRow.cartons ? selectedRow.cartons : 0;
    let isVariantAlreadyExist = false;
    orderPrize.forEach((el, index2) => {
      if (el.size === variantId && index !== index2) {
        isVariantAlreadyExist = true;
      }
    });
    if (isVariantAlreadyExist) {
      this.orderPrize.controls[index].patchValue({
        size: ''
      });
      this.showMessage('You already selected this size', 'snackbar-warning');
    } else {
      this.onFieldChange(cartons, index, 'cartons');
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

  onFieldChange(value, index, action) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const selectedRow = orderPrizeArray[index];
    const selectedRowProduct: any = this.products.find(p => p.id === selectedRow.itemName);
    const varitionsArray = selectedRowProduct && selectedRowProduct.productVariations ? selectedRowProduct.productVariations : [];
    const productProperties = selectedRowProduct && selectedRowProduct.productProperties ? selectedRowProduct.productProperties : [];
    const packingSpecificationsProperties = this.packingSpecificationsProperties;
    const orderPrize = this.form.value.orderPrize[index];
    let packingSpecData: any = [];
    let pcsCarton: any = 0;
    if (action === 'cartons') {
      productProperties.forEach(pp => {
        packingSpecificationsProperties.forEach(f => {
          if (f.id === pp.propertyId) {
            packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
          }
        });
      });

      if (packingSpecData && packingSpecData.length > 0) {
        packingSpecData.forEach(f => {
          const vData = varitionsArray.find(v => v.id === orderPrize.size);
          if (f && f.data && f.data.value === (vData ? vData.variationId : '' )) {
            pcsCarton = f.pcsCarton;
          }
        });
      }

      this.orderPrize.controls[index].patchValue({
        pieces: parseInt(value ? value : 0) * parseInt(pcsCarton ? pcsCarton : 0)
      })

    } else if (action === 'price') {
      this.orderPrize.controls[index].patchValue({
        price: parseFloat(value)
      });
    }

    this.totalValueCalclation(index);
  }

  getValues(index, action) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const selectedRowData = orderPrizeArray[index];
    if (action === 'pieces') {
      return selectedRowData && selectedRowData.pieces ? selectedRowData.pieces : '';
    }
    if (action === 'totalValue') {
      return selectedRowData && selectedRowData.totalValue ? selectedRowData.totalValue : '';
    }
  }

  totalValueCalclation(index) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const cartons = orderPrizeArray[index] && orderPrizeArray[index].cartons ? orderPrizeArray[index].cartons : 0;
    const price = orderPrizeArray[index] && orderPrizeArray[index].price ? orderPrizeArray[index].price : 0.00;
    const total = parseInt(cartons) * parseFloat(price);
    this.orderPrize.controls[index].patchValue({
      totalValue: total ? total : 0
    })
  }
  totalValues(key: any) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const cartonSpecificationProperties = this.cartonSpecificationProperties;

    let variantPackigDetail = [];
    if (!_.isEmpty(orderPrizeArray)) {
      orderPrizeArray.forEach(productVariant => {
        let selectedProduct: any = {};
        if (!_.isEmpty(this.products)) {
          selectedProduct = this.products.find(p => p.id === productVariant.itemName);
        }

        if (!_.isEmpty(selectedProduct)) {
          const productProperties = selectedProduct.productProperties ? selectedProduct.productProperties : [];
          const productVariations = selectedProduct.productVariations ? selectedProduct.productVariations : [];

          if (productProperties) {
            let packingSpecData = [];
            productProperties.forEach(pp => {
              cartonSpecificationProperties.forEach(f => {
                if (f.id === pp.propertyId) {
                  packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
                }
              });
            });

            if (packingSpecData && packingSpecData.length > 0) {
              packingSpecData.forEach(f => {
                const vData = productVariations.find(v => v.id === productVariant.size);

                if (f && f.data && f.data.value && vData && f.data.value === vData.variationId) {
                  const vpd = _.clone(f);
                  vpd.totalVolumeOfCartons = parseFloat(f.volume) * parseInt(productVariant.cartons);
                  vpd.totalWeightOfCartons = parseFloat(f.weight) * parseInt(productVariant.cartons);
                  variantPackigDetail.push(vpd);
                }
              });
            }
          }
        }
      });
    }

    const totalValueArray = _.compact(_.pluck(orderPrizeArray, 'totalValue'));
    const totalPiecesArray = _.compact(_.pluck(orderPrizeArray, 'pieces'));
    const totalCartonsArray = _.compact(_.pluck(orderPrizeArray, 'cartons'));
    const totalVolumeArray = _.compact(_.pluck(variantPackigDetail, 'totalVolumeOfCartons'));
    const totalGrossWeightArray = _.compact(_.pluck(variantPackigDetail, 'totalWeightOfCartons'));

    if (key === 'total_cartons') {
      const values = Object.values(totalCartonsArray);
      const totalPieces = _.reduce(values, (memo: any, num: any) => {
        return parseInt(memo) + parseInt(num);
      }, 0);
      return totalPieces ? totalPieces : 0;
    } else if (key === 'total_pieces') {
      const values = Object.values(totalPiecesArray);
      const total = _.reduce(values, (memo: any, num: any) => {
        return parseInt(memo) + parseInt(num);
      }, 0);
      return total ? total : 0;
    } else if (key === 'total_volume') {
      const values = Object.values(totalVolumeArray);
      const total = _.reduce(values, (memo: any, num: any) => {
        return (parseFloat(memo) + parseFloat(num)).toFixed(3);
      }, 0);
      return total ? total : 0;
    } else if (key === 'gross_weight') {
      const values = Object.values(totalGrossWeightArray);
      const total = _.reduce(values, (memo: any, num: any) => {
        return (parseFloat(memo) + parseFloat(num)).toFixed(2);
      }, 0);
      return total ? total : 0;
    } else if (key === 'grand_total') {
      const values = Object.values(totalValueArray)
      const grandTotal = _.reduce(values, (memo: any, num: any) => {
        return parseFloat(memo) + parseFloat(num);
      }, 0);
      return grandTotal ? parseFloat(grandTotal).toFixed(2) : 0;
    }
  }
  resetProductListValues(index) {
    this.orderPrize.controls[index].patchValue({
      totalValue: 0,
      pieces: 0,
      price: 0.00,
      size: '',
      cartons: ''
    })
  }

  getCurrency() {
    return this.customerService
      .getCurrency()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.currency = data;

        }
      });
  }
  getCurrencyName() {
    const cId = this.form.get('currency').value;
    let currencyObj: any = '';
    if (!_.isEmpty(this.currency)) {
      currencyObj = this.currency.find(f => f.id === cId);
    }
    return currencyObj ? currencyObj.name : '';
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

  getSizeName(variationNameid?: number) {

    this.variationName = this.veriations.find(elm => elm.id == variationNameid);
    return this.variationName = this.variationName.name ? this.variationName.name : '';
  }
  getContactPerson(cId?: number) {
    return this.customerService
      .getContactPerson(cId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.contacts = data;
        }
      });
  }

  getCustomerById(cId?: number) {
    return this.customerService
      .getCustomerById(cId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          const customer:any = data;
          this.form.patchValue({customerName: customer.name});
        }
      });
  }


  getShipToByBranchId(bId?: number, cId?: number) {

    const countryArray: any = [];
    return this.customerService
      .getShippingLocationsByCustomerId(bId, cId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {

            if (data) {
              this.shipToData = data;
              this.shipToData.forEach(objCountry => {
                if (this.countries) {
                  const countryObj = this.countries.find(c => {
                    return c.id == objCountry.countryOfOriginId;
                  });
                  countryArray.push(countryObj);
                }

              });
              const index: number = countryArray.indexOf('undefined');
            
              if (index !== -1) {
                countryArray.splice(index, 1);
            } 
              this.originCountryData = countryArray;


            }



          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  getCountry() {
    return this.commonService.getCountries((data: any) => {
      this.countries = data;
      this.getCurrency();
    }, (error: any) => {
      console.log('get countries:', error)
    });

  }

  getShippingMethod() {
    return this.customerService
      .getShippingMethod()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.shipping = data;
        }
      });
  }

  getContactById(id?: number) {
    return this.customerService
      .getContactById(id)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.getContactNumber = data;
          this.form.controls['contactDetails'].setValue(this.getContactNumber.phone);

        }
      });
  }

  getShippingType() {
    return this.customerService
      .getShippingType()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.shippingType = data;
        }
      });
  }

  getProductsByCustomerId(cId?:number) {
    this.delay(1000);
    return this.productService
      .getProductsByCustomerId(cId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.products = data;
            if (!this.isPatchComplete) {
              this.isPatchComplete = true;
              this.patchFormValues(this.ordersData);
            }
          }
        },
        err => {
          this.showMessage(err);
        }
      );
  }

  removeField(key: number) {
    this.orderPrize.removeAt(key);
  }
  newPerson(): FormGroup {
    return this.fb.group({
      itemId: '',
      itemName: ['', RxwebValidators.required()],
      size: ['', RxwebValidators.required()],
      cartons: ['', RxwebValidators.required()],
      pieces: ['', RxwebValidators.required()],
      price: 0.00,
      currency: '',
      prizeCartan: '',
      totalValue: ''
    })
  }
  addMoreField() {
    this.orderPrize.push(this.newPerson());
  }

  getSizesVariations() {
    return this.commonService
      .getSizesVariations(
        data => {
          if (data) {
            this.veriations = data;
          }
        });
  }
  openAddProductsModal(singleProduct) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;

    this.addProdcutModal = this.dialog.open(AddProductsDailogComponent, {
      data: {
        orderPrizeArray: orderPrizeArray,
        products: this.products,
        singleProduct,
        veriations: this.veriations,
        packingSpecificationsProperties: this.packingSpecificationsProperties,
        getCurrencyName: this.getCurrencyName()
      }
    });

    this.addProdcutModal.afterClosed().subscribe((dataObj) => {
      const data = dataObj ? dataObj.data : '';
      const productId = dataObj ? dataObj.productId : '';

      if (data && data.length > 0) {

        if (orderPrizeArray && orderPrizeArray.length > 0) {
          let variantsKeys = [];
          orderPrizeArray.forEach((k, key) => {
            if (k.itemName === productId) {
              variantsKeys.push(key);
            }
          });
          variantsKeys = variantsKeys.reverse();
          variantsKeys.forEach(k => this.orderPrize.removeAt(parseInt(k)));

        }

        setTimeout(() => {
          data.forEach(veration => {
            const obj = this.fb.group({
              ...veration,
              itemName: [veration.itemName, RxwebValidators.required()],
              size: [veration.size, RxwebValidators.required()],
              cartons: [veration.cartons, RxwebValidators.required()],
            })
            this.orderPrize.push(obj);
          });
        }, 0);
      }
    });
  }

  getProductVariants(index) {
    const products = this.products;
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const pId = orderPrizeArray[index] ? orderPrizeArray[index].itemName : '';
    let v = [];
    const product = products.find(p => p.id === pId);
    if (product && product.productVariations) {
      v = product.productVariations;
    }
    return v;
  }

  checkNumberValidation(e, name, index) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.orderPrize.controls[index].patchValue({
      [name]: val
    });
  }

  checkDecimalValidation(e, name, index) {
    const val = Utils.decimalValidation(e.target.value);
    this.orderPrize.controls[index].patchValue({
      [name]: val
    });
  }

  twoDecimal(e, name, index) {
    let value = e.target.value;
    value = value ? parseFloat(value).toFixed(2) : 0;
    this.orderPrize.controls[index].patchValue({
      [name]: value
    });
  }
  backToOrderDetail(){
    this.router.navigate(['/order-details', { orderId: this.orderId }]);
  }
}
