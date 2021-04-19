import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import icStar from '@iconify/icons-ic/twotone-star';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { TableColumn } from '../../../../@vex/interfaces/table-column.interface';
import { usersData } from '../../../../static-data/users';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { User } from '../users-table/interfaces/user.interface';
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
import icUsers from '@iconify/icons-ic/people';
import { CustomerService } from '../../_services/customer.service';
import { AlertService } from '../../alert/alert.service';
@Component({
  selector: 'vex-users-table',
  templateUrl: './users-table.component.html',
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class UsersTableComponent implements OnInit {

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
  addEditModal = null;
  searchCtrl = new FormControl();
  inputType = 'password';
  visible = false;
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  menuOpen = false;

  activeCategory: 'frequently' | 'starred' | 'all' | 'family' | 'friends' | 'colleagues' | 'business' = 'all';
  tableData = usersData;
  tableColumns: TableColumn<User>[] = [
    {
      label: '',
      property: 'selected',
      type: 'checkbox',
      cssClasses: ['w-6']
    },
    // {
    //   label: '',
    //   property: 'imageSrc',
    //   type: 'image',
    //   cssClasses: ['min-w-9']
    // },
    {
      label: 'NAME',
      property: 'name',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'EMAIL',
      property: 'email',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Agency Role',
      property: 'agencyRole',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Privillage',
      property: 'privillage',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'Agency',
      property: 'agency',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'status',
      property: 'status',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    // {
    //   label: '',
    //   property: 'starred',
    //   type: 'button',
    //   cssClasses: ['text-secondary', 'w-10']
    // },
    {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    },
  ];

  icStar = icStar;
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;

  constructor(
              private dialog: MatDialog,
              private cd: ChangeDetectorRef,
              private customerService: CustomerService,
              private alertService: AlertService
              ) { }

  ngOnInit() {
  }

  openUser(id?: User['id']) {
    this.addEditModal =  this.dialog.open(UsersEditComponent, {
      data: id || null,
      width: '600px'
    });

    this.addEditModal.afterClosed().subscribe((user: User) => {
      console.log('user here');
      console.log(user);
      /**
       * Customer is the updated customer (if the user pressed Save - otherwise it's null)
       */
      if (user) {
        if(id > 0){
          //update api will be written here 
          let index = this.tableData.findIndex((existingCustomer) => existingCustomer.id === user.id);
          this.alertService.success('Udated user successfully');
              this.tableData[index] = user;
          // this.tableData.unshift(user);
        }else{
          //add api will be written here 
          this.alertService.success('Added user successfully');
          this.tableData.unshift(user);
        }
      

        // this.alertService.clear();
        // /**
        //  * Here we are updating our local array.
        //  * You would probably make an HTTP request here.
        //  */
        // this.userService.createCustomer(customer)
        // .pipe(first())
        // .subscribe(data => {
        //   if (data['message'] != null) {
        //     this.alertService.success(data['message']);
        //     this.dataSource.data.unshift(new Customer(customer));
        //     this.subject$.next(this.customers);
          
        //   }
        // }, err => {
        //   console.log(err);
        // });
     
      }
    });
  }
  deleteUser(id?: User['id']) {
    if(id > 0){
      this.alertService.success('User Deleted successfully');
      // delete user api will be wriiten here
      this.tableData = this.tableData.filter(elem => elem.id != id);
    }
  }

  toggleStar(id: User['id']) {
    const user = this.tableData.find(c => c.id === id);

    // if (user) {
    //   user.starred = !user.starred;
    // }
  }

  setData(data: User[]) {
    this.tableData = data;
    this.menuOpen = false;
  }

  openMenu() {
    this.menuOpen = true;
  }
  
  togglePassword() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
