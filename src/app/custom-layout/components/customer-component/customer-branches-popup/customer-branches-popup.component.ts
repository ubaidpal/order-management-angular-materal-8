import { Component, Inject, OnInit, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Branch } from "../interfaces/branch.interface";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icClose from "@iconify/icons-ic/twotone-close";
import icPrint from "@iconify/icons-ic/twotone-print";
import icDownload from "@iconify/icons-ic/twotone-cloud-download";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icPerson from "@iconify/icons-ic/twotone-person";
import icMyLocation from "@iconify/icons-ic/twotone-my-location";
import icLocationCity from "@iconify/icons-ic/twotone-location-city";
import icEditLocation from "@iconify/icons-ic/twotone-edit-location";
import icUser from "@iconify/icons-ic/people";

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

import { fadeInUp400ms } from "../../../../../@vex/animations/fade-in-up.animation";
import { CustomerService } from "../../../_services/customer.service";
import { AlertService } from "../../../alert/alert.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "../../../../../@vex/interfaces/table-column.interface";
import { Title } from "@angular/platform-browser";
import { SelectionModel } from "@angular/cdk/collections";
import { FormControl } from "@angular/forms";
import { first, filter } from "rxjs/operators";
import { Observable, of, ReplaySubject } from "rxjs";
import { untilDestroyed } from "ngx-take-until-destroy";
import { stagger40ms } from "../../../../../@vex/animations/stagger.animation";
import { Router } from '@angular/router';

@Component({
  selector: "vex-customer-branches-popup",
  templateUrl: "./customer-branches-popup.component.html",
  styleUrls: ["./customer-branches-popup.component.scss"],
  animations: [fadeInUp400ms, stagger40ms],
})
export class CustomerBranchesPopupComponent implements OnInit {
  layoutCtrl = new FormControl("fullwidth");
  showBranchesLoading: boolean = false;
  customerId: any;

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

  filteredBranchData: any = [];

  subject$: ReplaySubject<Branch[]> = new ReplaySubject<Branch[]>(1);
  data$: Observable<Branch[]> = this.subject$.asObservable();
  customerData: any = [];
  customers: Branch[];
  country: any;
  role: any;
  state: any;
  obj: any;
  newBranch: any = [];
  createCustomerModal: any;

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Branch> | null;
  selection = new SelectionModel<Branch>(true, []);
  searchCtrl = new FormControl();

  countryName: any;

  @Input()
  columns: TableColumn<Branch>[] = [
    // {
    //   label: "Checkbox",
    //   property: "checkbox",
    //   type: "checkbox",
    //   visible: false
    // },
    //{ label: 'Image', property: 'image', type: 'image', visible: true },
    {
      label: "Id",
      property: "id",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"]
    },
    {
      label: "Name",
      property: "name",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"]
    },
    { label: "Country", property: "country", type: "text", visible: true },
    {
      label: "Address Line 1",
      property: "addressLine1",
      type: "text",
      visible: true,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Address Line 2",
      property: "addressLine2",
      type: "text",
      visible: true,
      cssClasses: ["text-secondary", "font-medium"]
    },
    { label: "City", property: "city", type: "text", visible: true },
    {
      label: "State",
      property: "state",
      type: "text",
      visible: true,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Post Code",
      property: "postCode",
      type: "text",
      visible: true,
      cssClasses: ["text-secondary", "font-medium"]
    },
    {
      label: "Phone Number",
      property: "phone",
      type: "text",
      visible: false,
      cssClasses: ["text-secondary", "font-medium"]
    },
    { label: "Actions", property: "actions", type: "button", visible: true }
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CustomerBranchesPopupComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private alertService: AlertService,
    private titleService: Title,
    private router: Router
  ) {
    //this.titleService.setTitle("Customer");
    setTimeout(() => {
      const props = this.dialogRef.componentInstance.defaults;
      this.getBranchesByCustomerId(props.customerId);
    }, 10);

    this.getCountry(); // All Countries
    this.getStates(); // all States
  }

  get visibleColumns() {
    return this.columns
      .filter(column => column.visible)
      .map(column => column.property);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<Branch[]>(Boolean)).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  getBranchesByCustomerId(cId) {
    this.showBranchesLoading = true;
    this.filteredBranchData = [];
    this.customerService
      .getBranchesByCustomerId(cId) // get countries
      .pipe(first())
      .subscribe(
        (data:any) => {
          if (data != null) {
            this.dataSource.data = data;
          
          }
        },
        err => {
          this.alertService.clear();
          this.alertService.error(err);
          this.showBranchesLoading = false;
        }
      );
  }

  getCountryName(id?: number) {
    if (this.country) {
      this.countryName = this.country.find(elm => elm.id == id);

      if (this.countryName) {
        return this.countryName.name;
      } else {
        return "";
      }
    }
  }

  getCountry() {
    return this.customerService
      .getCountry()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.country = data;
        }
      });
  }
  getStates() {
    return this.customerService
      .getStates()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.state = data;
        }
      });
  }
  navigateToBranches(bId?:number, cId?:number){
    this.router.navigate(['branches-details', { branchId: bId, cId: cId }]);
  }
  ngOnDestroy() {}
}
