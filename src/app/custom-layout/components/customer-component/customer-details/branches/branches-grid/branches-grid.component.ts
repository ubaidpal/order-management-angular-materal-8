import {Component, OnInit, Input} from '@angular/core';
import {Link} from '../../../../../../../@vex/interfaces/link.interface';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icClear from '@iconify/icons-ic/clear';
import {scaleIn400ms} from '../../../../../../../@vex/animations/scale-in.animation';
import {fadeInRight400ms} from '../../../../../../../@vex/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import {BranchesEditComponent} from '../components/branches-edit/branches-edit.component';
import {MatDialog} from '@angular/material/dialog';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import {Branch} from '../../../interfaces/branch.interface';
import {branchData} from '../../../../../../../static-data/branches';
import {trackById} from '../../../../../../../@vex/utils/track-by';
import icSearch from '@iconify/icons-ic/twotone-search';
import {stagger40ms} from '../../../../../../../@vex/animations/stagger.animation';
import {fadeInUp400ms} from '../../../../../../../@vex/animations/fade-in-up.animation';
import {scaleFadeIn400ms} from '../../../../../../../@vex/animations/scale-fade-in.animation';
import {Router, ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import theme from '../../../../../../../@vex/utils/tailwindcss';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {AlertService} from '../../../../../alert/alert.service';

@Component({
    selector: 'vex-contacts-grid',
    templateUrl: './branches-grid.component.html',
    styleUrls: ['./branches-grid.component.scss'],
    animations: [
        scaleIn400ms,
        fadeInRight400ms,
        stagger40ms,
        fadeInUp400ms,
        scaleFadeIn400ms
    ]
})
export class BranchesGridComponent implements OnInit {
    addEditModal = null;
    contacts = branchData;
    searchCtrl = branchData;
    filteredContacts$ = [];
    activeCategory = '';
    selectedIndex: number = null;
    customerId:any;
    links = [
        {
            label: 'ALL Branches',
            category: 'all'
        },
        // {
        //   label: 'FREQUENTLY CONTACTED',
        //   route: '../frequent'
        // },
        {
            label: 'STARRED',
            category: 'starred'
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
                private router: Router) {
    }

    ngOnInit() {


    }

    openContact(id?: Branch['id']) {
        if (id > 0) {
            // navigate to branches details components
         
          
            this.router.navigate(['branches-details', {branchId: id  }]);


        } else {
            
            this.addEditModal = this.dialog.open(BranchesEditComponent, {
                data: id || null,
                width: '1170px'
            });
            this.addEditModal.afterClosed().subscribe((branch: Branch) => {

                /**
                 * Customer is the updated customer (if the user pressed Save - otherwise it's null)
                 */
                if (branch) {
                    if (id > 0) {
                        console.log(id);
                        //update api will be written here
                        let index = this.contacts.findIndex((existingCustomer) => existingCustomer.id === branch.id);
                        this.alertService.success('Updated branch successfully');
                        this.contacts[index] = branch;
                        // this.contacts.unshift(user);
                    } else {
                        console.log(branch);
                        //add api will be written here
                        this.alertService.success('Added branch successfully');
                        this.contacts.unshift(branch);
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


    }

    deleteBranch(id?: Branch['id']) {
        if (id > 0) {
            this.alertService.success('Branch Deleted successfully');
            // delete user api will be wriiten here
            this.contacts = this.contacts.filter(elem => elem.id != id);
        }
    }

    changeCategory(category: string, index: number) {
        this.selectedIndex = index;
        switch (category) {
            case 'all': {
               
                this.filteredContacts$ = branchData;
                break;
            }

            case 'starred': {
                this.filteredContacts$ = branchData.filter(c => c.starred);
                break;
            }

            default: {
                this.filteredContacts$ = [];
            }
        }
    }

    toggleStar(id: Branch['id']) {
        const contact = branchData.find(c => c.id === id);

        if (contact) {
            contact.starred = !contact.starred;
        }
    }


}
