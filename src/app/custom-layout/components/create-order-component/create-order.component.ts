import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import expandLess from '@iconify/icons-ic/expand-less';
import expandMore from '@iconify/icons-ic/expand-more';
import icSearch from '@iconify/icons-ic/search';
import icAdd from '@iconify/icons-ic/add';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { AlertService } from '../../alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { CustomerService } from '../../_services/customer.service';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../_services/product.service';
import { OrderService } from '../../_services/orders.service';
import * as _ from "underscore";
import { AllOrders } from '../order-components/models/allorders.model';
import { formatDate, DecimalPipe } from '@angular/common';
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from '../../_services/common.service';
import { AddProductsDailogComponent } from "../../../custom-layout/components/common/add-products-dailog/add-products-dailog.component";
import { MatDialog } from '@angular/material';
import Utils from '../../_utils/utils';
import * as moment from 'moment'; 
import { RxFormBuilder, FormBuilderConfiguration, RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class CreateOrderComponent implements OnInit {
  @Input() controlName: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  public show: boolean = false;
  public buttonName: any = 'Show addtional Information';

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

  showLoader = false;
  serverData = [];
  subTotal: number;
  customerData: any;
  branchData: any;
  countries: any;
  currency: any;
  contacts: any;
  veriations: any;
  shipToData: any;
  getContactNumber: any;
  transShipmentData: any;
  locationType: any;

  products: any;
  varitions: any;
  variationName: any;

  getData: any;

  orderId: any;
  isPatchComplete: boolean = false;
  setform: any;
  piecesObj: any = {};
  prizesObj: any = {};

  sizeSpecificationProperties: any = [];
  cartonSpecificationProperties: any = [];
  packingSpecificationsProperties: any = [];

  addProdcutModal: any;

  NewPiecesVal: any;
  total: any;
  updateCreateDisabled = true;
  breadcrumbsParams:any;
  firstApiLoaded: boolean =  false;   
  secondApiLoaded: boolean =  false;  
  thirdApiLoaded: boolean =  false;  
  forthApiLoaded: boolean =  false;

  // static values 
  qualityAssuranceStandardValues: any = [];
  inspectionLevelValues: any = [];
  aqlValues: any = [];
  shippingMethodValues: any = [];
  shippingTypeValues: any = [];
  cleanroomClassValues: any = [];
  anionValues: any = [];
  cationValues: any = [];
  proteinPowderContentValues: any = [];
  colorimeterValues: any = [];
  referencedStandardValues: any = [];
  ageingStateValues: any = [];
  ageingValues: any = [];
  pieceTypeValues: any = [];
  boxTypeValues: any = [];

  keyword = "name";

  constructor(//@Inject(MAT_DIALOG_DATA) public defaults: any,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private commonService: CommonService,
    private titleService: Title,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private decimalPipe: DecimalPipe,
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.titleService.setTitle("Orders");
    
   
    this.getPropertyTypes();
    this.getCustomer();
    this.getCountry();
    this.getAllStaticProperties();

    if (this.orderId) {
      this.show = true;
      setTimeout(() => {
        this.getOrdersById(this.orderId);
      }, 1000);
      this.checkAllApi();
    }else{
      this.breadcrumbsParams = [
        {title: 'Orders', url: '/order-view'},
        {title: 'Create Order', url: '',isActive: true}
      ];
    }    

  }

  checkAllApi() {
    const delayTime = 500;
    let count = 0;
    const intervalId = setInterval(() => {
        if (this.firstApiLoaded && this.secondApiLoaded && this.thirdApiLoaded) {
          this.form.patchValue({
              shippingType: this.getData.shippingType,
              contactPerson: parseInt(this.getData.contactPerson),
              originOfGoods: parseInt(this.getData.originOfGoods),
              deliveryTerms: this.getData.deliveryTerms
          });
          this.showLoader = false;
          clearInterval(intervalId);
        }
        if (count > 100) {
          clearInterval(intervalId);
        }
        count++;
    }, delayTime);
  }

  ngOnInit() {

    if (this.orderId) {
      this.mode = 'update';


    } else {
      // this.getData = {} as AllOrders;

    }
    const currentDate = new Date();
    this.form = this.fb.group({

      id: this.orderId ? this.orderId : new FormControl(''),
      customer: ['', RxwebValidators.required()],
      fromPort: ['Port Klang', RxwebValidators.required()],
      poNumber: '',
      branch: [{ value: '', disabled: true }, RxwebValidators.required()],
      piNumber: ['', RxwebValidators.required()],
      piNumber2: '',
      piNumber3: formatDate(new Date(), 'yyyy', 'en'),
      piNumber4: '1',

      poDate: new FormControl('') || '',
      shipTo: { value: new FormControl(''), disabled: true },
      piDate: [this.currentDate(), RxwebValidators.required()],
      currency: new FormControl('') || '',
      country: 132,
      shipmentDate: new FormControl('') || '',
      orderPrize: this.fb.array([]) || [],
      paymentTerms: new FormControl('') || '',
      specialClause: new FormControl('') || '',
      shipBy: new FormControl('') || '',

      contactPerson: new FormControl('') || '',
      deliveryTerms: new FormControl('') || '',
      isTranshipmentAllowed: new FormControl('') || '',
      contactDetails: '',
      originOfGoods: new FormControl('') || '',
      shippingType: new FormControl('') || '',
      // contactDetails: [{value: new FormControl('') ,  disabled: true}] || [{value: '',  disabled: true}],
    });

    // this.form.controls['orderPrize'].valueChanges.subscribe(value => {
    //   value.forEach(el => {
    //     this.NewPiecesVal = el.cartons;
    //     this.total = this.totalAmount(el.cartons, el.price);
    //   })

    // });
    // this.form.setControl('piNumber3', this.NewPiecesVal);
    //this.NewPiecesVal =  this.form.value;


    //  this.form.controls['id'].setValue(this.getData.id);
    //  this.form.controls['customer'].setValue(this.getData.customerId);

    //this.data();

  }
  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }
  get piNumber(): any { return this.form.get('piNumber'); }
  get orderPrize() {
    return this.form.get("orderPrize") as FormArray;
  }
  save() {
    if (this.mode === 'create') {
      this.createOrder();
    } else if (this.mode === 'update') {
      this.updateOrder();
    }
  }

  async createOrder() {
    const customer = this.form.value;
    const getdata = this.getData;

    this.delay(200);
    return this.orderService
      .addUpdateOrder(customer, getdata)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.getCustomer();
            this.showMessage('order add successfully');
            setTimeout(() => {
              this.router.navigate(["/order-details", {orderId: data["id"]}]);
            }, 0);
            
          }
        },
        err => {
          let error = err;
          if (err.description) {
            error = err.description;
          }
          this.showMessage(error);
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


  async updateOrder() {
    const getdata = this.getData;
    const customer = this.form.value;
    customer.id = customer.id;
    this.delay(200);
    return await this.orderService
      .addUpdateOrder(customer, getdata)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {

            const piNumber4 = this.form.value.piNumber4;
            let updatedCount = 1;
            if (piNumber4 && piNumber4 !== 'undefined' && piNumber4 !== 'NaN') {
              updatedCount = (parseInt(piNumber4) + 1);
            }
            this.form.patchValue({piNumber4: updatedCount})
            this.showMessage('order updated successfully');
            setTimeout(() => {
              this.router.navigate(["/order-details", {orderId: this.orderId}]);
            }, 0);
          }
        },
        err => {
          let error = err;
          if (err.description) {
            error = err.description;
          }
          this.showMessage(error);
        }
      );
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  newItem(): FormGroup {
    return this.fb.group({
      itemId: '',
      itemName: ['', RxwebValidators.required()],
      size: ['', RxwebValidators.required()],
      cartons: ['', RxwebValidators.required()],
      pieces: '',
      price: ['0.00', RxwebValidators.required()],
      currency: '',
      prizeCartan: '',
      totalValue: '',
      productName: ''
    })
  }
  addMoreField() {
    // if (!this.serverData) {
    //   this.serverData = [];
    // }
    // this.serverData.push({
    //   itemId: '',
    //   itemName: '',
    //   size: '',
    //   cartons: '',
    //   pieces:'',
    //   price: '0.00',
    //   currency: '',
    //   prizeCartan: '',
    //   totalValue: ''
    // });
    this.orderPrize.push(this.newItem());
  }

  removeField(key: number) {
    this.orderPrize.removeAt(key);
  }

  totalCounts(data) {
    let total = 0;
    data.forEach((d) => {
      if (d.price) {
        total += parseInt(d.price, 10);
      }
    });
    return total;
  }

  totalAmount(cartons: number, price: number) {

    let total = 0;
    total += (cartons * price);
    return total;
  }
  getTotalAmount() {
    if (this.serverData) {
      return this.serverData.map(t => (t.cartons * t.price)).reduce((a, value) => a + value, 0);
    }
    return 0;
  }
  getTotalPieces() {
    if (this.serverData) {
      return this.serverData.map(t => t.pieces).reduce((a, value) => a + value, 0);
    }
    return 0;
  }

  getTotalCartan() {
    if (this.serverData) {
      return this.serverData.map(t => t.cartons).reduce((a, value) => a + value, 0);
    }
    return 0;
  }
  toggleExtraField() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Hide addtional Information";
    else
      this.buttonName = "Show addtional Information";
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
            this.getBranchByCustomerById(this.getData.customerId);
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  patchFormValues() {
   

    this.breadcrumbsParams = [
      {title: 'Orders', url: '/order-view'},
      {title: this.getData.proformaInvoiceNo, paramsUrl: '/order-details', query: [{orderId: this.orderId}] , isActive: false},
      {title: 'Edit Order', url: '', isActive: true},
    ];

    this.form.patchValue({
      id: this.getData.id ? this.getData.id : '',
      customer: this.getData.customerId ? this.getData.customerId : '',
      poNumber: this.getData.orderNo || '',
      branch: this.getData.customerBranchId,
      piNumber: this.getData.proformaInvoiceNo,

      poDate: this.getData.orderDate,
      shipTo: this.getData.shippingLocationId,
      piDate: this.getData.proformaInvoiceDate,
      currency: this.getData.currencyId,
      country: this.getData.countryId,
      shipmentDate: this.getData.shipmentDate,
      paymentTerms: this.getData.paymentTerms,
      specialClause: this.getData.specialClause || '',
      fromPort: this.getData.fromPort,
      shipBy: this.getData.shipBy,

      isTranshipmentAllowed: this.getData.isTranshipmentAllowed,
      contactDetails: this.getData.contactDetails,
      

    });

    if (this.getData.orderProducts) {
      const orderProducts = Utils.sortProductsByVariant(this.getData.orderProducts, this.products);      

      orderProducts.forEach((veration, index) => {
        const isProduct = this.products.find(p => p.id == veration.productId)
        let obj = this.fb.group({
          itemId: veration.id ? veration.id : '',
          itemName: veration.productId ? veration.productId : '',
          size: veration.productVariationId ? veration.productVariationId : '',
          cartons: veration.quantity ? veration.quantity : '',
          price: veration.unitPrice ? parseFloat(veration.unitPrice).toFixed(2) : 0.00,
          currency: '',
          prizeCartan: veration.unitPrice,
          totalValue: '', // this.totalAmount( veration.unitPrice ,veration.quantity )
          pieces: '',
          productName: isProduct ? isProduct.name : ''
        })

        this.orderPrize.push(obj);
        this.onFieldChange(veration.quantity, index, 'cartons');
      });
      if (this.orderPrize) {
        this.updateCreateDisabled = false;
      }

    }


    this.updateCreateDisabled = false;
  }

  async getCustomer() {
    //this.alertService.warning('Please wait data will be load soon.');
    this.delay(1000);
    return await this.customerService
      .getCustomer()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            const customers = _.sortBy(data, 'name');
            this.customerData = customers;
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  getBranchByCustomerById(cId?: number) {
    const customer = this.customerData ? this.customerData.find(c => c.id === cId) : '';
    if (customer && customer.hasBranch) {
      this.form.controls['branch'].enable();
    } else {
      this.form.controls['branch'].disable();
    }
    if (cId) {
      this.getContactPerson(cId); // get by contact person id
      this.getShipToByBranchId(null, cId);
      this.getProductsByCustomerId(cId);
    }

    return this.customerService
      .getBranchesByCustomerId(cId)
      .pipe(first())
      .subscribe(
        data => {
          const branchData:any = data;
          if (branchData && branchData.length > 0) {
            this.branchData = _.sortBy(branchData, 'name');
          } else {
            this.branchData = [];
            this.getContactPerson(cId, 'no-branch');
          }

        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getCountry() {
    return this.commonService
      .getCountries(data => {
        if (data) {
          this.countries = data;
          this.getCurrency();
          this.getSizesVariations();
        }
      });
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

  getContactPerson(cId?: number, isBranch?: any) {    
    return this.customerService
      .getContactPerson(cId)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.firstApiLoaded = true;
          this.contacts = data;
          if (isBranch === 'no-branch' && this.contacts && this.contacts.length > 0) {
            this.patchContactPerson();
          }
        }
      });
  }

  getProductsByCustomerId(cId?:number) {
    this.delay(1000);
    return this.productService
      .getProductsByCustomerId(cId)
      .pipe(first())
      .subscribe(
        (data:any) => {
          if (data) {
            this.products = _.sortBy(data, 'name');
            if (this.orderId && !this.isPatchComplete) {
              this.isPatchComplete = true;
              this.patchFormValues();
            }
          }
        },
        err => {
          this.showMessage(err);
        }
      );
  }

  getSizeName(variationNameid?: number) {
    if (this.veriations)
      this.variationName = this.veriations.find(elm => elm.id == variationNameid);
      return this.variationName = this.variationName.name ? this.variationName.name : '';
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

  patchContactPerson(bId?: any) {
    if (this.contacts) {
      let selectedBranchPrimaryContact:any = {};
      if (bId) {
        selectedBranchPrimaryContact = this.contacts.find(f => f.branchId === bId && f.isPrimary)
      } else {
        selectedBranchPrimaryContact = this.contacts.find(f => f.isPrimary)
      }
      if (selectedBranchPrimaryContact)
        this.form.patchValue({contactPerson: selectedBranchPrimaryContact.id, contactDetails: selectedBranchPrimaryContact.phone});
    }
  }

  getShipToByBranchId(bId?: number, cId?: number) {
    this.patchContactPerson(bId);
    let countryArray:any = [];
    return this.customerService
      .getShippingLocationsByCustomerId(bId, cId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {

            if (data) {
              this.shipToData = _.sortBy(data,'name');
              this.form.controls['shipTo'].enable();
              this.secondApiLoaded = true;
              
            } else {
              this.shipToData = [];
              this.form.controls['shipTo'].disable();
            }



          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  getCustomerAddressById(id?: number) {
    return this.customerService
      .getCustomerAddressById(id)
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.transShipmentData = data;
          this.form.patchValue({
            shipBy:this.transShipmentData.shipBy,
            currency: this.transShipmentData.currencyId,
            country: this.transShipmentData.countryId,
            isTranshipmentAllowed: this.transShipmentData.isTranshipmentAllowed,
            shippingType: this.transShipmentData.shippingType,
            originOfGoods: this.transShipmentData.countryOfOriginId,
            deliveryTerms: this.transShipmentData.deliveryTerms ? this.transShipmentData.deliveryTerms : ''
          });
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

  onChangePoNumber(value: any) {
    // this.form.patchValue({
    //   piNumber3: value,
    // });
  }

  getVariationById(pId?: number, index?: number) {

    const selectedRowProduct = this.form.value.orderPrize[index];
    this.orderPrize.controls[index].patchValue({itemName: pId});

    const singleProduct:any = this.products.find(p => p.id === pId);

    if (!_.isEmpty(singleProduct)) {
      this.openAddProductsModal(singleProduct);
      if (selectedRowProduct.itemName !== singleProduct.id) {
        this.resetProductListValues(index);
      }
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

  onFieldChange(value, index, action) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;
    const selectedRow = orderPrizeArray[index];
    const selectedRowProduct:any = this.products.find(p => p.id === selectedRow.itemName);
    const varitionsArray = selectedRowProduct && selectedRowProduct.productVariations ? selectedRowProduct.productVariations : [];
    const productProperties = selectedRowProduct && selectedRowProduct.productProperties ? selectedRowProduct.productProperties : [];
    const packingSpecificationsProperties = this.packingSpecificationsProperties;
    const orderPrize = this.form.value.orderPrize[index];
    let packingSpecData:any = [];
    let pcsCarton:any = 0;
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
          if (f && f.data && f.data.value === vData.variationId) {
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
        let selectedProduct:any = {};
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

                if (f && f.data && f.data.value && vData && f.data.value=== vData.variationId) {
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
      cartons: '',
      productName: null
    })
  }

  getCurrencyName() {
    const cId = this.form.get('currency').value;
    let currencyObj:any = '';
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

  openAddProductsModal(singleProduct) {
    const formValues = this.form.value;
    const orderPrizeArray = formValues.orderPrize;

    this.addProdcutModal = this.dialog.open(AddProductsDailogComponent,{
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
            if (k.itemName === productId){
              variantsKeys.push(key);              
            }
          });
          variantsKeys = variantsKeys.reverse();
          variantsKeys.forEach(k => this.orderPrize.removeAt(parseInt(k)));
          
        }

        setTimeout(() => {
          data.forEach(veration => {  
            const product = this.products.find(p => p.id == veration.itemName);
            const obj = this.fb.group({
              ...veration,
              itemName: [veration.itemName, RxwebValidators.required()],
              size: [veration.size, RxwebValidators.required()],
              cartons: [veration.cartons, RxwebValidators.required()],
              productName: product ? product.name : ''
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
      v = _.sortBy(product.productVariations, 'variationId');
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
    let value = e.target.value;
    // value = value.replace(",", "");
    // value = value ? value : 0;
    // console.log('value >>', value)
    let val = Utils.decimalValidation(value);
    // val = val ? parseFloat(val) : 0;
    // console.log('val >>', val)
    // val = this.decimalPipe.transform(val, '1.2-2');
    // console.log('val2 >>', val)
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
  backToOrder(){
    if (this.orderId) {
      this.router.navigate(["/order-details", {orderId: this.orderId}]);
    } else {
      this.router.navigate(['/order-view']);
    }
  }

  async getAllStaticProperties() {
    return await this.commonService
      .getAllStaticProperties(
        data => {
          if (data) {            
            this.arrangeStaticProperties(data);            
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  arrangeStaticProperties(data) {
    this.qualityAssuranceStandardValues = Utils.getStaticValueByKey(data, 'QualityAssuranceStandard');
    this.inspectionLevelValues = Utils.getStaticValueByKey(data, 'InspectionLevel');
    this.aqlValues = Utils.getStaticValueByKey(data, 'AQL');
    this.shippingMethodValues = Utils.getStaticValueByKey(data, 'ShippingMethod');
    this.shippingTypeValues = Utils.getStaticValueByKey(data, 'ShippingType');
    this.cleanroomClassValues = Utils.getStaticValueByKey(data, 'CleanroomClass');
    this.anionValues = Utils.getStaticValueByKey(data, 'Anion');
    this.cationValues = Utils.getStaticValueByKey(data, 'Cation');
    this.proteinPowderContentValues = Utils.getStaticValueByKey(data, 'ProteinPowderContent');
    this.colorimeterValues = Utils.getStaticValueByKey(data, 'Colorimeter');
    this.referencedStandardValues = Utils.getStaticValueByKey(data, 'ReferencedStandard');
    this.ageingStateValues = Utils.getStaticValueByKey(data, 'AgeingState');
    this.ageingValues = Utils.getStaticValueByKey(data, 'Ageing');
    this.pieceTypeValues = Utils.getStaticValueByKey(data, 'PieceType');
    this.boxTypeValues = Utils.getStaticValueByKey(data, 'BoxType');
    this.thirdApiLoaded = true;
  }

  
}
