import { Component, OnInit, Input, Inject, EventEmitter } from "@angular/core";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDetails from "@iconify/icons-ic/details";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import keyboardArrowUp from "@iconify/icons-ic/keyboard-arrow-up";
import keyboardArrowDown from "@iconify/icons-ic/keyboard-arrow-down";
import icCallSplit from "@iconify/icons-ic/call-split";
import icClose from "@iconify/icons-ic/twotone-close";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPhone from "@iconify/icons-ic/twotone-phone";

import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { Observable } from "rxjs";

import { map, startWith } from "rxjs/operators";
import icArrowDropDown from "@iconify/icons-ic/twotone-arrow-drop-down";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from "underscore";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import Utils from 'src/app/custom-layout/_utils/utils';

export interface Products {
  id: number;
  name: string;
}
@Component({
  selector: "vex-add-products-dailog",
  templateUrl: "./add-products-dailog.component.html",
  styleUrls: ["./add-products-dailog.component.scss"],
})
export class AddProductsDailogComponent implements OnInit {
  layoutCtrl = new FormControl("fullwidth");

  stateCtrl: FormControl;
  filteredProducts$: any;
  productsList: any[];
  singleProduct: any = [];

  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  icDetails = icDetails;
  keyboardArrowUp = keyboardArrowUp;
  keyboardArrowDown = keyboardArrowDown;
  icClose = icClose;
  icCallSplit = icCallSplit;
  icArrowDropDown = icArrowDropDown;

  totalSizesSelected: boolean = false;
  veriations: any = [];
  checked: boolean = true;
  packingSpecificationsProperties: any = [];
  orderPrizeArray: any = [];
  getCurrencyName: any;
  products: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<AddProductsDailogComponent>,
    private fb: FormBuilder
  ) {}

  form: FormGroup;

  keyword = "name";
  optionsData = [];
  initialValue = "";

  ngOnInit() {
    this.form = this.fb.group({
      name: [{value: '', disabled: false}, RxwebValidators.required()],
      isChecked: false,
      varriantsArray: this.fb.array([]),
      selectedProduct: "",
    });
    const props = this.dialogRef.componentInstance.defaults;

    this.veriations = props.veriations ? props.veriations : [];
    this.products = props.products ? props.products : [];
    this.singleProduct = props.singleProduct ? props.singleProduct : [];
    this.orderPrizeArray = props.orderPrizeArray;

    this.packingSpecificationsProperties = props.packingSpecificationsProperties
      ? props.packingSpecificationsProperties
      : [];
    this.getCurrencyName = props.getCurrencyName;

    if (this.products) {
      this.optionsData = _.map(this.products, (f: any) => {
        return {
          id: f.id,
          name: f.name,
          productVariations: f.productVariations,
          productProperties: f.productProperties
        };
      });
      this.optionsData = _.sortBy(this.optionsData, 'name');

      if (this.optionsData && this.optionsData.length > 0) {
        this.initialValue = this.singleProduct.name;

        this.form.patchValue({
          selectedProduct: this.singleProduct,
          name: this.singleProduct.name
        });
        
        this.selectProductVariant(this.singleProduct);
      }
    }
  }

  get varriantsArray() {
    return this.form.get("varriantsArray") as FormArray;
  }

  patchVariantsData(varriantsArray) {
    const orderPrizeArray = this.orderPrizeArray;
    const products = this.products;
    let v: any = [];
    varriantsArray.forEach((f) => {
      const prodcut = products.find((p) => p.id === f.productId);
      const unitPrice = prodcut && prodcut.unitPrice ? prodcut.unitPrice : "";
      let obj = {
        ...f,
        isChecked: false,
        cartons: '',
        price: 0.0,
        pieces: 0,
        totalValue: 0,
        itemId: f.itemId ? f.itemId : "",
      };
      orderPrizeArray.forEach((d) => {
        if (d.size === f.id) {
          obj = {
            ...f,
            ...d,
            isChecked: true,
          };
        }
      });

      if (!obj.price) {
        obj.price = unitPrice ? parseFloat(unitPrice).toFixed(2) : 0;
      }
      v.push(obj);
    });
    v = _.sortBy(v, "variationId");
    this.setVariants(v);
  }

  selectProductVariant(e) {
    const value = e;
    if (value && value.id) {
      this.form.patchValue({
        selectedProduct: value,
      });
    }
    const product = this.form.value.selectedProduct;
    if (product && product.id) {
      this.singleProduct = product ? product : [];
      const v =
        product && product.productVariations
          ? _.sortBy(product.productVariations, "variationId")
          : [];
      this.patchVariantsData(v);
    }
  }

  setVariants(v) {
    const oldData = this.form.value.varriantsArray;
    if (oldData && oldData.length > 0) {
      let keys = Object.keys(oldData);
      keys = keys.reverse();
      keys.forEach((k) => this.varriantsArray.removeAt(parseInt(k)));
    }

    v.forEach((element) => {
      this.varriantsArray.push(
        this.fb.group({
          ...element,
          price: [element.price, RxwebValidators.required()],
          cartons: [element.cartons, RxwebValidators.required()],
        })
      );
    });

  }

  getSizeName(variationNameid?: number) {
    const variationName = this.veriations.find(
      (elm) => elm.id == variationNameid
    );
    return variationName.name ? variationName.name : "";
  }

  onCheckboxClick(e, index) {
    this.varriantsArray.controls[index].patchValue({
      isChecked: e,
    });
    let allUncheckCount = 0;
    let allcheckedCount = 0;
    this.varriantsArray.value.forEach((f) => {
      if (!f.isChecked) {
        allUncheckCount++;
      }
      if (f.isChecked) {
        allcheckedCount++;
      }
    });
    if (allUncheckCount > 0) {
      this.totalSizesSelected = false;
    }
    if (allcheckedCount === this.varriantsArray.length) {
      this.totalSizesSelected = true;
    }
  }

  allSizesSelect() {
    this.totalSizesSelected = !this.totalSizesSelected;
    if (this.totalSizesSelected) {
      this.varriantsArray.value.forEach((v, i) => {
        this.varriantsArray.controls[i].patchValue({
          isChecked: true,
        });
      });
    } else {
      this.varriantsArray.value.forEach((v, i) => {
        this.varriantsArray.controls[i].patchValue({
          isChecked: false,
        });
      });
    }
  }

  // calculations
  onVariantSelect(variantId, index) {
    const orderPrize = this.form.value.orderPrize[index];
    const cartons = orderPrize.cartons ? orderPrize.cartons : 0;
    this.onFieldChange(cartons, index, "cartons");
  }

  onFieldChange(value, index, action) {
    const varitionsObj = this.varriantsArray.value[index]
      ? this.varriantsArray.value[index]
      : [];
    const productProperties =
      this.singleProduct && this.singleProduct.productProperties
        ? this.singleProduct.productProperties
        : [];
    const packingSpecificationsProperties = this
      .packingSpecificationsProperties;

    let packingSpecData: any = [];
    let pcsCarton: any = 0;
    if (action === "cartons") {
      productProperties.forEach((pp) => {
        packingSpecificationsProperties.forEach((f) => {
          if (f.id === pp.propertyId) {
            packingSpecData = !_.isEmpty(pp) ? JSON.parse(pp.value) : [];
          }
        });
      });
      if (packingSpecData && packingSpecData.length > 0) {
        packingSpecData.forEach((f) => {
          if (f && f.data && f.data.value === varitionsObj.variationId) {
            pcsCarton = f.pcsCarton;
          }
        });
      }
      
      this.varriantsArray.controls[index].patchValue({
        cartons: value ? value : '',
        pieces:
          parseInt(value ? value : 0) * parseInt(pcsCarton ? pcsCarton : 0),
      });
    } else if (action === "price") {
      let val = Utils.decimalValidation(value);
      this.varriantsArray.controls[index].patchValue({
        price: val,
      });
    }

    if (
      this.varriantsArray.value[index].cartons ||
      this.varriantsArray.value[index].price
    ) {
      this.varriantsArray.controls[index].patchValue({
        isChecked: true,
      });
    } else {
      this.varriantsArray.controls[index].patchValue({
        isChecked: false,
      });
    }
    this.totalValueCalclation(index);
  }

  totalValueCalclation(index) {
    const varitionsObj = this.varriantsArray.value[index];
    const cartons = varitionsObj.cartons;
    const price = varitionsObj.price;
    const total: any = cartons * price;
    this.varriantsArray.controls[index].patchValue({
      totalValue: total ? parseFloat(total).toFixed(2) : 0,
    });
  }

  checkNumberValidation(e, name, index) {
    const val = Utils.getValidPhoneNumber(e.target.value);
    this.varriantsArray.controls[index].patchValue({
      [name]: val
    });
  }
  twoDecimal(e, name, index) {
    let value = e.target.value;
    value = value ? parseFloat(value).toFixed(2) : 0;
    this.varriantsArray.controls[index].patchValue({
      [name]: value
    });
  }

  submit() {
    const singleProductId: any = this.singleProduct
      ? this.singleProduct.id
      : "";

    const productData = [];
    if (this.varriantsArray && this.varriantsArray.length > 0) {
      this.varriantsArray.value.forEach((veration, key) => {
        if (veration.isChecked) {
          productData.push({
            itemId: veration.itemId ? veration.itemId : "",
            itemName: veration.productId ? veration.productId : "",
            size: veration.id ? veration.id : "",
            cartons: veration.cartons ? veration.cartons : "",
            pieces: veration.pieces,
            price: veration.price ? parseFloat(veration.price).toFixed(2) : 0,
            totalValue: veration.totalValue,
          });
        }
      });
    }
    
    this.dialogRef.close({ data: productData, productId: singleProductId });
  }
}
