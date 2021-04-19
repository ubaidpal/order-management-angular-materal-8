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
import { branchData } from 'src/static-data/branches';
import { aioTableData, aioTableLabels } from 'src/static-data/aio-table-data';
import { Branch } from '../../interfaces/branch.interface';
import { AlertService } from '../../../../alert/alert.service';
import { BranchesEditComponent } from '../branches/components/branches-edit/branches-edit.component';
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
@Component({
    selector: 'vex-contacts-grid',
    templateUrl: './customer-grid.component.html',
    styleUrls: ['./customer-grid.component.scss'],
    animations: [
        scaleIn400ms,
        fadeInRight400ms,
        stagger40ms,
        fadeInUp400ms,
        scaleFadeIn400ms
    ]
})
export class CustomerGridComponent implements OnInit {

    addEditModal = null;
    contacts = branchData;
    searchCtrl = branchData;
    filteredContacts$ = [];
    filteredBranchData$: any;
    filteredCompanyDetail$ = [];
    filteredOrders$ = [];
    filteredCatelouge$ = [];
    filteredShippingLocation$ = [];
    activeCategory = '';
    selectedIndex: number = null;
    cId = null;
    customers: any;
    branchesData: any;
    customerId: any;
    newBranch: any = [];
    breadcrumbsParams: any = [];
    shipData: any = [];
    countries: any;
    links = [

        {
            label: 'Orders',
            category: 'order'
        },
        {
            label: 'Company Details',
            category: 'company-detail'
        },
        {
            label: 'Branches',
            category: 'all'
        },
        {
            label: 'Contacts',
            category: 'contacts'
        },
        {
            label: 'Catalogue',
            category: 'catelouge'
        },


    ];

    icSearch = icSearch;
    icPersonAdd = icPersonAdd;
    icCloudDownload = icCloudDownload;
    icFilterList = icFilterList;
    icContacts = icContacts;


    trackById = trackById;
    theme = theme;
    bId = null;
    breadRoute: any;
    isBranch: boolean = true;
    constructor(private dialog: MatDialog,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private customerService: CustomerService,
        private commonService: CommonService,
        private router: Router) {
        this.alertService.success("Please wait Branches data going to load.");
        this.cId = this.route.snapshot.paramMap.get('cId');// get customer id


    }
    ngOnInit() {
        this.getCustomerById(this.cId);

    }

    getCustomerById(cid: any) {
        
        this.customerService.getCustomerById(cid) // get countries
            .pipe(first())
            .subscribe(customer => {

                if (customer) {
                    this.customers = customer;
                    if (this.customers) {
                        this.changeCategory("order", 0);
                    }

                    //  this.breadRoute = this.customers.name+'?prop='+this.customers.id;
                    if (this.customers.hasBranch == false) {

                        this.links.splice(2, 1, { label: 'Shipping Locations', category: 'shipping-location' });


                    }

                }                
            }, err => {

                this.alertService.clear();
                this.alertService.error(err);
            });


    }

    openContact(id?: Branch['id']) {

        if (id > 0) {
            // navigate to branches details components

            this.router.navigate(['branches-details', { branchId: id, cId: this.cId }]);
            return;
            // this.router.navigate(['branches-details', { branchId: id }]);

        } else {

            this.addEditModal = this.dialog.open(BranchesEditComponent, {
                data: id || null,
                width: '1170px'
            });
            this.addEditModal.componentInstance.cId = this.cId;
            this.addEditModal.afterClosed().subscribe((branch: Branch) => {

                /**
                 * Customer is the updated customer (if the user pressed Save - otherwise it's null)
                 */
                if (branch) {
                    if (id > 0) {
                        // alert('asasdsss');
                        // console.log(id);
                        // //update api will be written here
                        // let index = this.contacts.findIndex((existingCustomer) => existingCustomer.id === branch.id);
                        // this.alertService.success('Updated branch successfully');
                        // this.contacts[index] = branch;
                        // // this.contacts.unshift(user);
                    } else {

                        if (branch) {
                            this.alertService.clear();

                            this.customerService.saveBranch(branch, this.cId)
                                .pipe(first())
                                .subscribe(data => {
                                    if (data) {

                                        this.customerService.addPrimaryContact(branch, data['id'], this.cId) // add Primary Contact
                                            .then(primary => {

                                                console.log('primary', primary);
                                                if (primary) {


                                                }

                                            }, err => {
                                                this.alertService.clear();
                                                this.alertService.error(err);
                                            });

                                        this.getShipping(data['id']);

                                        this.alertService.success('branch added successfully');
                                        this.newBranch = data;
                                        this.contacts.unshift(branch);
                                        this.changeCategory("all", 2);
                                    }
                                }, err => {

                                    this.changeCategory("all", 2);
                                    this.alertService.error(err);


                                });
                        }

                    }

                }
            });
        }


    }




    async getShipping(bId?: number) {
        //this.alertService.warning('Please wait data will be load soon.');
        this.alertService.clear();
        this.delay(1000);
        return await this.customerService
            .getShippingLocationsByCustomerId(bId)
            .pipe(first())
            .subscribe(
                data => {
                    if (data) {

                        this.shipData = data;
                        this.shipData = this.shipData.filter(elm => elm.branchId == bId);

                        this.shipData.forEach(s => this.deleteShipping(s));
                    }
                },
                err => {
                    this.alertService.error(err);
                }
            );
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    deleteShipping(shipping?: any) {
        this.customerService
            .deleteShipping(shipping.id)
            .pipe(first())
            .subscribe(
                data => {
                    if (data) {

                        console.log('deleteShip', data);
                    }
                },
                err => {
                    console.log(err);

                }
            );
    }
    changeCategory(category: string, index: number) {
        this.selectedIndex = index;
        switch (category) {
            case 'all': {
                // this.getBranches(this.cId);

                this.filteredCompanyDetail$ = [];
                this.filteredContacts$ = [];
                this.filteredOrders$ = [];
                this.filteredCatelouge$ = [];


                this.customerService.getBranchesByCustomerId(this.cId) // get countries
                    .pipe(first())
                    .subscribe(branches => {
                        
                        if (branches) {
                            // this.branchesData = branches;
                            //console.log(branches);
                            this.filteredBranchData$ = branches;
                            this.getCountry();

                        } else {
                            this.filteredBranchData$ = [];
                            this.getCountry();
                        }


                    }, err => {

                        this.alertService.clear();
                        this.alertService.error(err);
                    });


                //this.filteredBranchData$ = branchData;
                break;
            }

            case 'order': {

                this.filteredCompanyDetail$ = [];
                this.filteredContacts$ = [];
                this.filteredBranchData$ = [];
                this.filteredShippingLocation$ = [];
                this.filteredCatelouge$ = [];
                this.filteredOrders$ = [0, 1];
                this.breadcrumbsParams = [
                    { title: 'Customer List', url: '/customer' },
                    { title: this.customers.name, url: '', isActive: true }
                ];
                break;
            }

            case 'shipping-location': {
                this.filteredCompanyDetail$ = [];
                this.filteredContacts$ = [];
                this.filteredBranchData$ = [];
                this.filteredCatelouge$ = [];
                this.filteredOrders$ = [];
                this.filteredShippingLocation$ = [1, 2];
                this.breadcrumbsParams = [
                    { title: 'Customer List', url: '/customer' },
                    { title: this.customers.name, url: '', isActive: true }
                ];
                break;
            }

            case 'company-detail': {
                this.filteredOrders$ = [];
                this.filteredContacts$ = [];
                this.filteredBranchData$ = [];
                this.filteredShippingLocation$ = [];
                this.filteredCatelouge$ = [];
                this.filteredCompanyDetail$ = [0, 1];
                this.breadcrumbsParams = [
                    { title: 'Customer List', url: '/customer' },
                    { title: this.customers.name, url: '', isActive: true }
                ];
                break;
            }
            case 'contacts': {
                this.filteredOrders$ = [];
                this.filteredCompanyDetail$ = [];
                this.filteredBranchData$ = [];
                this.filteredShippingLocation$ = [];
                this.filteredCatelouge$ = [];
                this.filteredContacts$ = [0, 1];
                this.breadcrumbsParams = [
                    { title: 'Customer List', url: '/customer' },
                    { title: this.customers.name, url: '', isActive: true }
                ];

                break;
            }
            case 'catelouge': {
                this.filteredOrders$ = [];
                this.filteredCompanyDetail$ = [];
                this.filteredBranchData$ = [];
                this.filteredShippingLocation$ = [];
                this.filteredContacts$ = [];
                this.filteredCatelouge$ = [0, 1];
                this.breadcrumbsParams = [
                    { title: 'Customer List', url: '/customer' },
                    { title: this.customers.name, url: '', isActive: true }
                ];

                break;
            }


            default: {


            }
        }
    }
    getCountry() {


        return this.commonService.getCountries((data: any) => {

            //  this.myProps = { countries: data, contact: this.contacts };
            this.countries = data;
        }, (error: any) => {
            console.log('get countries:', error)
        });
    }

    branchStatusChange(status?:boolean) {
      
        if (status == true) {
           
            this.links.splice(2, 1, { label: 'Branches', category: 'all' });
        } else {
           
            this.links.splice(2, 1, { label: 'Shipping Locations', category: 'shipping-location' });
        }
        this.alertService.success("Customer Updated Successfully.");
    }

}
