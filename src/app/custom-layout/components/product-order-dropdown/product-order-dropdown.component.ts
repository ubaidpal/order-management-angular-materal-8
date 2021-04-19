import { Component, OnInit } from '@angular/core';
import icSettings from '@iconify/icons-ic/settings';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router ,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'product-order-dropdown',
  templateUrl: './product-order-dropdown.component.html',
  styleUrls: ['./product-order-dropdown.component.scss']
})
export class ProductOrderDropdownComponent implements OnInit {
  public href: string = "";
  public selectedVal: string;
  icSettings = icSettings;
  types = [
    {code: '/product-view', name: 'Product'},
    {code: '/order-view', name: 'Order'}
  ];
  constructor( private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    this.selectedVal = this.href;
    this.selectedVal = this.selectedVal.substring(0, this.selectedVal.indexOf('view') + 'view'.length);
   
  }
  public onValChange(val: string) {

    switch(val){
      case "/product-view": 
        this.selectedVal = val;
        this.router.navigate(["product-view"]);
        break;
      case "/order-view":
        this.selectedVal = val;
        this.router.navigate(["order-view"]);
      break;
  }
    
  }
  navigateTo(item){

    switch(item){
        case "/product": 
      
          this.router.navigate(["product"]);
          break;
        case "/order":
          this.router.navigate(["order"]);
        break;
    }
}
}
