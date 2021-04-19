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
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import Utils from 'src/app/custom-layout/_utils/utils';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'vex-shipment-date-history-dailog',
  templateUrl: './shipment-date-history-dailog.component.html',
  styleUrls: ['./shipment-date-history-dailog.component.scss']
})
export class ShipmentDateHistoryDailogComponent implements OnInit {
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
  invoiceDates:any = [];
  shipmentDate:any = "";

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<ShipmentDateHistoryDailogComponent>,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }
  form: FormGroup;
  ngOnInit() {
console.log('shipmentDate >>', this.shipmentDate)
    this.form = this.fb.group({
      id: '',
      name:  '',
      registrationNumber: '',
      country:  '',
    })

  }

  dateFormate(date) {
    return this.datePipe.transform(date, Utils.getDateFormate());
  }

}
