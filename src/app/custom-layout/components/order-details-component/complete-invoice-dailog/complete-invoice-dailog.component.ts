import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import * as _ from 'underscore';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
  selector: 'vex-complete-invoice-dailog',
  templateUrl: './complete-invoice-dailog.component.html',
  styleUrls: ['./complete-invoice-dailog.component.scss']
})
export class CompleteInvoiceDailogComponent implements OnInit {

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
  invoiceDetails:any;
  lastShipmentDate:any;
  productsArray:any=[];
  variationsArray:any=[];
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CompleteInvoiceDailogComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
   
    if(this.invoiceDetails.shipmentDates && this.invoiceDetails.shipmentDates.length > 0){
      
      let last:any  = this.invoiceDetails.shipmentDates[this.invoiceDetails.shipmentDates.length-1];
      this.lastShipmentDate = last.newShipmentDate;
  
    }else{
      this.lastShipmentDate = this.invoiceDetails.shipmentDate;
    }
   
    this.form = this.fb.group({
      invoiceId: this.invoiceDetails.id ? this.invoiceDetails.id : '',
      shipmentDate: this.lastShipmentDate,
      shippedOn: ['', RxwebValidators.required()],
      vesselId: ['', RxwebValidators.required()]
    })

  }
  submit() {    
    const data = this.form.value;
    this.dialogRef.close(data);
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
}
