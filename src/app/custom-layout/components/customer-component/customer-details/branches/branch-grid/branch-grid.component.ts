import { Component, OnInit } from '@angular/core';
import { Link } from 'src/@vex/interfaces/link.interface';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
//import { ContactsEditComponent } from '../components/contacts-edit/contacts-edit.component';
import { MatDialog } from '@angular/material/dialog';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
//import { Contact } from '../interfaces/contact.interface';
import { contactsData } from 'src/static-data/contacts';
import { trackById } from 'src/@vex/utils/track-by';
import icSearch from '@iconify/icons-ic/twotone-search';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first } from 'rxjs/operators';
import theme from 'src/@vex/utils/tailwindcss';
import {branchData} from 'src/static-data/branches';
import {aioTableData, aioTableLabels} from 'src/static-data/aio-table-data';

import {AlertService} from '../../../../../alert/alert.service';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'vex-branches-details-grid',
  templateUrl: './branch-grid.component.html',
  styleUrls: ['./branch-grid.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class BranchGridComponent implements OnInit {

  addEditModal = null;
    contacts = branchData;
    searchCtrl = branchData;
    
    filteredOrders$ = [];
    filteredShippingLocation$ = [];
    filteredShippingContact$ = [];
    filteredCatelogue$ = [];
    filteredBranchDetails$ = [];
    
    activeCategory = '';
    selectedIndex: number = null;
    branchId:any;
    branch:any;
    cId:any;
    customers:any;
    breadcrumbsParams:any;
    setUrl:any
    links = [

          {
            label: 'Orders',
            category: 'order'
        },
        {
            label: 'Shipping Locations',
            category: 'shipping-location'
        },
      
        {
            label: 'Contacts',
            category: 'contacts'
        },
        {
            label: 'Catalogue',
            category: 'catelouge'
        },
        {
            label: 'Branch Details',
            category: 'branch-detail'
        },
       
        
    ];

    icSearch = icSearch;
    icPersonAdd = icPersonAdd;
    icCloudDownload = icCloudDownload;
    icFilterList = icFilterList;
    icContacts = icContacts;


    trackById = trackById;
    theme = theme;


    constructor(private dialog: MatDialog,
      private route: ActivatedRoute,
      private alertService: AlertService,
      private router: Router,
      private customerService: CustomerService,
      private titleService: Title
      ) {
        this.titleService.setTitle("Branches");
}
    ngOnInit() {
        this.branchId = this.route.snapshot.paramMap.get('branchId');
        this.cId = this.route.snapshot.paramMap.get('cId');
        this.getBranchById( this.branchId);
     
       
       
    }

 
   

    changeCategory(category: string, index: number) {
    
        this.selectedIndex = index;
        switch (category) {
         

            case 'order': {
               
                this.filteredCatelogue$ = [];
                this.filteredShippingContact$ = [];
                this.filteredShippingLocation$ = [];
                this.filteredBranchDetails$ = [];
                this.filteredOrders$ = [1,2];
                this.breadcrumbsParams = [
                  { title: 'Customer List', url: '/customer' },
                  { title: this.customers && this.customers.name ? this.customers.name : '', url2:this.cId  },
                  { title: this.branch.name, url: '', isActive: true }
                ];
             
              break;
          }

          case 'shipping-location': {
           
            this.filteredCatelogue$ = [];
            this.filteredShippingContact$ = [];
            this.filteredShippingLocation$ = [1,2];
            this.filteredBranchDetails$ = [];
            this.filteredOrders$ = [];
            this.breadcrumbsParams = [
              { title: 'Customer List', url: '/customer' },
              { title: this.customers && this.customers.name ? this.customers.name : '', url2:this.cId  },
              { title: this.branch.name, url: '', isActive: true }
            ];
            break;
        }
        case 'contacts': {

           
            this.filteredCatelogue$ = [];
            this.filteredShippingContact$ = [1,2];
            this.filteredShippingLocation$ = [];
            this.filteredBranchDetails$ = [];
            this.filteredOrders$ = [];
            this.breadcrumbsParams = [
              { title: 'Customer List', url: '/customer' },
              { title: this.customers && this.customers.name ? this.customers.name : '', url2:this.cId  },
              { title: this.branch.name, url: '', isActive: true }
            ];
           
            break;
        }
        case 'catelouge': {
            this.filteredCatelogue$ = [1,2];
            this.filteredShippingContact$ = [];
            this.filteredShippingLocation$ = [];
            this.filteredBranchDetails$ = [];
            this.filteredOrders$ = [];
            this.breadcrumbsParams = [
              { title: 'Customer List', url: '/customer' },
              { title: this.customers && this.customers.name ? this.customers.name : '', url2:this.cId  },
              { title: this.branch.name, url: '', isActive: true }
            ];
           
            break;
        }
        case 'branch-detail': {
            this.filteredCatelogue$ = [];
            this.filteredShippingContact$ = [];
            this.filteredShippingLocation$ = [];
            this.filteredBranchDetails$ = [1,2];
            this.filteredOrders$ = [];
            this.breadcrumbsParams = [
              { title: 'Customer List', url: '/customer' },
              { title: this.customers && this.customers.name ? this.customers.name : '', url2:this.cId  },
              { title: this.branch.name, url: '', isActive: true }
            ];
           
            break;
        }
        


            default: {

               
            }
        }
    }

    getBranchById(bId?:number) {
        return this.customerService
          .getBranchById(bId)
          .pipe(first())
          .subscribe(data => {
            if (data) {
              this.branch = data;
              this.getCustomerById(this.cId);
            }
          });
      }

      getCustomerById(cid: any) {

        this.customerService.getCustomerById(cid) // get countries
            .pipe(first())
            .subscribe(customer => {

                if (customer) {
                    this.customers = customer;
                   
                    this.changeCategory("order" , 0);
              

                }


            }, err => {
                this.alertService.clear();
                this.alertService.error(err);
            });


    }
}
