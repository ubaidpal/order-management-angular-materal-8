import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { orderData } from '../../../../../../../static-data/orders';
import { Icon } from '@visurel/iconify-angular';
import { Order } from '../../../interfaces/order.interface';
import { fadeInRight400ms } from '../../../../../../../@vex/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from '../../../../../../../@vex/animations/stagger.animation';


export interface UsersOrderTableMenu {
  type: 'link' | 'subheading' ; 
  id?:  'newOrders' |  'inProgress' | 'complete' | 'shipped' | "outStanding";
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}

@Component({
  selector: 'users-order-table-menu',
  templateUrl: './users-order-table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class UsersOrderTableMenuComponent implements OnInit {

  getNewOrders = null;
  getInProgress = null;
  getIsCompleted = null;
  getIsShipped = null;
  getOutStanding = null;
  @Input() items: UsersOrderTableMenu[] = [
    {
      type: 'link',
      id: 'newOrders',
      label: 'NEW ORDERS'
    },
     {
      type: 'link',
      id: 'inProgress',
      label: 'IN PROGRESS'
    },
    {
      type: 'link',
      id: 'shipped',
      label: 'SHIPPED'
    },
    {
      type: 'link',
      id: 'complete',
      label: 'COMPLETE'
    },
    {
      type: 'link',
      id: 'outStanding',
      label: 'OUT STANDING'
    }
  
  ];

  @Output() filterChange = new EventEmitter<Order[]>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: UsersOrderTableMenu['id'] = 'newOrders';
  icPersonAdd = icPersonAdd;

  constructor() { }

  ngOnInit() {
    this.isgetNewOrders();
   this.isGetProgress();
   this.isGetComplete();
   this.isGetShipped();
   this.isGetOutStanding();
  }

  setFilter(category: UsersOrderTableMenu['id']) {
    this.activeCategory = category;

    
    if (category === 'newOrders') {
      this.isgetNewOrders();
       // api get all user
      return this.filterChange.emit(orderData);
    }
    if (category === 'inProgress') {
      this.isGetProgress();
      // api get all active user
      return this.filterChange.emit([]);
    }
    if (category === 'complete') {
      this.isGetComplete();
      // api get all active user
      return this.filterChange.emit(orderData);
    }

    if (category === 'shipped') {
      this.isGetShipped();
      // api get all active user
      return this.filterChange.emit(orderData);
    }

    if (category === 'outStanding') {
      this.isGetOutStanding();
      // api get all active user
      return this.filterChange.emit([]);
    }

  
  }

  isActive(category: UsersOrderTableMenu['id']) {
    return this.activeCategory === category;
  }
  isgetNewOrders(){
  
    // Api Call=
  return  this.getNewOrders = '(' + 5500 + ' CTN /127 Orders' + ')';
    
  }
  isGetProgress(){
    // Api Call
  return  this.getInProgress = '(' + 0 + ' CTN /0 Orders' + ')';
    
  }
  isGetComplete(){
    // Api Call
  return  this.getIsCompleted =  '(' + 6000 + ' CTN /127 Orders' + ')';
    
  }
  isGetShipped(){
    // Api Call
  return  this.getIsShipped= '(' + 699 + ' CTN /127 Orders' + ')';
    
  }
  isGetOutStanding(){
    // Api Call
  return  this.getOutStanding = '(' + 0 + ' CTN  /0 Orders' + ')';
    
  }
  
}
