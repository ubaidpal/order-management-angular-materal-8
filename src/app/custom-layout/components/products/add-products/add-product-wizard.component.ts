import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import icDescription from "@iconify/icons-ic/twotone-description";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icArrowBack from "@iconify/icons-ic/arrow-back";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icFile from "@iconify/icons-ic/twotone-insert-drive-file";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import theme from "src/@vex/utils/tailwindcss";
import { Title, disableDebugTools } from "@angular/platform-browser";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icAdd from "@iconify/icons-ic/twotone-add";
import { iconsFA } from "../../../../../static-data/icons-fa";
import { Router, ActivatedRoute } from "@angular/router";
import { ColorDef } from "src/@vex/utils/tailwindcss.interface";

import { Product, IonPoint } from "../interfaces/product";
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import { ProductService } from 'src/app/custom-layout/_services/product.service';
import { first } from 'rxjs/operators';
import Utils from 'src/app/custom-layout/_utils/utils';
import { ObservedValuesFromArray } from 'rxjs';
import * as _ from "underscore";
import { CommonService } from 'src/app/custom-layout/_services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: "add-form-wizard",
  templateUrl: "./add-product-wizard.component.html",
  styleUrls: ["./add-product-wizard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms]
})
export class AddProductWizardComponent implements OnInit {
  layoutCtrl = new FormControl("boxed");

  //@ViewChild('customerId') searchElement: ElementRef;

  @Input() color: ColorDef;

  public showCustomer: boolean = false;
  public showQA: boolean = false;
  public showPP: boolean = false;
  public showPhysical: boolean = false;
  public showColorMeter: boolean = false;
  public showCleanRoom: boolean = false;
  public showBigSlipsheet: boolean = true;
  public showSmallSlipsheet: boolean = true;
  public showFumigatedPallets: boolean = true;

  public customerTitle: any =
    "Set up your product details for identification purposes.";
  public multiCustomer: any = "Does this product have multiple customers?";
  public qAName: any = "Does this product have quality assurance standards?";
  public ppName: any = "Does this product have Protein & Powder Content?";
  public pPhsicalName: any = "Does this product have Physical Properties?";
  public pColorMeterName: any =
    "Does this product have Colorimeter Reading Specifications?";
  public pcleanRoomName: any =
    "Does this product have Cleanroom Specifications?";

  public showTensile: any = [];
  public showMinMaxTar: any = [];
  public showForceAtBreak: any = [];

  breadcrumbsParams:any = [
    {title: 'Products', url: '/product'},
    {title: 'Create Product', url: '/add-product', isActive: true}
  ];

  selectedTab = new FormControl(0);


  showTitleMultipleCustomer = true;
  showTitleQualityAssuranceStandard = true;
  showTitleProteinAndPowderCotent = true;
  showTitlePhysicalProperties = true;
  showTitleColorimeterReadingSpecifications = true;
  showTitleCleanroomSpecifications = true;

  accountFormGroup: FormGroup;
  variantsFormGroup: FormGroup;
  packingDetailsFormGroup: FormGroup;
  loanPlanFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  loadPlanFormGroup: FormGroup;
  confirmFormGroup: FormGroup;

  verticalAccountFormGroup: FormGroup;
  verticalPasswordFormGroup: FormGroup;
  verticalConfirmFormGroup: FormGroup;

  singleProductData: any;
  isUpdateView: boolean = false;

  phonePrefixOptions = ["+1", "+27", "+44", "+49", "+61", "+91"];

  passwordInputType = "password";

  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icArrowBack = icArrowBack;
  icDelete = icDelete;
  icTrash = iconsFA.trash;
  theme = theme;
  icFile = icFile;
  icAdd = icAdd;


  // static values
  shippingMethodValues:any = [];
  shippingTypeValues:any = [];
  cleanroomClassValues:any = [];
  anionValues:any = [];
  cationValues:any = [];
  qualityAssuranceStandardValues:any = [];
  proteinPowderContentValues:any = [];
  colorimeterValues:any = [];
  referencedStandardValues:any = [];
  inspectionLevelValues:any = [];
  aqlValues:any = [];
  ageingStateValues:any = [];
  ageingValues:any = [];
  pieceTypeValues:any = [];
  boxTypeValues:any = [];


  ion_points: any = [];
  ion_cartons: any = [];
  eTypeOption: any = [
    { value: "Tensile (MPa)", text: "Tensile (MPa)" },
    { value: "Elongation (%)", text: "Elongation (%)" }
  ];
  allPropertiesType: any;
  allProperties: any;
  customerData: any;
  productCategoriesData: any;
  sizesVariationsData: any;
  brandData: any;
  colorData: any;
  gripData: any;
  materialData: any;
  textureData: any;
  donningData: any;
  configrationData: any;
  setVarient: any;
  sizeSpecificationProperties: any;

  cartonSpecificationProperties: any;
  packingSpecificationsProperties: any;
  typeConfigurationProperties: any;
  formerTypeProperties: any;
  miscellaneousTypeProperties: any;
  thicknessProperties: any;
  loadPlanProperties: any;
  staticPackingMaterials: any = [];

  firstApiLoaded = false;
  secondApiLoaded = false;
  thirdApiLoaded = false;
  forthApiLoaded = false;
  fifthApiLoaded = false;
  showLoader: boolean = false;
  showBrandLoader: boolean = false;

  disableEditButton = true;

  newmergeData: any=[];
  submitted=false;

  disabled = false;
  limitSelection = false;
  customerDataMulti: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 100,
    allowSearchFilter: true,
    clearSearchFilter: true
  };
  sizeDropdownSettings: any = {
    singleSelection: false,
    idField: 'value',
    textField: 'display',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 100,
    allowSearchFilter: true,
    clearSearchFilter: true
  }

  showMultiSelect = false;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,

    private customerService: CustomerService,
    private productService: ProductService,
    private commonService: CommonService,
    private alertService: AlertService,

    private el: ElementRef

  ) {
    this.titleService.setTitle("Add Product");
    
    const oldVersion = Utils.getLocalStorage('api_version');
    const newVersion = Utils.newLocalApiVersion();
    if (oldVersion !== newVersion) {
      Utils.resetLocalStorageItems();
      Utils.setLocalStorage('api_version', newVersion);
      this.commonService.callAllStaticApi();
    }

    this.getCustomer();
    this.getPropertyTypes();
    this.getProductCategories();
    this.getSizesVariations();
  }

  // Variants
  sizeSpecificationsFields = {
    lengthMin: "",
    lengthMax: "",
    lengthTarget: "",
    widthMin: "",
    widthMax: "",
    widthTarget: "",
    weightMin: "",
    weightMax: "",
    weightTarget: ""
  };
  sizeSpecificationsArray: any = [];
  
  thicknessFields = {
    min: "",
    target: "",
    max: ""
  };
  thicknessArray = [
    this.fieldsGroup(this.thicknessFields, "Cuff", ""),
    this.fieldsGroup(this.thicknessFields, "Palm", ""),
    this.fieldsGroup(this.thicknessFields, "Fingertip", "")
  ];

  // Packing Details
  cartoonSpecificationsFields = {
    length: "",
    width: "",
    height: "",
    volume: "",
    weight: ""
  };
  cartoonSpecificationsArray: any = [];
  // cartoonSpecificationsArray  = [
  //   this.fieldsGroup(this.cartoonSpecificationsFields, "X-Small"),
  // ];
  packingSpecificationsFields = {
    pcsBox: "",
    pieceType: "Pieces",
    boxType: "",
    boxCarton: "",
    cartonType: "Carton",
    pcsCarton: ""
  };
  packingSpecificationsArray: any = [];
  // packingSpecificationsArray = [
  //   this.fieldsGroup(this.packingSpecificationsFields, "X-Small"),
  //   this.fieldsGroup(this.packingSpecificationsFields, "Small"),
  //   this.fieldsGroup(this.packingSpecificationsFields, "Medium"),
  //   this.fieldsGroup(this.packingSpecificationsFields, "Large"),
  //   this.fieldsGroup(this.packingSpecificationsFields, "X-Large")
  // ];
  packingInstructionsFields = {
    description: ""
  };
  packingInstructionsArray = [
    this.fb.group({...this.packingInstructionsFields})
  ];

  // Load Plan
  bigSlipsheetFields = {
    floor: "",
    top: "",
    lastRowFloor: "",
    lastRowTop: ""
  };
  bigSlipsheetArray = [
    this.fieldsGroup(this.bigSlipsheetFields, "40ft HC Container", ""),
    this.fieldsGroup(this.bigSlipsheetFields, "40ft Container", ""),
    this.fieldsGroup(this.bigSlipsheetFields, "20ft Container", "")
  ];
  smallSlipsheetFields = {
    floor: "",
    top: "",
    lastRowFloor: "",
    lastRowTop: ""
  };
  smallSlipsheetArray = [
    this.fieldsGroup(this.smallSlipsheetFields, "40ft HC Container", ""),
    this.fieldsGroup(this.smallSlipsheetFields, "40ft Container", ""),
    this.fieldsGroup(this.smallSlipsheetFields, "20ft Container", "")
  ];
  fumigatedPalletsFields = {
    floor: "",
    top: "",
    lastRowFloor: "",
    lastRowTop: ""
  };
  fumigatedPalletsArray = [
    this.fieldsGroup(this.fumigatedPalletsFields, "40ft HC Container", ""),
    this.fieldsGroup(this.fumigatedPalletsFields, "40ft Container", ""),
    this.fieldsGroup(this.fumigatedPalletsFields, "20ft Container", "")
  ];

  fieldsGroup(fields, title, data) {
    const obj = {
      ...fields,
      title
    };
    if (data) {
      obj.data = data;
    }
    return this.fb.group(obj);
  }

  ngOnInit() {
    /**
     * Horizontal Stepper
     * @type {FormGroup}
     */


    this.getAllStaticProperties();
    this.getStaticPackingMaterials();
    this.activatedRoute.paramMap.subscribe(params => {
      const productId = params.get("productId");
      if (productId) {
        this.isUpdateView = true;
        this.breadcrumbsParams = [{title: 'Products', url: '/update-product'}];
        this.getProductById(productId);
        this.getAllProperties();
        this.checkAllApi();
      } else {
        this.showMultiSelect = true;
      }
    });

    // this.activatedRoute.paramMap.pipe(
    //   switchMap((params) => {

    //   })
    // )

    this.variantsFormGroup = this.fb.group({
      specifications_sizes: this.fb.array(this.sizeSpecificationsArray) || [],
      variants_thickness: this.fb.array(this.thicknessArray) || []
    });

    this.packingDetailsFormGroup = this.fb.group({
      cartoon_specifications:
        this.fb.array(this.cartoonSpecificationsArray) || [],
      packing_specifications:
        this.fb.array(this.packingSpecificationsArray) || [],
      packing_instructions: this.fb.array(this.packingInstructionsArray) || []
    });



    this.loanPlanFormGroup = this.fb.group({
      big_slipsheet: this.fb.array(this.bigSlipsheetArray) || [],
      small_slipsheet: this.fb.array(this.smallSlipsheetArray) || [],
      fumigated_pallets: this.fb.array(this.fumigatedPalletsArray) || [],
      bigSlipCheckbox: true,
      smallSlipCheckbox: true,
      fumigatedCheckbox: true,
    });
    this.accountFormGroup = this.fb.group({
      customerId: [null,Validators.required], // Validators.required
      pName: [null,Validators.required], // Validators.required
      productCategoryId: [null], // Validators.required
      brandName: [{value: null, disabled: true}],
      brandCode: {value: null, disabled: true},
      sizes: new FormControl([],[Validators.required]),
      color: [null], // Validators.required
      texture: [null], // Validators.required
      material: [null], // Validators.required
      packingMaterialId: [null],
      typeConfig: [null], // Validators.required
      coatingDonning: [null], // Validators.required
      coatingGrip: [null], // Validators.required
      unitPrice: [null,Validators.required], // Validators.required
      formerType: [null], // Validators.required
      productCodeL: [null ,Validators.required], // Validators.required
      productCodeS: [null], // Validators.required
      productCodeC: [null], // Validators.required
      productCodeT: [null], // Validators.required
      productCodeSize: [null], // Validators.required
      productCodeWidth: [null], // Validators.required
      productCodeCr: [null], // Validators.required
      staticPowderContent: [null],
      totalLength: [null],

      multipleCustomer: [this.selectedItems],
      multipleCustomers: [this.selectedItems],

      hasMultipleCustomer: false,
      hasQualityAssuranceStandard: false,
      hasProteinAndPowderCotent: false,
      hasPhysicalProperties: false,
      hasColorimeterReadingSpecifications: false,
      hasCleanroomSpecifications: false,

      bName: null,

      qualityAssuranceStandardFields: this.fb.array([]),
      proteinPowderContentFields: this.fb.array([]),
      phsical_propertise:
        this.fb.array([
          this.fb.group({ ref: "", agigingType: "", tEtype: "",  }) //forceAtBreak: '', max: '', min: '', tar: ''
        ]) || [],
      colorimeterSpecificationsFields: this.fb.array([]),
      cleanRoomSpecificationsFields: this.fb.group({ class: "", nonVolatile: "", silicon: "",  }),

      ion_points:
        this.fb.array([this.fb.group({ anion: "", count: "" })]) || [],
      ion_cartons:
        this.fb.array([this.fb.group({ cations: "", count: "" })]) || [],

      chracterstics: null,
      charLevelSizes: "s-2",
      charAql: "4.0",

      phsPropertise: [{
        value: 'Physical Properties',
        disabled: true
      }],
      phLevelSizes: "s-2",
      phAql: "4.0",

      waterTight: [{
        value: "Water Tight",
        disabled: true
      }],
      waterSizes: "g-1",
      waterAql: "0.65",

      visualProperty: [{
        value: "Visual Defect (Major)",
        disabled: true
      }],
      visualSizes: "g-1",
      visualAql: "2.5",

      visualDefectMinorProperty: [{
        value: "Visual Defect (Minor)",
        disabled: true
      }],
      visualDefactMinorSizes: "g-1",
      visualDefactMonorAql: "4.0",

      citicalDefectProperty: [{
        value: "Critical Defect",
        disabled: true
      }],
      citicalDefectLevel: "g-1",
      citicalDefectAql: "4.0",

      protainContent: [{
        value: "Protein Content",
        disabled: true
      }],
      protainReferencceStandard: "astm-d-6319",
      protainAmount: [{
        value: "2 (max)",
        disabled: true
      }],

      powderContent: [{
        value: "Powder Content",
        disabled: true
      }],
      powderReferencceStandard: "astm-d-5712",
      powderAmount: [{
        value: "N/A",
        disabled: true
      }],

      lValue: [{
        value: "L-Value",
        disabled: true
      }],
      lValueMinimum: null,
      lValueTarget: null,
      lValueMaximum: null,

      AValue: [{
        value: "A-Value",
        disabled: true
      }],
      AValueMinimum: null,
      AValueTarget: null,
      AValueMaximum: null,

      

      BValue: [{
        value: "B-Value",
        disabled: true
      }],
      BValueMinimum: null,
      BValueTarget: null,
      BValueMaximum: null,

      nonVolatile: null,
      silicon: null,
      

      // username: [null, Validators.required],
      // name: [null, Validators.required],
      // email: [null, Validators.required],
      // phonePrefix: [this.phonePrefixOptions[3]],
      // phone: [],

    });

    this.accountFormGroup.get("chracterstics").disable();

    this.passwordFormGroup = this.fb.group({
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      passwordConfirm: [null, Validators.required]
    });

    this.loadPlanFormGroup = this.fb.group({
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      passwordConfirm: [null, Validators.required]
    });

    this.confirmFormGroup = this.fb.group({
      terms: [null, Validators.requiredTrue]
    });


    
    // this.dropdownSettings:IDropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };

    // /**
    //  * Vertical Stepper
    //  * @type {FormGroup}
    //  */
    // this.verticalAccountFormGroup = this.fb.group({
    //   username: [null, Validators.required],
    //   name: [null, Validators.required],
    //   email: [null, Validators.required],
    //   phonePrefix: [this.phonePrefixOptions[3]],
    //   phone: [],
    // });

    // this.verticalPasswordFormGroup = this.fb.group({
    //   password: [
    //     null,
    //     Validators.compose(
    //       [
    //         Validators.required,
    //         Validators.minLength(6)
    //       ]
    //     )
    //   ],
    //   passwordConfirm: [null, Validators.required]
    // });

    // this.verticalConfirmFormGroup = this.fb.group({
    //   terms: [null, Validators.requiredTrue]
    // });


  }

  onItemSelect(item: any) {
    this.setDynamicVariant();
  }
         
        

        ///

  async getProductById(pId) {
    //this.alertService.warning('Please wait data will be load soon.');
    this.showLoader = true;

    this.delay(1000);
    return await this.productService
      .getProductById(pId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.showLoader = false;

            this.singleProductData = data;
            this.firstApiLoaded = true;
            this.showMessage('Data loaded Successfully', 'snackbar-success');
            this.breadcrumbsParams = [{title: 'Products', url: '/product'}, {title: this.singleProductData.name}];
          }
        },
        err => {

          this.showLoader = false;
          this.showMessage(err, 'snackbar-danger');
        }
      );
  }

  setPatchValues(action) {
    const data = this.singleProductData;
    

      const productVariations = data.productVariations;
      this.getBrandByCustomerById(data.customerId, data.brandId);
      // set product code
      const codeArray = data.code.split(" ");
      let lastCode = '';
      for (var i=0; i<codeArray.length; i++) {
        if (i > 5) {
          lastCode += codeArray[i];
        }
      }

      // set selecetd sizes
      const selectedSizes = [];
      productVariations.forEach(el => {
        const singleSizeObj = this.sizesVariationsData.find(f => f.value == el.variationId);
        if (singleSizeObj) {
          selectedSizes.push(singleSizeObj);
        }
      });
      // set selecetd multi customers
      const selectedMulitpleCustomers = [];
      data.customerProducts.forEach(el => {
        //selectedMulitpleCustomers.push(el.customerId);
        if (this.customerData) {
          const cus = this.customerData.find(c => {
            if (c.id === el.customerId) {
              return c;
            }
          });
          if (cus) {
            selectedMulitpleCustomers.push(cus);
          }
        }
      });

      this.showCustomer = data.hasMultipleCustomer;
      this.showQA = data.hasQualityAssuranceStandard;
      this.showPP = data.hasProteinAndPowderCotent;
      this.showPhysical = data.hasPhysicalProperties;
      this.showColorMeter = data.hasColorimeterReadingSpecifications;
      this.showCleanRoom = data.hasCleanroomSpecifications;

      this.showTitleMultipleCustomer = data.hasMultipleCustomer;
      this.showTitleQualityAssuranceStandard = data.hasQualityAssuranceStandard;
      this.showTitleProteinAndPowderCotent = data.hasProteinAndPowderCotent;
      this.showTitlePhysicalProperties = data.hasPhysicalProperties;
      this.showTitleColorimeterReadingSpecifications = data.hasColorimeterReadingSpecifications;
      this.showTitleCleanroomSpecifications = data.hasCleanroomSpecifications;

      let colorId = null,
      textureId = null,
      materialId = null,
      gripId = null,
      donningId = null,
      formerTypeId = null,
      typeConfigId = null,
      qualityAssurancProperty = [],
      proteinPowderContent = [],
      phsicalPropertise = [],
      colorimeterSpecifications = [],
      cleanRoomSpecifications = [],
      ionicBurden:any = {};

      const qualityAssurancPropertyId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Quality Assurance Standard');
      const proteinPowderContentId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Protein & Powder Content');
      const phsicalPropertiseId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Physical Properties');
      const colorimeterSpecificationsId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Colorimeter Reading Specifications');
      const cleanRoomSpecificationsId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Cleanroom Specifications');
      const ionicBurdenId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Ionic Burden');

      const cuffPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Cuff');
      const palmPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Palm');
      const fingerTipPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Fingertip');

      const bigSlipsheetPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Big Slipsheet');
      const smallSlipPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Small Slip Sheet');
      const fumigatedPalletsPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Fumigated Pallets');
      
      let thicknessArray = [];
      let bigSlipsheetArray = [];
      let smallSlipArray = [];
      let fumigatedPalletsArray = [];

      data.productProperties.forEach(element => {      
        //this.allProperties.forEach(el => {
          //colorId = (this.colorData.find(f => f.id === element.propertyId)).propertyId;

          if (element.propertyId === qualityAssurancPropertyId) {
            qualityAssurancProperty = JSON.parse(element.value);
          }
          if (element.propertyId === proteinPowderContentId) {
            proteinPowderContent = JSON.parse(element.value);
          }
          if (element.propertyId === phsicalPropertiseId) {
            phsicalPropertise = JSON.parse(element.value);
          }
          if (element.propertyId === colorimeterSpecificationsId) {
            colorimeterSpecifications = JSON.parse(element.value);
          }
          if (element.propertyId === cleanRoomSpecificationsId) {
            cleanRoomSpecifications = JSON.parse(element.value);
          }
          if (element.propertyId === ionicBurdenId) {
            ionicBurden = JSON.parse(element.value);
          }

          const propertyObj = this.getPropertyById(element.propertyId);
          
          if (propertyObj.propertyTypeId === 6) { //"Colour"
            colorId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 5) { //Texture
            textureId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 1) { //Material
            materialId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 4) { //Grip
            gripId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 3) { //Donning
            donningId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 2) { //FormerType
            typeConfigId = parseInt(element.propertyId);
          }
          if (propertyObj.propertyTypeId === 16) { //FormerType
            formerTypeId = parseInt(element.propertyId);
          }

          if (element.propertyId === cuffPropertyId) {
            const jData = JSON.parse(element.value);
            thicknessArray.push({...jData});
          }
          if (element.propertyId === palmPropertyId) {
            const jData = JSON.parse(element.value);
            thicknessArray.push({...jData});
          }
          if (element.propertyId === fingerTipPropertyId) {
            const jData = JSON.parse(element.value);
            thicknessArray.push({...jData});
          }

          if (element.propertyId === bigSlipsheetPropertyId) {
            const jData = JSON.parse(element.value);
            bigSlipsheetArray = jData;
          }
          if (element.propertyId === smallSlipPropertyId) {
            const jData = JSON.parse(element.value);
            smallSlipArray = jData;
          }
          if (element.propertyId === fumigatedPalletsPropertyId) {
            const jData = JSON.parse(element.value);
            fumigatedPalletsArray = jData;
          }

          
      });


      // patching Physical Properties
      if (!_.isEmpty(phsicalPropertise)) {
        this.deletePhysicalPropertise(0);
        phsicalPropertise.forEach((prop, i) => {
          this.physicalPropertise.push(
            this.fb.group({...prop})
          );
          this.changephysical(i, prop);
        });
      }
      // patching Ionic Burden
      if (!_.isEmpty(ionicBurden)) {
        this.deleteIonBuid(0);
        ionicBurden.anion.forEach(element => {
          this.addIonPoint(element)
        });
        this.deleteIonCartons(0);
        ionicBurden.cations.forEach(element => {
          this.addIonCartons(element);
        });
      }

    
      if (!_.isEmpty(bigSlipsheetArray) && bigSlipsheetArray.length > 0) {
        (<FormArray>this.loanPlanFormGroup.get('big_slipsheet')).clear();
        bigSlipsheetArray.forEach((el, i) => {          
          this.bigSlipsheet.push(this.fb.group(el));
          this.loanPlanFormGroup.patchValue({
            bigSlipCheckbox: el.isActive
          });
          this.showBigSlipsheet = el.isActive;
        });
      }
      if (!_.isEmpty(smallSlipArray) && smallSlipArray.length > 0) {
        (<FormArray>this.loanPlanFormGroup.get('small_slipsheet')).clear();
        smallSlipArray.forEach((el, i) => {          
          this.smallSlipsheet.push(this.fb.group(el));
          this.loanPlanFormGroup.patchValue({
            smallSlipCheckbox: el.isActive
          });
          this.showSmallSlipsheet = el.isActive;
        });
      }
      if (!_.isEmpty(fumigatedPalletsArray) && fumigatedPalletsArray.length > 0) {
        (<FormArray>this.loanPlanFormGroup.get('fumigated_pallets')).clear();
        fumigatedPalletsArray.forEach((el, i) => {          
          this.fumigatedPallets.push(this.fb.group(el));
          this.loanPlanFormGroup.patchValue({
            fumigatedCheckbox: el.isActive
          });
          this.showFumigatedPallets = el.isActive;
        });
      }

      // set form values
      this.accountFormGroup.patchValue({
        customerId: data.customerId,
        pName: data.name,
        productCategoryId: data.productCategoryId,
        brandCode: data.code,
        sizes: selectedSizes,
        unitPrice: data.unitPrice,
        productCodeL: codeArray[0],
        productCodeS: codeArray[1],
        productCodeC: codeArray[2],
        productCodeT: codeArray[3],
        productCodeSize: codeArray[4],
        productCodeWidth: codeArray[5],
        productCodeCr: lastCode,
        packingMaterialId: data.packingMaterialId ? data.packingMaterialId : '',
        totalLength: data.totalLength ? data.totalLength : '',
        staticPowderContent: data.powderContent ? data.powderContent : '',
        color: colorId,
        texture: textureId,
        material: materialId,
        coatingGrip: gripId,
        coatingDonning: donningId,
        typeConfig: typeConfigId,
        formerType: formerTypeId,

        hasMultipleCustomer: data.hasMultipleCustomer,
        multipleCustomer: selectedMulitpleCustomers,

        hasQualityAssuranceStandard: data.hasQualityAssuranceStandard,
        qualityAssuranceStandardFields: qualityAssurancProperty,

        hasProteinAndPowderCotent: data.hasProteinAndPowderCotent,
        proteinPowderContentFields: proteinPowderContent,

        hasPhysicalProperties: data.hasPhysicalProperties,

        hasColorimeterReadingSpecifications: data.hasColorimeterReadingSpecifications,
        colorimeterSpecificationsFields: colorimeterSpecifications,

        hasCleanroomSpecifications: data.hasCleanroomSpecifications,
        cleanRoomSpecificationsFields: cleanRoomSpecifications,

      });
      this.variantsFormGroup.patchValue({
        variants_thickness: thicknessArray.reverse()
      });

      this.setDynamicVariant();

  }

  getPropertyById(id) {
    return this.allProperties.find(f => f.id === id);
  }

  checkAllApi() {
    const delayTime = 500;
    let count = 0;
    const intervalId = setInterval(() => {
        if (this.firstApiLoaded && this.secondApiLoaded && this.thirdApiLoaded && this.forthApiLoaded && this.fifthApiLoaded) {

          this.setPatchValues('initial');
          // this.disableEditButton = false;
          this.showLoader = false;

          clearInterval(intervalId);
        }
        if (count > 100) {
          clearInterval(intervalId);
        }
        count++;
    }, delayTime);
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',      
      panelClass: customClass
    },
    
    );
  }

  showPassword() {
    this.passwordInputType = "text";
    this.cd.markForCheck();
  }

  hidePassword() {
    this.passwordInputType = "password";
    this.cd.markForCheck();
  }
  get f() {

    return this.accountFormGroup.controls;
  }

  async submit(action?: string) {
    this.submitted = true;
    if (this.accountFormGroup.invalid) {

      return;
    }

    const accountFormGroup = this.accountFormGroup.value,
      loadPlanFormGroup = this.loadPlanFormGroup.value,
      variantsFormGroup = this.variantsFormGroup.value,
      confirmFormGroup = this.confirmFormGroup.value,
      packingDetailsFormGroup = this.packingDetailsFormGroup.value,
      loanPlanFormGroup = this.loanPlanFormGroup.value;

     
    const formData = this.arrangeDataStructure(action, accountFormGroup, variantsFormGroup, packingDetailsFormGroup, loanPlanFormGroup);

    if (action === 'create') {

      this.productService
      .addProduct(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.showMessage('Hooray! You successfully created a product!!', 'snackbar-success');
          this.showLoader = false;
          setTimeout(() => {
            this.router.navigate(["/product"]);
          }, 0);
        },
        err => {
          this.showMessage(err,'snackbar-danger');
          this.showLoader = false;
        }
      );
    }
    if (action === 'update' && confirm("Do you want to update this product?")) {
      const productId = this.singleProductData.id;
      this.showLoader = true;
      this.updateProduct(formData, productId);
    }

  }

  async updateProduct(formData, productId) {

    this.productService
      .upateProduct(formData, productId)
      .pipe(first())
      .subscribe(
        data => {
          this.showMessage('You successfully updated a product!!', 'snackbar-success');
          this.showLoader = false;
          setTimeout(() => {
            this.router.navigate(["/product"]);          
          }, 0);
          // just for refreshing html component to hide loader
          this.setFocus();

        },
        err => {

          this.showMessage(err, 'snackbar-danger');
          this.showLoader = false;
          this.setFocus();
        }
      );
  }

  setFocus() {
    const invalidControl = this.el.nativeElement.querySelector('#customer-field');
    if (invalidControl) {
      invalidControl.focus();
    }
  }
  returnBack() {
    this.router.navigate(["/product"]);
  }
  toglleBlock(action) {
    if (action === 'big_slipsheet') {
      this.showBigSlipsheet = !this.showBigSlipsheet;
    } else if (action === 'small_slipsheet') {
      this.showSmallSlipsheet = !this.showSmallSlipsheet;
    } else if (action === 'fumigated_pallets') {
      this.showFumigatedPallets = !this.showFumigatedPallets;
    }
  }

  multiCustomersField() {
    this.showCustomer = !this.showCustomer;
  }
  multiQAField() {
    this.showQA = !this.showQA;
  }
  multiPPField() {
    this.showPP = !this.showPP;
  }
  multiPhysicalField() {
    this.showPhysical = !this.showPhysical;
  }
  colorMeterField() {
    this.showColorMeter = !this.showColorMeter;
  }
  cleanRoomField() {
    this.showCleanRoom = !this.showCleanRoom;
  }
  removeField() {
    alert();
  }
  addMoreField() {
    alert();
  }
  get ionPoints() {
    return this.accountFormGroup.get("ion_points") as FormArray;
  }
  
  addIonPoint(values) {
    const anion = values && values.anion ? values.anion : '';
    const count = values && values.count ? values.count : '';
    this.ionPoints.push(this.fb.group({ anion, count }));
  }

  deleteIonBuid(index) {
    this.ionPoints.removeAt(index);
  }

  get ionCartons() {
    return this.accountFormGroup.get("ion_cartons") as FormArray;
  }

  addIonCartons(values) {
    const cations = values && values.cations ? values.cations : '';
    const count = values && values.count ? values.count : '';
    this.ionCartons.push(this.fb.group({ cations, count }));
  }

  deleteIonCartons(index) {
    this.ionCartons.removeAt(index);
  }

  get physicalPropertise() {
    return this.accountFormGroup.get("phsical_propertise") as FormArray;
  }

  get qualityAssuranceStandardFields() {
    return this.accountFormGroup.get("qualityAssuranceStandardFields") as FormArray;
  }

  get proteinPowderContentFields() {
    return this.accountFormGroup.get("proteinPowderContentFields") as FormArray;
  }

  get colorimeterSpecificationsFields() {
    return this.accountFormGroup.get("colorimeterSpecificationsFields") as FormArray;
  }

  addPhysicalPropertise() {
    this.physicalPropertise.push(
      this.fb.group({ ref: "", agigingType: "", tEtype: ""})
    );
  }
  deletePhysicalPropertise(index) {
    this.physicalPropertise.removeAt(index);
  }

  get specificationsSizes() {
    return this.variantsFormGroup.get("specifications_sizes") as FormArray;
  }
  get variantsThickness() {
    return this.variantsFormGroup.get("variants_thickness") as FormArray;
  }
  get cartoonSpecifications() {
    return this.packingDetailsFormGroup.get(
      "cartoon_specifications"
    ) as FormArray;
  }
  get packingSpecifications() {
    return this.packingDetailsFormGroup.get(
      "packing_specifications"
    ) as FormArray;
  }
  get packingInstructions() {
    return this.packingDetailsFormGroup.get(
      "packing_instructions"
    ) as FormArray;
  }
  addPackingInstructions() {
    this.packingInstructions.push(
      this.fb.group({...this.packingInstructionsFields})
    );
  }
  deletePackingInstructions(index) {
    this.packingInstructions.removeAt(index);
  }
  get bigSlipsheet() {
    return this.loanPlanFormGroup.get("big_slipsheet") as FormArray;
  }
  get smallSlipsheet() {
    return this.loanPlanFormGroup.get("small_slipsheet") as FormArray;
  }
  get fumigatedPallets() {
    return this.loanPlanFormGroup.get("fumigated_pallets") as FormArray;
  }

  changephysical(i, values) {
    let selectField = <FormGroup>(
      (<FormGroup>this.accountFormGroup.get("phsical_propertise")).controls[i]
    );
    setTimeout(() => {
      const selectedRow = selectField.value;
      const min = values && values.min? values.min : '';
      const max = values && values.max? values.max : '';
      const tar = values && values.tar? values.tar : '';
      const forceAtBreak = values && values.forceAtBreak ? values.forceAtBreak : '';
      const resetFields = Utils.checkPhysicalPropertyFields(selectedRow);

      if (resetFields.showMinMaxTar) {
        selectField.addControl("min", new FormControl(min));
        selectField.addControl("max", new FormControl(max));
        selectField.addControl("tar", new FormControl(tar));
        selectField.removeControl("forceAtBreak");

        this.showMinMaxTar[i] = true;
        this.showForceAtBreak[i] = false;
      }
      if (resetFields.showForceAtBreak) {
        selectField.addControl("forceAtBreak", new FormControl(forceAtBreak));
        selectField.removeControl("min");
        selectField.removeControl("max");
        selectField.removeControl("tar");

        this.showForceAtBreak[i] = true;
        this.showMinMaxTar[i] = false;
      }
    }, 100);
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
            const customers = _.map(data, d => {
              return {...d, name: d.name.trim()}
            });
            this.customerData = customers ? _.sortBy(customers, 'name') : [];
            // this.customerDataMulti = this.customerData.map(c => {
            //   return {id: c.id, item_text: c.name};
            // });
            // { item_id: 1, item_text: 'New Delhi' },
           // this.setMultiCustomer(this.customerData);

          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  async getProductCategories() {
    this.delay(1000);
    return await this.commonService
      .getProductCategories(
        data => {
          if (data) {
            this.productCategoriesData = data;
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  async getSizesVariations() {
    this.delay(1000);
    return await this.commonService
      .getSizesVariations(
        data => {
          if (data) {
            this.fifthApiLoaded = true;
            this.setMultiSizes(data);
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  async getAllProperties() {
    return await this.commonService
      .getAllProperties(
        data => {
          if (data) {
            this.allProperties = data;        
            this.secondApiLoaded = true;
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  async getAllStaticProperties() {
    return await this.commonService
      .getAllStaticProperties(
        data => {
          if (data) {
            this.forthApiLoaded = true;
            this.arrangeStaticProperties(data);
          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  async getStaticPackingMaterials() {
    return await this.commonService
      .getStaticPackingMaterials(
        data => {
          if (data) {
            this.staticPackingMaterials = data;
            //this.forthApiLoaded = true;
            //this.arrangeStaticProperties(data);
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

    this.qualityAssuranceStandardValues.forEach(data => {
      this.qualityAssuranceStandardFields.push(this.fb.group({
        disable_property: [{value: data, disabled: true}],
        property: data,
        level: '',
        aql: ''
      }))
    });

    this.proteinPowderContentValues.forEach((data, i) => {
      this.proteinPowderContentFields.push(this.fb.group({
        disable_property: [{value: data, disabled: true}],
        property: data,
        ref: '',
        amount: ''
      }))
    });
    this.colorimeterValues.forEach((data, i) => {
      this.colorimeterSpecificationsFields.push(this.fb.group({
        disable_property: [{value: data, disabled: true}],
        property: data,
        min: '',
        tar: '',
        max: ''
      }))
    });
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  setMultiSizes(sizesVariationsData) {
    const d = [];
    for (let data of sizesVariationsData) {
      let obj = {
        "value": data.id,
        "display": data.name
      }
      d.push(obj);
    }
    this.sizesVariationsData = d;
  }

  getBrandByCustomerById(cId?: number, bId?: number) {
    this.showBrandLoader = true;
    this.disableEditButton = true;
    return this.customerService
      .getCustomerDetails(cId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {

            if (data['brands']) {
              this.brandData = data['brands'];

            } else {
              this.brandData = [];
            }
            this.accountFormGroup.controls['brandName'].enable();            
            // in case of UPDATE PRODUCT, setting default value
            if (bId) {
              this.accountFormGroup.patchValue({
                brandName: bId,
              });
            }            
          }
          this.showBrandLoader = false;
          this.disableEditButton = false;
        },
        err => {
          this.alertService.error(err);
          this.showBrandLoader = false;
          this.disableEditButton = false;
        }
      );
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
    this.thirdApiLoaded = true;
    if (data) {
      this.allPropertiesType = data;
      let getData: any = data;
      this.colorData = getData.find(elm => elm.name === "Colour");
      this.colorData = this.colorData['properties'] ? this.colorData['properties'] : [];


      this.gripData = getData.find(elm => elm.name === "Grip");
      this.gripData = this.gripData['properties'] ? this.gripData['properties'] : [];

      this.textureData = getData.find(elm => elm.name === "Texture");
      this.textureData = this.textureData['properties'] ? this.textureData['properties'] : [];

      this.materialData = getData.find(elm => elm.name === "Material");
      this.materialData = this.materialData['properties'] ? this.materialData['properties'] : [];


      this.configrationData = getData.find(elm => elm.name === "Configuration");
      this.configrationData = this.configrationData['properties'] ? this.configrationData['properties'] : [];

      this.donningData = getData.find(elm => elm.name === "Donning");
      this.donningData = this.donningData['properties'] ? this.donningData['properties'] : [];

      this.sizeSpecificationProperties = getData.find(elm => elm.name === "Size Specification");
      this.sizeSpecificationProperties = this.sizeSpecificationProperties['properties'] ? this.sizeSpecificationProperties['properties'] : [];

      this.cartonSpecificationProperties = getData.find(elm => elm.name === "Carton Specification");
      this.cartonSpecificationProperties = this.cartonSpecificationProperties['properties'] ? this.cartonSpecificationProperties['properties'] : [];
      
      this.packingSpecificationsProperties = getData.find(elm => elm.name === "Packing Specifications");
      this.packingSpecificationsProperties = this.packingSpecificationsProperties['properties'] ? this.packingSpecificationsProperties['properties'] : [];

      this.typeConfigurationProperties = getData.find(elm => elm.name === "Configuration");
      this.typeConfigurationProperties = this.typeConfigurationProperties['properties'] ? this.typeConfigurationProperties['properties'] : [];

      this.formerTypeProperties = getData.find(elm => elm.name === "FormerType");
      this.formerTypeProperties = this.formerTypeProperties['properties'] ? this.formerTypeProperties['properties'] : [];

      this.miscellaneousTypeProperties = getData.find(elm => elm.name === "Miscellaneous");
      this.miscellaneousTypeProperties = this.miscellaneousTypeProperties['properties'] ? this.miscellaneousTypeProperties['properties'] : [];

      this.thicknessProperties = getData.find(elm => elm.name === "Thickness");
      this.thicknessProperties = this.thicknessProperties['properties'] ? this.thicknessProperties['properties'] : [];

      this.loadPlanProperties = getData.find(elm => elm.name === "Load Plan");
      this.loadPlanProperties = this.loadPlanProperties['properties'] ? this.loadPlanProperties['properties'] : [];
      

    } else {
      this.colorData = [];
      this.gripData = [];
      this.textureData = [];
      this.materialData = [];
      this.configrationData = [];
      this.donningData = [];
      this.cartonSpecificationProperties = [];
      this.packingSpecificationsProperties = [];
      this.typeConfigurationProperties = [];
      this.formerTypeProperties = [];
      this.miscellaneousTypeProperties = [];
      this.thicknessProperties = [];
      this.loadPlanProperties = [];
    }
  }
  setDynamicVariant() {
    this.setVarient = this.accountFormGroup.value;      
    
    if (this.setVarient.sizes) {
      let variantSizes = _.sortBy(this.setVarient.sizes, 'value');
      //if (type == 'varient') {
        const sizesArray: any = [];
        const cartoonArray: any = [];
        const packingArray: any = [];
        const instructionsArray: any = [];

        const patchingPackingData = this.patchPackingDetails();
        
        let sizeFieldsDefaultValues = this.sizeSpecificationsFields;
        let cartoonSpecificationsFields = this.cartoonSpecificationsFields;
        let packingSpecificationsFields = this.packingSpecificationsFields;
        let packingInstructionsArray = this.packingInstructionsArray;

        variantSizes.forEach( (size:any, i) => {
          const singleSizeObj = this.sizesVariationsData.find(f => f.value == size.value);
          // in case of UPDATE PRODCUT set defalt values of variants from db
          if (this.isUpdateView) {
            sizeFieldsDefaultValues = this.patchSizesValues(singleSizeObj.value);
            cartoonSpecificationsFields = patchingPackingData.cartoonSpecArray.find(f => f.data.value === size.value) ? patchingPackingData.cartoonSpecArray.find(f => f.data.value === size.value) : cartoonSpecificationsFields;
            packingSpecificationsFields = patchingPackingData.packingSpecArray.find(f => f.data.value === size.value) ? patchingPackingData.packingSpecArray.find(f => f.data.value === size.value) : packingSpecificationsFields;
          }
          sizesArray.push(this.fieldsGroup(sizeFieldsDefaultValues, singleSizeObj.display.toUpperCase(), singleSizeObj));
          cartoonArray.push(this.fieldsGroup(cartoonSpecificationsFields, singleSizeObj.display.toUpperCase(), singleSizeObj));
          packingArray.push(this.fieldsGroup(packingSpecificationsFields, singleSizeObj.display.toUpperCase(), singleSizeObj));
        });

        this.variantsFormGroup = this.fb.group({
          specifications_sizes: this.fb.array(sizesArray) || [],
          variants_thickness: this.fb.array(this.thicknessArray) || []
        });

        this.packingDetailsFormGroup = this.fb.group({
          cartoon_specifications: this.fb.array(cartoonArray) || [],
          packing_specifications: this.fb.array(packingArray) || [],
          packing_instructions: this.fb.array(patchingPackingData.packingInstruArray ? patchingPackingData.packingInstruArray : packingInstructionsArray) || []
        });
        this.showMultiSelect = true;
      //}

    } 
    // else {

    //   if (type == 'varient') {

    //     this.variantsFormGroup = this.fb.group({
    //       specifications_sizes: this.fb.array([]) || [],
    //       variants_thickness: this.fb.array(this.thicknessArray) || []
    //     });

    //   } else if (type == 'packingDetail') {


    //     this.packingDetailsFormGroup = this.fb.group({
    //       cartoon_specifications:
    //         this.fb.array([]) || [],
    //       packing_specifications:
    //         this.fb.array([]) || [],
    //       packing_instructions: this.fb.array(this.packingInstructionsArray) || []
    //     });


    //   }

    // }
  }

  patchSizesValues(variationId) {
    const data = this.singleProductData;
    const sizeSpecProp = this.sizeSpecificationProperties;
    const variations = data && data.productVariations ? data.productVariations : [];
    let sizeSpecificationsFields = {
      lengthMin: "",
      lengthMax: "",
      lengthTarget: "",
      widthMin: "",
      widthMax: "",
      widthTarget: "",
      weightMin: "",
      weightMax: "",
      weightTarget: ""
    };

    
    if (variations && variations.length > 0) {
      variations.forEach(element => {
        if (element.variationId === variationId) {
          element.productProperties.forEach(property => {
          const valueObj = property.value ? JSON.parse(property.value) : {min: '', max: '', target: ''};

            if (property.propertyId === Utils.getStaticPropertyByName(sizeSpecProp, 'Total Length')) {
              sizeSpecificationsFields.lengthMin = valueObj.min;
              sizeSpecificationsFields.lengthMax = valueObj.max;
              sizeSpecificationsFields.lengthTarget = valueObj.target;
             }
             if (property.propertyId === Utils.getStaticPropertyByName(sizeSpecProp, 'Palm Width')) {
              sizeSpecificationsFields.widthMin = valueObj.min;
              sizeSpecificationsFields.widthMax = valueObj.max;
              sizeSpecificationsFields.widthTarget = valueObj.target;
             }
             if (property.propertyId === Utils.getStaticPropertyByName(sizeSpecProp, 'Weight')) {
              sizeSpecificationsFields.weightMin = valueObj.min;
              sizeSpecificationsFields.weightMax = valueObj.max;
              sizeSpecificationsFields.weightTarget = valueObj.target;
             }
          });
        }
      });
    }
    return sizeSpecificationsFields;
  }

  patchPackingDetails() {
    const data = this.singleProductData;
    const packingSpecificationsFields = this.packingSpecificationsFields;
    const cartonSpecificationPropertyId = Utils.getStaticPropertyByName(this.cartonSpecificationProperties, 'Carton Dimensions');
    const packingSpecificationPropertyId = Utils.getStaticPropertyByName(this.packingSpecificationsProperties, 'Packing Specifications');
    const packingInstructionsPropertyId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Packing Instructions');
    let cartoonSpecArray = [];
      let packingSpecArray = [];
      let packingInstruArray = [];

    if (data) {
      data.productProperties.forEach(element => {  
        if (element.propertyId === cartonSpecificationPropertyId) {
          const jData = JSON.parse(element.value);
          cartoonSpecArray = jData;
        }
        if (element.propertyId === packingSpecificationPropertyId) {
          let jData = JSON.parse(element.value);
          jData = jData.map(j => {
            return {
              ...j,
              pieceType: j.pieceType ? j.pieceType : "Pieces"
            };
          });
          packingSpecArray = jData;
        }
        if (element.propertyId === packingInstructionsPropertyId) {
          const jData = JSON.parse(element.value);
          if (jData && jData.length > 0)
            jData.forEach(elVal => {
              packingInstruArray.push(this.fb.group({...elVal}));
            });
        }
      });
    }
    return {
      cartoonSpecArray,
      packingSpecArray,
      packingInstruArray
    }
  }
  

  arrangeDataStructure(action, newobj, variantsFormGroup, packingDetailsFormGroup, loanPlanFormGroup) {
    const singleProduct = this.singleProductData;
    let pCodeL = newobj.productCodeL ? newobj.productCodeL.trim() : '',
        pCodeS = newobj.productCodeS ? newobj.productCodeS.trim() : '',
        pCodeC = newobj.productCodeC ? newobj.productCodeC.trim() : '',
        productCodeT = newobj.productCodeT ? newobj.productCodeT.trim() : '',
        productCodeSize = newobj.productCodeSize ? newobj.productCodeSize.trim() : '',
        productCodeW = newobj.productCodeWidth ? newobj.productCodeWidth.trim() : '',
        productCodeCr = newobj.productCodeCr ? newobj.productCodeCr.trim() : '',        

        specificationsSizes = variantsFormGroup.specifications_sizes,
        variantsThickness = variantsFormGroup.variants_thickness;

        const productVariations = this.getSizes(action, specificationsSizes);
        const productProperties = this.setProductProperties(action, newobj, variantsThickness, packingDetailsFormGroup, loanPlanFormGroup);
        
        let customerProducts = [];
        newobj.multipleCustomer.forEach(c => {
          customerProducts.push({customerId: c.id});
        });

    let checkboxFields: any = {
      "hasMultipleCustomer": newobj.hasMultipleCustomer,
      "hasQualityAssuranceStandard": newobj.hasQualityAssuranceStandard,
      "hasProteinAndPowderCotent": newobj.hasProteinAndPowderCotent,
      "hasPhysicalProperties": newobj.hasPhysicalProperties,
      "hasColorimeterReadingSpecifications": newobj.hasColorimeterReadingSpecifications,
      "hasCleanroomSpecifications": newobj.hasCleanroomSpecifications,
    };
    
    const obj = {
        "customerId": newobj.customerId,
        "brandId": newobj.brandName,
        "name": newobj.pName,
        "productCategoryId": newobj.productCategoryId,
        "unitPrice": newobj.unitPrice,
        "code": pCodeL + ' ' + pCodeS + ' ' + pCodeC + ' ' + productCodeT + ' ' + productCodeSize + ' ' + productCodeW + ' ' + productCodeCr,        
        "packingMaterialId": newobj.packingMaterialId,
        "powderContent": newobj.staticPowderContent,
        "totalLength":newobj.totalLength,

        ...checkboxFields,
        "productVariations": productVariations,
        "productProperties": productProperties,

        "productCategory": '',
        "storeId": '',
        "store": '',
        
        "customer": '',
        
        "customerBrand": '',
        "loadPlanId": '',
        "loadPlan": '',
        "lastIn": '',
        "lastOut": '',
        "productAttributes": '',
        "customerProducts": customerProducts

    }
    return obj;
  }

  setProductProperties(action, newobj, variantsThickness, packingDetailsFormGroup, loanPlanFormGroup) {
    const singleProduct = this.singleProductData;

    let cartoonSpecifications = packingDetailsFormGroup.cartoon_specifications,
        packingSpecifications = packingDetailsFormGroup.packing_specifications,
        packingInstructions = packingDetailsFormGroup.packing_instructions;

    let bigSlipsheet = loanPlanFormGroup.big_slipsheet,
        smallSlipsheet = loanPlanFormGroup.small_slipsheet,
        fumigatedPallets = loanPlanFormGroup.fumigated_pallets;
        bigSlipsheet.forEach(e => e.isActive = loanPlanFormGroup.bigSlipCheckbox);
        smallSlipsheet.forEach(e => e.isActive = loanPlanFormGroup.smallSlipCheckbox);
        fumigatedPallets.forEach(e => e.isActive = loanPlanFormGroup.fumigatedCheckbox);

    let color = newobj.color ? newobj.color : '',
    material = newobj.material ? newobj.material : '',
    coatingDonning = newobj.coatingDonning ? newobj.coatingDonning : '',
    coatingGrip = newobj.coatingGrip ? newobj.coatingGrip : '',
    texture = newobj.texture ? newobj.texture : '',
    typeConfig = newobj.typeConfig ? newobj.typeConfig : '',
    formerType = newobj.formerType ? newobj.formerType : '',
    qualityAssuranceStandardFields = newobj.qualityAssuranceStandardFields,
    proteinPowderContentFields = newobj.proteinPowderContentFields,
    phsical_propertise = newobj.phsical_propertise,
    colorimeterSpecificationsFields = newobj.colorimeterSpecificationsFields,
    cleanRoomSpecificationsFields = newobj.cleanRoomSpecificationsFields,
    ion_points = newobj.ion_points,
    ion_cartons = newobj.ion_cartons,
    ionicBurden = {anion: ion_points, cations: ion_cartons};    
    
    const qualityAssuranceString = JSON.stringify(qualityAssuranceStandardFields);
    const qualityAssurancPropertyId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Quality Assurance Standard');
    const proteinPowderContentString = JSON.stringify(proteinPowderContentFields);
    const proteinPowderContentId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Protein & Powder Content');
    const phsicalPropertiseString = JSON.stringify(phsical_propertise);
    const phsicalPropertiseId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Physical Properties');
    const colorimeterSpecificationsString = JSON.stringify(colorimeterSpecificationsFields);
    const colorimeterSpecificationsId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Colorimeter Reading Specifications');
    const cleanRoomSpecificationsString = JSON.stringify(cleanRoomSpecificationsFields);
    const cleanRoomSpecificationsId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Cleanroom Specifications');
    const ionicBurdenString = JSON.stringify(ionicBurden);
    const ionicBurdenId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Ionic Burden');

    // Thickness (mm)
    const cuffPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Cuff');
    const palmPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Palm');
    const fingerTipPropertyId = Utils.getStaticPropertyByName(this.thicknessProperties, 'Fingertip');
    let cuffDataString = "";
    let palmDataString = "";
    let fingertipDataString = "";
    if (!_.isEmpty(variantsThickness) && variantsThickness.length > 0) {
      variantsThickness.forEach(dataObj => {
        delete dataObj.data;
        if (dataObj.title === "Cuff") {          
          cuffDataString = JSON.stringify(dataObj);
        }
        if (dataObj.title === "Palm") {
          palmDataString = JSON.stringify(dataObj);
        }
        if (dataObj.title === "Fingertip") {
          fingertipDataString = JSON.stringify(dataObj);
        }
      });
    }

    // Carton Specifications / Packing Specifications / Packing Instructions
    const cartonSpecificationPropertyId = Utils.getStaticPropertyByName(this.cartonSpecificationProperties, 'Carton Dimensions');
    const cartonSpecificationPropertyString = JSON.stringify(cartoonSpecifications);
    const packingSpecificationPropertyId = Utils.getStaticPropertyByName(this.packingSpecificationsProperties, 'Packing Specifications');
    const packingSpecificationPropertyString = JSON.stringify(packingSpecifications);
    const packingInstructionsPropertyId = Utils.getStaticPropertyByName(this.miscellaneousTypeProperties, 'Packing Instructions');
    const packingInstructionsPropertyString = JSON.stringify(packingInstructions);

    // Big Slipsheet / Small Slip Sheet / Fumigated Pallets
    const bigSlipsheetPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Big Slipsheet');
    const bigSlipsheetPropertyString = JSON.stringify(bigSlipsheet);
    const smallSlipPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Small Slip Sheet');
    const smallSlipPropertyString = JSON.stringify(smallSlipsheet);
    const fumigatedPalletsPropertyId = Utils.getStaticPropertyByName(this.loadPlanProperties, 'Fumigated Pallets');
    const fumigatedPalletsPropertyString = JSON.stringify(fumigatedPallets);

    const selectedColor = this.colorData.find(f => f.id === color);
    const selectedMaterial = this.materialData.find(f => f.id === material);
    const selectedDonning = this.donningData.find(f => f.id === coatingDonning);
    const selectedGrip = this.gripData.find(f => f.id === coatingGrip);
    const selectedTextrue = this.textureData.find(f => f.id === texture);
    const selectedTypeConfig = this.typeConfigurationProperties.find(f => f.id === typeConfig);
    const selectedFormerType = this.formerTypeProperties.find(f => f.id === formerType);

    let productProperties = [];
    let colorData:any = {}, materialData:any = {}, doningData:any = {}, gripData:any = {}, textureData:any = {}, typeConfigData:any = {}, formerTypeData:any = {},
        qualityAssData: any = {}, proteinPowderData: any = {}, physicalPropData:any = {}, colorimeterSpecData:any = {}, cleanRoomData:any = {}, ionicBurdenData:any = {},
        cuffData: any = {}, palmData: any = {}, fingertipData: any = {},
        cartonSpecificationData: any = {}, packingSpecificationData: any = {}, packingInstructionsPropertiesData: any = {},
        bigSlipsheetData:any = {}, smallSlipData:any = {}, fumigatedPalletsData:any = {};
    
    colorData = Utils.productPropertiesObjectStructure(selectedColor ? selectedColor.name : '', false, color);
    productProperties.push(colorData);
    materialData = Utils.productPropertiesObjectStructure(selectedMaterial ? selectedMaterial.name : '', false, material);
    productProperties.push(materialData);
    doningData = Utils.productPropertiesObjectStructure(selectedDonning ? selectedDonning.name : '', false, coatingDonning);
    productProperties.push(doningData);
    gripData = Utils.productPropertiesObjectStructure(selectedGrip ? selectedGrip.name : '', false, coatingGrip);
    productProperties.push(gripData);
    textureData = Utils.productPropertiesObjectStructure(selectedTextrue ? selectedTextrue.name : '', false, texture);
    productProperties.push(textureData);
    typeConfigData = Utils.productPropertiesObjectStructure(selectedTypeConfig ? selectedTypeConfig.name : '', false, typeConfig);
    productProperties.push(typeConfigData);
    formerTypeData = Utils.productPropertiesObjectStructure(selectedFormerType ? selectedFormerType.name : '', false, formerType);
    productProperties.push(formerTypeData);

    // first tab bottom checkbox form
    qualityAssData = Utils.productPropertiesObjectStructure(qualityAssuranceString, true, qualityAssurancPropertyId);
    productProperties.push(qualityAssData);
    proteinPowderData = Utils.productPropertiesObjectStructure(proteinPowderContentString, true, proteinPowderContentId);
    productProperties.push(proteinPowderData);
    physicalPropData = Utils.productPropertiesObjectStructure(phsicalPropertiseString, true, phsicalPropertiseId);
    productProperties.push(physicalPropData);
    colorimeterSpecData = Utils.productPropertiesObjectStructure(colorimeterSpecificationsString, true, colorimeterSpecificationsId);
    productProperties.push(colorimeterSpecData);
    cleanRoomData = Utils.productPropertiesObjectStructure(cleanRoomSpecificationsString, true, cleanRoomSpecificationsId);
    productProperties.push(cleanRoomData);
    ionicBurdenData = Utils.productPropertiesObjectStructure(ionicBurdenString, true, ionicBurdenId);
    productProperties.push(ionicBurdenData);

    // Thickness from
    cuffData = Utils.productPropertiesObjectStructure(cuffDataString, true, cuffPropertyId);
    productProperties.push(cuffData);
    palmData = Utils.productPropertiesObjectStructure(palmDataString, true, palmPropertyId);
    productProperties.push(palmData);
    fingertipData = Utils.productPropertiesObjectStructure(fingertipDataString, true, fingerTipPropertyId);
    productProperties.push(fingertipData, productProperties);

    // Carton Specification / Packing Specifications / Packing Specifications
    cartonSpecificationData = Utils.productPropertiesObjectStructure(cartonSpecificationPropertyString, true, cartonSpecificationPropertyId);
    productProperties.push(cartonSpecificationData);
    packingSpecificationData = Utils.productPropertiesObjectStructure(packingSpecificationPropertyString, true, packingSpecificationPropertyId);
    productProperties.push(packingSpecificationData);
    packingInstructionsPropertiesData = Utils.productPropertiesObjectStructure(packingInstructionsPropertyString, true, packingInstructionsPropertyId);
    productProperties.push(packingInstructionsPropertiesData);

    // Big Slipsheet / Small Slip Sheet / Fumigated Pallets
    
    bigSlipsheetData = Utils.productPropertiesObjectStructure(bigSlipsheetPropertyString, true, bigSlipsheetPropertyId);
    productProperties.push(bigSlipsheetData);
    smallSlipData = Utils.productPropertiesObjectStructure(smallSlipPropertyString, true, smallSlipPropertyId);
    productProperties.push(smallSlipData);
    fumigatedPalletsData = Utils.productPropertiesObjectStructure(fumigatedPalletsPropertyString, true, fumigatedPalletsPropertyId);
    productProperties.push(fumigatedPalletsData);


    // IN CASE OF UPDATE
    if (action === 'update') { 
      let productPropertiesArray = singleProduct.productProperties;  
      
      let updatedProductProperties = [];

      
      const qualityAssDataOld = productPropertiesArray.find(f => f.propertyId === qualityAssurancPropertyId);
      if (!_.isEmpty(qualityAssDataOld)) {
        qualityAssDataOld.value = qualityAssuranceString ? qualityAssuranceString : '';
        qualityAssDataOld.isObject = true;
        updatedProductProperties.push(qualityAssDataOld);
      } else {
        updatedProductProperties.push(qualityAssData);
      }
      const physicalPropDataOld = productPropertiesArray.find(f => f.propertyId === phsicalPropertiseId);
      if (!_.isEmpty(physicalPropDataOld)) {
        physicalPropDataOld.value = phsicalPropertiseString ? phsicalPropertiseString : '';
        physicalPropDataOld.isObject = true;
        updatedProductProperties.push(physicalPropDataOld);
      } else {
        updatedProductProperties.push(physicalPropData);
      }
      const proteinPowderDataOld = productPropertiesArray.find(f => f.propertyId === proteinPowderContentId);
      if (!_.isEmpty(proteinPowderDataOld)) {
        proteinPowderDataOld.value = proteinPowderContentString ? proteinPowderContentString : '';
        proteinPowderDataOld.isObject = true;
        updatedProductProperties.push(proteinPowderDataOld);
      } else {
        updatedProductProperties.push(proteinPowderData);
      }
      const colorimeterSpecDataOld = productPropertiesArray.find(f => f.propertyId === colorimeterSpecificationsId);
      if (!_.isEmpty(colorimeterSpecDataOld)) {
        colorimeterSpecDataOld.value = colorimeterSpecificationsString ? colorimeterSpecificationsString : '';
        colorimeterSpecDataOld.isObject = true;
        updatedProductProperties.push(colorimeterSpecDataOld);
      } else {
        updatedProductProperties.push(colorimeterSpecData);
      }
      const cleanRoomDataOld = productPropertiesArray.find(f => f.propertyId === cleanRoomSpecificationsId);
      if (!_.isEmpty(cleanRoomDataOld)) {
        cleanRoomDataOld.value = cleanRoomSpecificationsString ? cleanRoomSpecificationsString : '';
        cleanRoomDataOld.isObject = true;
        updatedProductProperties.push(cleanRoomDataOld);
      } else {
        updatedProductProperties.push(cleanRoomData);
      }
      const ionicBurdenDataOld = productPropertiesArray.find(f => f.propertyId === ionicBurdenId);
      if (!_.isEmpty(ionicBurdenDataOld)) {
        ionicBurdenDataOld.value = ionicBurdenString ? ionicBurdenString : '';
        ionicBurdenDataOld.isObject = true;
        updatedProductProperties.push(ionicBurdenDataOld);
      } else {
        updatedProductProperties.push(ionicBurdenData);
      }

      // Thickness 
      const cuffDataOld = productPropertiesArray.find(f => f.propertyId === cuffPropertyId);
      if (!_.isEmpty(cuffDataOld)) {
        cuffDataOld.value = cuffDataString ? cuffDataString : '';
        updatedProductProperties.push(cuffDataOld);
      } else {
        updatedProductProperties.push(cuffData);
      }
      const palmPropertyOld = productPropertiesArray.find(f => f.propertyId === palmPropertyId);
      if (!_.isEmpty(palmPropertyOld)) {
        palmPropertyOld.value = palmDataString ? palmDataString : '';
        updatedProductProperties.push(palmPropertyOld);
      } else {
        updatedProductProperties.push(palmData);
      }
      const fingerTipPropertyOld = productPropertiesArray.find(f => f.propertyId === fingerTipPropertyId);
      if (!_.isEmpty(fingerTipPropertyOld)) {
        fingerTipPropertyOld.value = fingertipDataString ? fingertipDataString : '';
        updatedProductProperties.push(fingerTipPropertyOld);
      } else {
        updatedProductProperties.push(fingertipData);
      }
      
      // Carton Specification / Packing Specifications / Packing Specifications
      const cartonSpecificationDataOld = productPropertiesArray.find(f => f.propertyId === cartonSpecificationPropertyId);
      if (!_.isEmpty(cartonSpecificationDataOld)) {
        cartonSpecificationDataOld.value = cartonSpecificationPropertyString ? cartonSpecificationPropertyString : '';
        updatedProductProperties.push(cartonSpecificationDataOld);
      } else {
        updatedProductProperties.push(cartonSpecificationData);
      }
      const packingSpecificationDataOld = productPropertiesArray.find(f => f.propertyId === packingSpecificationPropertyId);
      if (!_.isEmpty(packingSpecificationDataOld)) {
        packingSpecificationDataOld.value = packingSpecificationPropertyString ? packingSpecificationPropertyString : '';
        updatedProductProperties.push(packingSpecificationDataOld);
      } else {
        updatedProductProperties.push(packingSpecificationData);
      }
      const packingInstructionsPropertiesDataOld = productPropertiesArray.find(f => f.propertyId === packingInstructionsPropertyId);
      if (!_.isEmpty(packingInstructionsPropertiesDataOld)) {
        packingInstructionsPropertiesDataOld.value = packingInstructionsPropertyString ? packingInstructionsPropertyString : '';
        updatedProductProperties.push(packingInstructionsPropertiesDataOld);
      } else {
        updatedProductProperties.push(packingInstructionsPropertiesData);
      }

      // Big Slipsheet / Small Slip Sheet / Fumigated Pallets
      const bigSlipsheetDataOld = productPropertiesArray.find(f => f.propertyId === bigSlipsheetPropertyId);
      if (!_.isEmpty(bigSlipsheetDataOld)) {
        bigSlipsheetDataOld.value = bigSlipsheetPropertyString ? bigSlipsheetPropertyString : '';
        updatedProductProperties.push(bigSlipsheetDataOld);
      } else {
        updatedProductProperties.push(bigSlipsheetData);
      }
      const smallSlipDataOld = productPropertiesArray.find(f => f.propertyId === smallSlipPropertyId);
      if (!_.isEmpty(smallSlipDataOld)) {
        smallSlipDataOld.value = smallSlipPropertyString ? smallSlipPropertyString : '';
        updatedProductProperties.push(smallSlipDataOld);
      } else {
        updatedProductProperties.push(smallSlipData);
      }
      const fumigatedPalletsDataOld = productPropertiesArray.find(f => f.propertyId === fumigatedPalletsPropertyId);
      if (!_.isEmpty(fumigatedPalletsDataOld)) {
        fumigatedPalletsDataOld.value = fumigatedPalletsPropertyString ? fumigatedPalletsPropertyString : '';
        updatedProductProperties.push(fumigatedPalletsDataOld);
      } else {
        updatedProductProperties.push(fumigatedPalletsData);
      }

      productPropertiesArray.forEach(singleProperty => {
        this.colorData.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            colorData = singleProperty;
            return;
          }
        });
        this.materialData.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            materialData = singleProperty;
            return;
          }
        });
        this.donningData.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            doningData = singleProperty;
            return;
          }
        });
        this.gripData.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            gripData = singleProperty;
            return;
          }
        });
        this.textureData.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            textureData = singleProperty;
            return;
          }
        });
        this.typeConfigurationProperties.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            typeConfigData = singleProperty;
            return;
          }
        });
        this.formerTypeProperties.forEach(f => {
          if (parseInt(singleProperty.propertyId) === parseInt(f.id)) {
            formerTypeData = singleProperty;
            return;
          }
        });
      });
      
      
      colorData.value = selectedColor ? selectedColor.name : '';
      colorData.propertyId = color;
      delete colorData.productVariationId;
      delete colorData.productVariation;
      delete colorData.property;
      updatedProductProperties.push(colorData);
      
      materialData.value = selectedMaterial ? selectedMaterial.name : '';
      materialData.propertyId = material;
      delete materialData.productVariationId;
      delete materialData.productVariation;
      delete materialData.property;
      updatedProductProperties.push(materialData);
      
      doningData.value = selectedDonning ? selectedDonning.name : '';
      doningData.propertyId = coatingDonning;
      delete doningData.productVariationId;
      delete doningData.productVariation;
      delete doningData.property;
      updatedProductProperties.push(doningData);
      
      gripData.value = selectedGrip ? selectedGrip.name : '';
      gripData.propertyId = coatingGrip;
      delete gripData.productVariationId;
      delete gripData.productVariation;
      delete gripData.property;
      updatedProductProperties.push(gripData);
      
      textureData.value = selectedTextrue ? selectedTextrue.name : '';
      textureData.propertyId = texture;
      delete textureData.productVariationId;
      delete textureData.productVariation;
      delete textureData.property;
      updatedProductProperties.push(textureData);
      
      typeConfigData.value = selectedTypeConfig ? selectedTypeConfig.name : '';
      typeConfigData.propertyId = typeConfig;
      delete typeConfigData.productVariationId;
      delete typeConfigData.productVariation;
      delete typeConfigData.property;
      updatedProductProperties.push(typeConfigData);
      
      formerTypeData.value = selectedFormerType ? selectedFormerType.name : '';
      formerTypeData.propertyId = formerType;
      delete formerTypeData.productVariationId;
      delete formerTypeData.productVariation;
      delete formerTypeData.property;
      updatedProductProperties.push(formerTypeData);

      productProperties = updatedProductProperties;
    }

    // remove product property if it's empty 
    productProperties = productProperties.filter(f => f.value && f.propertyId);
    return productProperties;
  }

  getSizes(action, specificationsSizes) {
    const singleProduct = this.singleProductData;
    const sizeArray = this.sizeSpecificationProperties;
    let productVariations = [];

    if (specificationsSizes && specificationsSizes.length > 0) {      
      specificationsSizes.forEach(sizes => {
        const tL = {
          min: sizes.lengthMin,
          max: sizes.lengthMax,
          target: sizes.lengthTarget
        }
        const pW = {
          min: sizes.widthMin,
          max: sizes.widthMax,
          target: sizes.widthTarget
        }
        const wE = {
          min: sizes.weightMin,
          max: sizes.weightMax,
          target: sizes.weightTarget
        }
        
        let obj = {
          variationId: sizes.data.value,          
          productProperties: [
            {
              propertyId: Utils.getStaticPropertyByName(sizeArray, 'Total Length'),
              value: JSON.stringify(tL),
              isObject: true              
            },
            {
              propertyId: Utils.getStaticPropertyByName(sizeArray, 'Palm Width'),
              value: JSON.stringify(pW),
              isObject: true
            },
            {
              propertyId: Utils.getStaticPropertyByName(sizeArray, 'Weight'),
              value: JSON.stringify(wE),
              isObject: true
            }
          ]
        }

        //check update case
        if (action === 'update') {
          singleProduct.productVariations.forEach(oldSize => {
            if (oldSize.variationId === sizes.data.value) {
              obj = {
                ...oldSize
              }
              obj.productProperties.forEach(p => {
                if (p.propertyId === Utils.getStaticPropertyByName(sizeArray, 'Total Length')) {
                  p.value = JSON.stringify(tL);
                }
                if (p.propertyId === Utils.getStaticPropertyByName(sizeArray, 'Palm Width')) {
                  p.value = JSON.stringify(pW);
                }
                if (p.propertyId === Utils.getStaticPropertyByName(sizeArray, 'Weight')) {
                  p.value = JSON.stringify(wE);
                }
              });
            }
          });
        }
        productVariations.push(obj);
      });
    }  
    return productVariations;
  }  

  selectProductCodeProperty(id, key) {
    if (key === 'material') {
      const val = this.materialData.find(f => f.id === id);
      this.accountFormGroup.controls.productCodeL.patchValue(val.name[0]);
    }
    if (key === 'grip') {
      const val = this.gripData.find(f => f.id === id);
      this.accountFormGroup.controls.productCodeC.patchValue(val.name[0]);
    }
    if (key === 'texture') {
      const val = this.textureData.find(f => f.id === id);
      this.accountFormGroup.controls.productCodeT.patchValue(val.name[0]);
    }
    if (key === 'color') {
      const val = this.colorData.find(f => f.id === id);
      this.accountFormGroup.controls.productCodeWidth.patchValue(val.name[0]);
    }
    if (key === 'type') {
      const val = this.typeConfigurationProperties.find(f => f.id === id);
      this.accountFormGroup.controls.productCodeS.patchValue(val.name[0]);
    }
  }

  formatCurrencyTaxableValue(event) {
    const value = event.target.value;
    const price = parseFloat(value.trim()).toFixed(2);
    this.accountFormGroup.controls.unitPrice.patchValue(price);
  }

  onPackingSpecChange(index) {
    const packingDetailsForm  = this.packingDetailsFormGroup.value;
    const packingValues = packingDetailsForm.packing_specifications;
    const pcsBox = packingValues[index].pcsBox;
    const boxCarton = packingValues[index].boxCarton;
    const totalCarton = parseInt(pcsBox ? pcsBox : 0) * parseInt(boxCarton ? boxCarton : 0);
    let controlArray = <FormArray>this.packingDetailsFormGroup.controls['packing_specifications'];  
    controlArray.controls[index].patchValue({
      pcsCarton: totalCarton
    });
  }

  onCartonSpecChange(index) {
    const packingDetailsForm  = this.packingDetailsFormGroup.value;
    const cartonSpecValues = packingDetailsForm.cartoon_specifications;
    const length = cartonSpecValues[index].length;
    const width = cartonSpecValues[index].width;
    const height = cartonSpecValues[index].height;
    const totalVolume = (parseInt(length ? length : 0) * parseInt(width ? width : 0) * parseInt(height ? height : 0)) / 1000000000;
    let controlArray = <FormArray>this.packingDetailsFormGroup.controls['cartoon_specifications'];  
    controlArray.controls[index].patchValue({
      volume: totalVolume.toFixed(2)
    });
  }

  resetForm() {
    this.accountFormGroup = this.fb.group({
      customerId: null,
      pName: null,
      productCategoryId: null,
      brandName: null,
      brandCode: null,
      sizes: new FormControl([]),
      multipleCustomer: new FormControl([]),
      color: null,
      texture: null,
      material: null,
      typeConfig: null,
      coatingDonning: null,
      coatingGrip: null,
      unitPrice: null,
      formerType: null,
      productCodeL: null,
      productCodeS: null,
      productCodeC: null,
      productCodeT: null,
      productCodeSize: null,
      productCodeWidth: null,
      productCodeCr: null,

      hasMultipleCustomer: false,
      hasQualityAssuranceStandard: false,
      hasProteinAndPowderCotent: false,
      hasPhysicalProperties: false,
      hasColorimeterReadingSpecifications: false,
      hasCleanroomSpecifications: false,

      bName: null,

      chracterstics: null,
      charLevelSizes: "s-2",
      charAql: "4.0",

      phsPropertise: [{
        value: 'Physical Properties',
        disabled: true
      }],
      phLevelSizes: "s-2",
      phAql: "4.0",

      waterTight: [{
        value: "Water Tight",
        disabled: true
      }],
      waterSizes: "g-1",
      waterAql: "0.65",

      visualProperty: [{
        value: "Visual Defect (Major)",
        disabled: true
      }],
      visualSizes: "g-1",
      visualAql: "2.5",

      visualDefectMinorProperty: [{
        value: "Visual Defect (Minor)",
        disabled: true
      }],
      visualDefactMinorSizes: "g-1",
      visualDefactMonorAql: "4.0",

      citicalDefectProperty: [{
        value: "Critical Defect",
        disabled: true
      }],
      citicalDefectLevel: "g-1",
      citicalDefectAql: "4.0",

      protainContent: [{
        value: "Protein Content",
        disabled: true
      }],
      protainReferencceStandard: "astm-d-6319",
      protainAmount: [{
        value: "2 (max)",
        disabled: true
      }],

      powderContent: [{
        value: "Protein Content",
        disabled: true
      }],
      powderReferencceStandard: "astm-d-5712",
      powderAmount: [{
        value: "N/A",
        disabled: true
      }],

      lValue: [{
        value: "L-Value",
        disabled: true
      }],
      lValueMinimum: null,
      lValueTarget: null,
      lValueMaximum: null,

      AValue: [{
        value: "A-Value",
        disabled: true
      }],
      AValueMinimum: null,
      AValueTarget: null,
      AValueMaximum: null,

      phsical_propertise:
        this.fb.array([
          this.fb.group({ refStandard: "", agigingType: "", tEtype: "elongation" })
        ]) || [],

      BValue: [{
        value: "B-Value",
        disabled: true
      }],
      BValueMinimum: null,
      BValueTarget: null,
      BValueMaximum: null,

      
      ion_points:
        this.fb.array([this.fb.group({ anion: "", count: "" })]) || [],
      ion_cartons:
        this.fb.array([this.fb.group({ cations: "", count: "" })]) || []



    });

    this.passwordFormGroup.reset();
    this.loadPlanFormGroup.reset();
    this.confirmFormGroup.reset();
    this.variantsFormGroup.reset();
    this.packingDetailsFormGroup.reset();
    this.loanPlanFormGroup.reset();

  }

  selectTab(tab) {
    this.selectedTab.setValue(tab);
  }
}
