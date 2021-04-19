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
import { map } from 'rxjs/operators';
import theme from 'src/@vex/utils/tailwindcss';
import { branchData } from 'src/static-data/branches';
import { aioTableData, aioTableLabels } from 'src/static-data/aio-table-data';
import { AlertService } from 'src/app/custom-layout/alert/alert.service';
import Utils from 'src/app/custom-layout/_utils/utils';


@Component({
  selector: 'vex-order-customer-grid',
  templateUrl: './order-grid.component.html',
  styleUrls: ['./order-grid.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class OrderGridComponent implements OnInit {

  addEditModal = null;
  contacts = branchData;
  searchCtrl = branchData;
  filteredContacts$ = [];
  filteredOrders$ = [];
  activeCategory = '';
  selectedIndex: number = null;
  status = '';
  breadcrumbsParams :any=[];
  links = [

    {
      label: 'New',
      category: Utils.status().New
    },
    {
      label: 'In Progress',
      category: Utils.status().InProgress
    },
    {
      label: 'Shipped',
      category: Utils.status().Shipped
    },
    {
      label: 'All Orders',
      category: 'all-orders'
    }

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
    
    ) {
  }
  ngOnInit() {
    const tab = this.route.snapshot.paramMap.get('tab');
    const index = this.route.snapshot.paramMap.get('index') ? parseInt(this.route.snapshot.paramMap.get('index')) : 0;
    if (tab) {
      this.changeCategory(tab, index);
    } else {
      this.changeCategory(Utils.status().New, 0);
    }

  }





  changeCategory(category: string, index: number) {
    this.selectedIndex = index;
   
    switch (category) {


      case Utils.status().New: {
        this.status = Utils.status().New;
    
       
        this.filteredOrders$ = [0,1];
        this.breadcrumbsParams = [
          {title: 'Orders', url: ''},
          {title: 'New', url: '' , isActive: true}
        ];

        break;
      }
      case Utils.status().InProgress: {
        this.status = Utils.status().InProgress;
        this.filteredOrders$ = [0,1];
        this.breadcrumbsParams = [
          {title: 'Orders', url: ''},
          {title: 'In Progress', url: '' , isActive: true}
        ];

        break;
      }
      case Utils.status().Shipped: {
        this.status = Utils.status().Shipped;
        this.filteredOrders$ = [0,1];
        this.breadcrumbsParams = [
          {title: 'Orders', url: ''},
          {title: 'Shipped', url: '' , isActive: true}
        ];

        break;
      }
      case 'all-orders': {
        this.status = 'all-orders';
      
        this.filteredOrders$ = [0,1];
        this.breadcrumbsParams = [
          {title: 'Orders', url: ''},
          {title: 'All Orders', url: '' , isActive: true}
        ];

        break;
      }


      default: {

        this.filteredOrders$ = [];
      }
    }
  }

 

}
