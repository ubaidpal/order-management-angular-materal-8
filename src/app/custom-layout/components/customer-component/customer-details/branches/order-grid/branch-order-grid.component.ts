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

import { AlertService } from '../../../../../alert/alert.service';

@Component({
  selector: 'vex-branch-order-grid',
  templateUrl: './branch-order-grid.component.html',
  styleUrls: ['./branch-order-grid.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class BranchOrderGridComponent implements OnInit {

  addEditModal = null;
  contacts = branchData;
  searchCtrl = branchData;
  filteredContacts$ = [];
  filteredOrders$ = [];
  activeCategory = '';
  selectedIndex: number = null;
  status = '';
  activeMode = 'products';
  links = [

    {
      label: 'Pending',
      category: 'pending'
    },
    {
      label: 'In Progress',
      category: 'in-progress'
    },
    {
      label: 'Shipped',
      category: 'shipped'
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
    this.changeCategory("pending", 0);

  }





  changeCategory(category: string, index: number) {
    this.selectedIndex = index;
    switch (category) {


      case 'pending': {
        this.status = 'pending';
    
       
        this.filteredOrders$ = [0,1];
      

        break;
      }
      case 'in-progress': {
        this.status = 'in-progress';
     
      
        this.filteredOrders$ = [0,1];
      

        break;
      }
      case 'shipped': {
        this.status = 'shipped';

      
        this.filteredOrders$ = [0,1];
        

        break;
      }
      case 'all-orders': {
        this.status = 'all-orders';
      
        
        this.filteredOrders$ = [0,1];
     

        break;
      }


      default: {

        //this.filteredOrders$ = [];
      }
    }
  }

  setActiveMode(mode:any){
    console.log(mode);
    this.activeMode = mode;
  }

}
