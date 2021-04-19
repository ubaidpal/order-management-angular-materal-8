import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContactCreateUpdateComponent } from './contact-create-update/contact-create-update.component';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Contact } from './model/contact.model'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { aioTableData, aioTableLabels } from 'src/static-data/contact-table-data';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from 'src/@vex/utils/tailwindcss';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'vex-contact-aio-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ContactTableComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('fullwidth');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Contact[]> = new ReplaySubject<Contact[]>(1);
  data$: Observable<Contact[]> = this.subject$.asObservable();
  customers: Contact[];

  @Input()
  columns: TableColumn<Contact>[] = [

    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Id', property: 'id', type: 'checkbox', visible: false },
    { label: 'Primary', property: 'isPrimary', type: 'text', visible: false },
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Email', property: 'email', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Phone', property: 'phone', type: 'text', visible: true },
    { label: 'Branch', property: 'branchId', type: 'text', visible: true },
    { label: 'Role', property: 'role', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Contact> | null;
  selection = new SelectionModel<Contact>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;

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

  theme = theme;
  branchid = null;
  customerId = null;
  cId = null;
  fetchMainContact: any = [];
  fetchContact: any = [];
  allBranches: any = [];
  role: any;
  branchName: any;
  createContact: any = '';
  modalRef: any = '';
  customerList: any;
  branchesSet: boolean = false;
  addCustomer: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private customerService: CustomerService,
    private titleService: Title,
    private snackbar: MatSnackBar,
  ) {

    this.titleService.setTitle("Contacts");

    this.customerId = this.route.snapshot.paramMap.get('cId');
    this.branchid = this.route.snapshot.paramMap.get('branchId');
    this.cId = this.route.snapshot.paramMap.get('cId');


    this.loadContact();


  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  getData() {

    return of(this.fetchContact.map(customer => new Contact(customer)));
  }


  ngOnInit() {

    this.getBranches();
    //this.getRoles();
    // this.getData().subscribe(customers => {
    //   console.log(customers);
    //   this.subject$.next(customers);
    // });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Contact[]>(Boolean)
    ).subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = customers;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  createCustomer() {

    this.createContact = this.dialog.open(ContactCreateUpdateComponent);

    //  this.modalRef.componentInstance.branch = this.allBranches;
    this.createContact.componentInstance.branchsid = this.branchid;
    this.createContact.componentInstance.cId = this.cId;
    this.createContact.componentInstance.branchesSet = this.branchesSet;
    this.createContact.componentInstance.branch = this.allBranches;

    this.createContact.afterClosed().subscribe((customer: Contact) => {
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (customer) {
        this.alertService.clear();
        //  alert('customer.isPrimary');
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */

        if (this.branchid && this.cId) {
          if (customer.isPrimary == true) {

            this.addCustomer = customer;
            this.updatePrimaryRole();
          }
          this.addComapnyContact(customer, this.cId, this.branchid);
        } else if (this.customerId) {
          if (customer.isPrimary == true) {
            this.addCustomer = customer;
            this.updatePrimaryMainRole(customer);

          }
          setTimeout(() => {
            this.addComapnyContact(customer, this.customerId);
          }, 4000);
       

        }
      }
    });

  }
  addComapnyContact(customer, cId, bId?: number) {
    this.customerService
      .saveContact(customer, cId, bId)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.alertService.success("Contact add Successfully.");

            // this.customers.unshift(new Contact(customer));
            // this.subject$.next(this.customers);
            this.loadContact();

          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  updateCustomer(customer: Contact) {
    this.alertService.clear();
    this.modalRef = this.dialog.open(ContactCreateUpdateComponent, {
      data: customer
    });


    //  this.modalRef.componentInstance.branch = this.allBranches;
    this.modalRef.componentInstance.branchsid = this.branchid;
    this.modalRef.componentInstance.cId = this.cId;
    this.modalRef.componentInstance.branchesSet = this.branchesSet;
    this.modalRef.componentInstance.branch = this.allBranches;
    this.modalRef.afterClosed().subscribe(updatedCustomer => {
      /**
       * Contact is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (updatedCustomer) {

        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        if (this.branchid && this.cId) {
          if (updatedCustomer.id && updatedCustomer.isPrimary == true) {
            console.log('ni ana');
            this.updatePrimaryRole();
          }
          this.updateContact(updatedCustomer, this.cId, this.branchid, updatedCustomer.isPrimary);
          this.loadContact();
        } else if (this.customerId) {

          if (updatedCustomer.isPrimary == true) {
            console.log('records update', updatedCustomer);

            this.updatePrimaryMainRole(updatedCustomer, 'update');
          } else {


            this.updateContact(updatedCustomer, this.customerId, null, updatedCustomer.isPrimary);
            //this.loadContact();
          }
        }


      }
    });
    // mod.componentInstance.branches = this.allBranches;
    // mod.componentInstance.roles = this.role;
  }
  updateContact(updatedCustomer, Cid?: number, bId?: number, isPrimary?: boolean) {

    this.customerService
      .updateContact(updatedCustomer, Cid, bId, isPrimary)
      .pipe(first())
      .subscribe(
        data => {
          if (!data) {
            this.alertService.success("Contact Updated Successfully.");
            this.loadContact();
           

            // const index = this.dataSource.data.findIndex(
            //   existingCustomer => existingCustomer.id === updatedCustomer.id
            // );
            // this.dataSource.data[index] = new Contact(updatedCustomer);
            // this.subject$.next(this.dataSource.data);

          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }

  updateMainContacts(updatedCustomer, Cid?: number, bId?: number, isPrimary?: boolean, type?: any) {

    this.customerService
      .updateContact(updatedCustomer, Cid, bId, isPrimary)
      .pipe(first())
      .subscribe(
        data => {
          if (!data) {

          }
        },
        err => {
          this.alertService.error(err);
        }
      );
  }
  updatePrimaryRole() {
    if (this.branchid && this.cId) {
      this.fetchContact.forEach(c => this.updateContact(c, this.cId, this.branchid, false));
    } else {

      this.fetchContact.forEach(c => this.updateContact(c, this.customerId, null, false));

    }
  }
  updatePrimaryMainRole(customer?: any, type?: any) {
    if (this.cId && customer.branchId) {
      this.mainContactsFetchByBranchId(customer, this.cId, customer.branchId, type);

    } else {
      this.mainContactsFetchByCustomerId(customer, this.cId, type);
    }
  }
  async  mainContactsFetchByCustomerId(setCustomer?: any, cId?: number, type?: any) {
    return await this.customerService.getContactPerson(cId, null) // get contacts
      .pipe(first())
      .subscribe(contatcData => {

        this.fetchMainContact = contatcData;

        if (this.fetchMainContact) {

          this.fetchMainContact.forEach(c => this.updateMainContacts(c, cId, null, false));

          setTimeout(() => {
            console.log('set records update', setCustomer);
            this.updateContact(setCustomer, cId, null, true);
          }, 4000);



        }
      }, err => {
        this.alertService.clear();
        this.alertService.error(err);
      });
  }

  async  mainContactsFetchByBranchId(setCustomer?: any, cId?: number, branchId?: number, type?: any) {
    return await this.customerService.getContactPerson(null, branchId) // get contacts
      .pipe(first())
      .subscribe(contatcData => {

        this.fetchMainContact = contatcData;

        if (this.fetchMainContact) {

          this.fetchMainContact.forEach(c => this.updateContact(c, cId, branchId, false));
          if (type == 'update') {
            console.log('set records update', setCustomer);
            this.updateContact(setCustomer, cId, null, true);

          }

        }
      }, err => {
        this.alertService.clear();
        this.alertService.error(err);
      });
  }
  deleteCustomer(customer: Contact) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */

    this.customerService
      .delContact(customer.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.alertService.success("Contact Deleted Successfully.");
            this.customers.splice(this.customers.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
            this.selection.deselect(customer);
            this.subject$.next(this.customers);

          }
        },
        err => {
          this.alertService.error(err);
        }
      );

  }

  deleteCustomers(customers: Contact[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    customers.forEach(c => this.deleteCustomer(c));
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Contact) {
    const index = this.customers.findIndex(c => c === row);
    //this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  async loadContact() {
    this.delay(1000);
    if (this.branchid && this.cId) {
      return await this.customerService.getContactPerson(null, this.branchid) // get contacts
        .pipe(first())
        .subscribe(contatcData => {

          this.fetchContact = contatcData;
          this.loadNgInint();
          this.getCustomerById(this.cId); // for branches check
        }, err => {
          this.alertService.clear();
          this.alertService.error(err);
        });


    } else if (this.customerId) {

      return await this.customerService.getContactPerson(this.customerId, null) // get contacts
        .pipe(first())
        .subscribe(contatcData => {

          this.fetchContact = contatcData;
          this.loadNgInint();
          this.getCustomerById(this.customerId);  // for branches check
        }, err => {
          this.alertService.clear();
          this.alertService.error(err);
        });

    }


  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCustomerById(cid: any) {

    this.customerService.getCustomerById(cid) // get countries
      .pipe(first())
      .subscribe(customer => {

        if (customer) {
          this.customerList = customer;

          //  this.breadRoute = this.customers.name+'?prop='+this.customers.id;
          if (this.customerList.hasBranch == true) {

            this.branchesSet = true;

          } else {
            this.branchesSet = false;
          }

        }


      }, err => {
        this.alertService.clear();
        this.alertService.error(err);
      });


  }


  loadNgInint() {
    this.getData().subscribe(customers => {
      this.subject$.next(customers);
    });


  }
  getBranches() {

    return this.customerService
      .getBranches()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.allBranches = data;
          this.allBranches = this.allBranches.filter(elm => elm.customerId == this.customerId);
        }

      }, err => {
        this.showMessage(err, 'snackbar-error');

      });
  }
  getRoles() {
    return this.customerService
      .getRoles()
      .pipe(first())
      .subscribe(data => {
        if (data) {
          this.role = data;
        }
      });
  }
  getBranchesNameById(id: number) {

    if (this.allBranches) {

      this.branchName = this.allBranches.find(elm => elm.id == id);

      if (this.branchName) {
        return this.branchName.name;
      } else {
        return '-';
      }

    }
  }

  showMessage(message: string, customClass?: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',      
      panelClass: customClass
    },
    
    );
  }
  ngOnDestroy() {
  }
}
