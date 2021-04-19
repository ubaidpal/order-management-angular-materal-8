import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import icStar from '@iconify/icons-ic/twotone-star';
import { scaleIn400ms } from '../../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../../@vex/animations/fade-in-right.animation';
import { TableColumn } from '../../../../../../@vex/interfaces/table-column.interface';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { stagger40ms } from '../../../../../../@vex/animations/stagger.animation';

import { Order } from '../../interfaces/order.interface';
import { orderData } from '../../../../../../static-data/orders';

import icMenu from '@iconify/icons-ic/twotone-menu';
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
import icDetails from '@iconify/icons-ic/details';
import icUsers from '@iconify/icons-ic/people';

@Component({
  selector: 'users-order-table-detail',
  templateUrl: './users-order-table.component.html',
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class UsersOrderTableComponent implements OnInit {

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
  icUsers = icUsers;
  icDetails = icDetails;
  addEditModal = null;
  searchCtrl = new FormControl();
  inputType = 'password';
  visible = false;
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  menuOpen = false;

  activeCategory: 'frequently' | 'starred' | 'all' | 'family' | 'friends' | 'colleagues' | 'business' = 'all';
  tableData = orderData;
  tableColumns: TableColumn<Order>[] = [
    
    {
      label: 'PI NUMBER',
      property: 'piNumber',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'City',
      property: 'city',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Order Qty',
      property: 'orderQty',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Order Rate',
      property: 'orderRate',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Shipment Date',
      property: 'shipmentDate',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Remaining',
      property: 'remaining',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'status',
      property: 'status',
      type: 'text',
      cssClasses: ['text-secondary']
    }
  ];

  icStar = icStar;
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;

  constructor() { }

  ngOnInit() {
  }

  openUser(id?: Order['id']) {
  
  }

  setData(data: Order[]) {
    this.tableData = data;
    this.menuOpen = false;
  }

  openMenu() {
    this.menuOpen = true;
  }
  openOrder(order_id){
    //alert(order_id);
  }
 
}
