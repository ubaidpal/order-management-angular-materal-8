import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllOrders } from '../../models/allorders.model';
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


import { AlertService } from '../../../../alert/alert.service';
@Component({
  selector: 'open-order-create-update',
  templateUrl: './open-order-create-update.component.html',
  styleUrls: ['./open-order-create-update.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class OpenOrderCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  public show:boolean = false;
  public buttonName:any = 'Show addtional Information';

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

  serverData = [];
  subTotal: number;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<OpenOrderCreateUpdateComponent>,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as AllOrders;
    }

    this.form = this.fb.group({
      id: [OpenOrderCreateUpdateComponent.id++],
      customer: [this.defaults.customer || ''],
      fromPort: [this.defaults.fromPort || ''],
      poNumber: this.defaults.poNumber || '',
      branch: this.defaults.branch || '',
      piNumber: [this.defaults.piNumber || ''],
      poDate: this.defaults.poDate || '',
      shipTo: this.defaults.shipTo || '',
      piDate: this.defaults.piDate || '',
      currency: this.defaults.currency || '',
      country: this.defaults.country || '',
      shipmentDate: this.defaults.shipmentDate || '',
      orderPrize: this.fb.array([]) || [],
      paymentTerms: this.defaults.paymentTerms || '',
      specialClause: this.defaults.specialClause || '',

      contactPerson: this.defaults.contactPerson || '',
      shipBy: this.defaults.shipBy || '',
      transhipment: this.defaults.transhipment || '',
      contactDetails: [{value: this.defaults.contactDetails,  disabled: true}] || [{value: '',  disabled: true}],
      deleveryTerms: this.defaults.deleveryTerms || '',
      orginOFGoods: this.defaults.orginOFGoods || '',
      type: this.defaults.type || ''
    });
    this.data();

  }
  get orderPrize() {
    return this.form.get("orderPrize") as FormArray;
  }
  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;

    if (!customer.imageSrc) {
      customer.imageSrc = 'assets/img/avatars/1.jpg';
    }

    this.dialogRef.close(customer);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  private data() {
    this.serverData = this.defaults.orderPrize;

    if (this.serverData) {
      this.serverData.map(d =>
        this.orderPrize.push(this.fb.group({
          itemName: d.itemName, size: d.size, cartons: d.cartons, price: d.price,
          currency: d.currency, prizeCartan: d.prizeCartan, totalValue: d.totalValue,
        }))
      );
    }

  }

  // get persons() : FormArray {
  //   return this.form.get("persons") as FormArray
  // }

  newPerson(): FormGroup {
    return this.fb.group({
      itemName: '',
      size: '',
      cartons: '0',
      price: '',
      currency: '',
      prizeCartan: '',
      totalValue: ''
    })
  }
  addMoreField() {
    if (!this.serverData) {
      this.serverData = [];
    }
    this.serverData.push({
      itemName: '',
      size: '',
      cartons: '',
      price: '',
      currency: '',
      prizeCartan: '',
      totalValue: ''
    });

    this.orderPrize.push(this.newPerson());


  }

  removeField(key: number) {

    if (confirm("are you sure you want to delete it? ")) {
      const val = this.orderPrize.value;
      val.splice(key, 1);
      if(this.defaults.orderPrize){
        this.defaults.orderPrize.splice(key, 1);
      }else{
        this.serverData.splice(key, 1);
     
      }
      
    }

    // this.alertService.confirm("Are you Sure?", function () {

    // }, function () {
    //   //ACTION: Do this if user says NO
    // })

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
    if(this.show)  
      this.buttonName = "Hide addtional Information";
    else
      this.buttonName = "Show addtional Information";
  }
  

}
