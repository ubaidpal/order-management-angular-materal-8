import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import icSettings from "@iconify/icons-ic/settings";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "order-gear-dropdown",
  templateUrl: "./gear-order-dropdown.component.html",
  styleUrls: ["./gear-order-dropdown.component.scss"]
})
export class ProductOrderGearComponent implements OnInit {
  public href: string = "";
  public selectedVal: string;
  icSettings = icSettings;
  types = [
    { code: "orders", name: "Products View" },
    { code: "products", name: "Orders View" }
  ];
  @Output() modeChange = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit() {
    this.href = this.router.url;
    this.selectedVal = this.href;
  }
  public onValChange(val: string) {
    switch (val) {
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
  navigateTo(item) {
    this.modeChange.emit(item);
  }
}
