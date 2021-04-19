import { Component, Input, OnInit } from "@angular/core";
import icHome from "@iconify/icons-ic/twotone-home";
import { trackByValue } from "../../utils/track-by";
import { Router } from '@angular/router';

@Component({
  selector: "vex-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
})
export class BreadcrumbsComponent implements OnInit {
  @Input() crumbs: string[] = [];

  trackByValue = trackByValue;
  icHome = icHome;

  constructor( private router: Router,) { }

  ngOnInit() { }

  backToBranch(cId?:any){
    return this.router.navigate(['customer-details', { cId: cId }]);
  }
  backToOrderDetail(orderId?:any){
    this.router.navigate(['/order-details', { orderId: orderId }]);
  }

  goToPage(crumb?:any){
    let obj = {};
    if (crumb.query && crumb.query.length > 0) {
      crumb.query.forEach((item) => {
        Object.keys(item).forEach(function(key) {
          obj[key] = item[key];
        });
      });
    }
    this.router.navigate([crumb.paramsUrl, obj]);
  }
}
