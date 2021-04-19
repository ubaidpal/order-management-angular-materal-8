import { Injectable, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from "rxjs/operators";
import { User } from '../_models/user';
import { Country } from '../_models/country';
import { Role } from '../_models/role';
import { Observable } from 'rxjs';
import { Customer } from '../components/customer-component/interfaces/customer.model';
import { Shipping } from '../components/customer-component/interfaces/shipping.model';
import { Helper } from '../_helpers/helper';
import { Branch } from '../components/customer-component/interfaces/branch.interface';
import { Contact } from './../components/contact/model/contact.model'
import Utils from '../_utils/utils';
import _ from 'underscore';


@Injectable({ providedIn: 'root' })

export class CustomerService {
    private urls = {
        "users": "/user",
        "delCustomer": '/user/',
        "register": "/user/register",
        "country": "/static/countries",
        "role": "/role",
        "customer": "/customer",
        "customerDetail": "/customer/details",
        "stateByCountryId": "/static/StatesByCountry",
        "states": "/static/states",
        "cites": "/static/cities",
        "cityByState": "/static/CitiesByState",
        "branchByCustomerId": "/customerBranch/customer",
        "customerBranch": "/customerBranch",
        "primaryContacts": "/customerContact",
        "delContact": "/customerContact",
        "getShippingLocation": "/customerAddress",
        "getCustomerShippingLocation": "/customerAddress/customer",
        "getBranchShippingLocation": "/customerAddress/branch",
        "getLoadPlan": "/static/loadingStyles",
        "getCurrency": "/static/Currencies",
        "getShippingType": "/static/ShippingTypes",
        "getShippingMethod": "/static/ShippingMethods",
        "getCustomerContactById": "/customerContact/customer",
        "getBranchContactById": "/customerContact/branch"

    };
    getPrimaryContact: Branch;
    obj: any = [];
    getAllContact: any = [];
    newDate = Date.now();
    get addresses() {
        return this.getPrimaryContact.addresses
    }
    constructor(private http: HttpClient) {

    }

    getAll() {
        return this.http.get<User[]>(Helper.url(this.urls.users));
    }
    save(customer: Customer) {



        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });
        if (customer.id) {

            let obj = {
                "name": customer.name,
                "registrationNumber": customer.registrationNumber,
                "addressLine1": customer.addressLine1,
                "addressLine2": customer.addressLine2,
                "city": customer.city,
                "state": customer.state,
                "postcode": customer.postcode,
                "phoneNumber": customer.phonePrefix + '-' + customer.phoneNumber,
                "representative": customer.representative,
                "email": customer.email,
                "phoneNumber2": customer.phonePrefix2 + '-' + customer.phoneNumber2,
                "country": customer.country,
                "hasBranch": customer.hasBranch ,
                "representativeRole": customer.role,
                "updatedDate": new Date(this.newDate)
            }

            let newobj = { "id": customer.id, },
                mergedObj = Object.assign(newobj, obj);

            return this.http.put<Customer[]>(Helper.url(this.urls.customer) + '/' + customer.id, mergedObj, { headers: reqHeaders });

        } else {

            let obj = {
                "name": customer.name,
                "registrationNumber": customer.registrationNumber,
                "addressLine1": customer.addressLine1,
                "addressLine2": customer.addressLine2,
                "city": customer.city,
                "state": customer.state,
                "postcode": customer.postcode,
                "phoneNumber": customer.phonePrefix + '-' + customer.phoneNumber,
                "representative": customer.representative,
                "email": customer.email,
                "phoneNumber2": customer.phonePrefix2 + '-' + customer.phoneNumber2,
                "country": customer.country,
                "hasBranch": customer.hasBranch,
                "branches": [],
                "addresses": customer.addresses,
                "contacts": customer.contacts,
                "representativeRole": customer.role,
                "customerProducts": [],
                "updatedDate": new Date(this.newDate)
            }
           // console.log('aaa', obj);
            //return this.http.get<Customer[]>(Helper.url(this.urls.customer));
            return this.http.post<Customer[]>(Helper.url(this.urls.customer), obj, { headers: reqHeaders });

        }
    }
    register(user: User) {
        //url('/users/register')
        return this.http.post(Helper.url(this.urls.register), user);
    }

    delete(id: number) {
        return this.http.delete(Helper.url(this.urls.users) + '/' + id);
    }
    getCountry() {
        return this.http.get<Country[]>(Helper.url(this.urls.country));
    }

    getRoles() {
        return this.http.get<Role[]>(Helper.url(this.urls.role));
    }
    getCustomer() {

        return this.http.get<Customer[]>(Helper.url(this.urls.customer));
    }
    deleteCustomer(id: number) {
        return this.http.delete<Customer[]>(Helper.url(this.urls.customer) + '/' + id);
    }
    getCustomerDetails(id: number) {
        return this.http.get(Helper.url(this.urls.customerDetail) + '/' + id);
    }
    getStateByCountryId(id: number) {
        return this.http.get(Helper.url(this.urls.stateByCountryId) + '/' + id);
    }
    getStates() {
        return this.http.get(Helper.url(this.urls.states));
    }
    getCityByStatesId(id: number) {
        return this.http.get(Helper.url(this.urls.cityByState) + '/' + id);
    }

    getCities() {
        return this.http.get(Helper.url(this.urls.cites));
    }

    //get customer by id
    getCustomerById(id: number) {

        return this.http.get<Customer[]>(Helper.url(this.urls.customer) + '/' + id);
    }

    //branches list
    // get(subUrl:string = '', needObservable = false) : Observable<T> {
    //     let options = {};
    //     if(needObservable) {
    //       options = {observe: 'response'};
    //     }
    //     return this.http.get<T>(this.url + subUrl, options); // add a type that you are expecting to be returned from api
    // }
    getBranchesByCustomerId(id: number) {
        return this.http.get<Branch>(Helper.url(this.urls.branchByCustomerId) + '/' + id);
    }
    getBranches() {
        return this.http.get(Helper.url(this.urls.customerBranch));
    }
    getBranchById(id: number) {
        return this.http.get(Helper.url(this.urls.customerBranch) + '/' + id);
    }
    getBranchesById(id: number) {
        return this.http.get(Helper.url(this.urls.branchByCustomerId) + '/' + id);
    }
    saveBranch(branch: Branch, cId?: number) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });

        let customerId = { "customerId": cId },
            mergedObj = Object.assign(branch, customerId),
            obj = { "phone": branch.phonePrefix ? branch.phonePrefix + '-' + branch.phone : '+92' + branch.phone },
            newMergedObj = Object.assign(mergedObj, obj);
     //  console.log('branch ' ,newMergedObj);
        return this.http.post<Branch[]>(Helper.url(this.urls.customerBranch), newMergedObj, { headers: reqHeaders });


    }
    saveContact(contact: Contact, cId?: number, bId?: number) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });

        let obj = {


            'name': contact.name,
            'role': contact.role,
            'branchId': contact.branchId,
            'phone': contact.phone,
            'email': contact.email,
            'isPrimary': contact.isPrimary ? contact.isPrimary : false,
            "customerId": contact.customerId
        }

        if (cId && bId) {


            return this.http.post<Contact[]>(Helper.url(this.urls.primaryContacts), obj, { headers: reqHeaders });
        } else {

            return this.http.post<Contact[]>(Helper.url(this.urls.primaryContacts), obj, { headers: reqHeaders });
        }





    }
    updateContact(contact: Contact, cId?: number, bId?: number, isPrimary?: any) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });
        let primary: any;


        if (isPrimary == false) {


            primary = false;
        } else {

            primary = true;
        }

        let obj = {


            "id": contact.id,
            'name': contact.name,
            'role': contact.role,
            'branchId': contact.branchId ? contact.branchId : '',
            'phone': contact.phone,
            'email': contact.email,
            'isPrimary': primary,
            "customerId": contact.customerId
        }

        if (cId && bId) {

            return this.http.put<Contact[]>(Helper.url(this.urls.primaryContacts) + '/' + contact.id, obj, { headers: reqHeaders });
        } else {


            return this.http.put<Contact[]>(Helper.url(this.urls.primaryContacts) + '/' + contact.id, obj, { headers: reqHeaders });
        }

    }
    contactApi() {

    }
    delContact(id?: any) {


        return this.http.delete(Helper.url(this.urls.primaryContacts) + '/' + id);

    }
    updateBranch(branch: Branch, bId?: number, cId?: number) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });

        if (bId) {
            let newobj = { "id": bId },
                mergedbId = Object.assign(newobj, branch),
                mergedCid = { "customerId": cId },
                mergedObj = Object.assign(mergedbId, mergedCid);

            let obj = {
                "id": mergedObj.id,
                "name": mergedObj.name,
                "country": mergedObj.country,
                "addressLine1": mergedObj.addressLine1,
                "addressLine2": mergedObj.addressLine2,
                "city": mergedObj.city,
                "state": mergedObj.state,
                "postCode": mergedObj.postCode,
                "phone": mergedObj.phonePrefix ? mergedObj.phonePrefix + '-' + mergedObj.phone : '+92' + mergedObj.phone,
                "customerId": mergedObj.customerId,
            }

            return this.http.put(Helper.url(this.urls.customerBranch) + '/' + bId, obj, { headers: reqHeaders });


        }
    }


    addPrimaryContact(branch: Branch, bId?: number, cId?: number) {
        if (bId && branch.addresses) {

            let branchId = { "branchId": bId },
                newMergedObj = branch.addresses;

            //add new contact  

            let promise = new Promise((resolve, reject) => {

                if (newMergedObj) { // add primary contacts

                    var obj = newMergedObj;
                    let terminate = false,
                        i = 0;

                    for (let pContact of obj) {

                        if (pContact['id']) {
                            delete pContact['id'];
                        }

                        if (pContact.name) {
                            let ob = Object.assign(pContact, branchId),
                                newOb = { "phone": pContact.phonePrefix2 ? pContact.phonePrefix2 + '-' + pContact.phone : '+92' + pContact.phone },
                                newobj = Object.assign(ob, newOb);

                           // console.log('asasaasasasas', newobj);
                            this.http.post(Helper.url(this.urls.primaryContacts), newobj)
                                .subscribe(res => {


                                });
                            i++;
                            if (i == obj.length) {
                                terminate = true;
                            }
                        }

                        //console.log('terminate add contact- ' + terminate);

                    }
                    if (terminate) {
                        resolve();
                    }
                }
            });
            return promise;


        }
    }

    delContactLoop(primarC?: any) {
        let promise = new Promise((resolve, reject) => {

            if (primarC) { // delete contacts

                var obj = primarC;
                let terminate = false,
                    i = 0,
                    keys = Object.keys(obj);

                for (let contact of keys) {

                    var con = obj[contact];
                    // this.deleContact(con.id);;
                    this.http.delete(Helper.url(this.urls.primaryContacts) + '/' + con.id)
                        .subscribe(res => {
                            //console.log(res);

                        });
                    i++;
                    if (i == keys.length) {
                        terminate = true;
                    }
                  //  console.log('terminate - ' + terminate);

                }
                if (terminate) {
                    resolve();
                }
            }
        });
        return promise;
    }
    deleContact(id?: number) {

        let promise = new Promise((resolve, reject) => {
            this.http.delete(Helper.url(this.urls.primaryContacts) + '/' + id)
                .toPromise()
                .then(
                    res => { // Success
                       // console.log(res);
                        resolve();
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });

        return promise;


    }
    //get contact
    getContact() {
        return this.http.get<Contact[]>(Helper.url(this.urls.primaryContacts));
    }

    //get contact by Id
    getContactById(id?: number) {
        return this.http.get<Contact[]>(Helper.url(this.urls.primaryContacts) + '/' + id)
    }

    // get Shipping Locations

    getShippingLocationsByCustomerId(bId?: number, cId?: number) {

        if (bId) {

            return this.http.get<Shipping[]>(Helper.url(this.urls.getBranchShippingLocation) + '/' + bId)
        } else {

            return this.http.get<Shipping[]>(Helper.url(this.urls.getCustomerShippingLocation) + '/' + cId)

        }


    }

    saveShippingLocation(shipping: Shipping, cId?: number, bId?: number) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });


        let obj = {

            "name": shipping.name,
            "addressLine1": shipping.addressLine1,
            "addressLine2": shipping.addressLine2,
            "countryId": shipping.countryId,
            "phone": shipping.phone,
            "postCode": shipping.postCode,
            "email": shipping.email,
            "city": shipping.city,
            "state": shipping.state,
            "branchId": bId,
            "customerId": cId,
            "loadingStyleId": shipping.loadingStyleId,

            "currencyId": shipping.currencyId,
            "contactPersonId": shipping.contactPersonId,
            //  "contactPerson": shipping.contactPerson,
            "shipBy": shipping.shipBy,
            "isTranshipmentAllowed": shipping.isTranshipmentAllowed,
            "countryOfOriginId": shipping.countryOfOriginId,
            "shippingType": shipping.shippingType,
            "deliveryTerms": shipping.deliveryTerms
        }

        //console.log(obj);

        return this.http.post<Shipping[]>(Helper.url(this.urls.getShippingLocation), obj, { headers: reqHeaders });


    }
    updateShippingLocation(shipping: Shipping, cId?: number, bId?: number) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json'
        });


        let obj = {
            "id": shipping.id,
            "name": shipping.name,
            "addressLine1": shipping.addressLine1,
            "addressLine2": shipping.addressLine2,
            "countryId": shipping.countryId,
            "phone": shipping.phone,
            "postCode": shipping.postCode,
            "email": shipping.email,
            "city": shipping.city,
            "state": shipping.state,
            "branchId": bId,
            "customerId": cId,
            "loadingStyleId": shipping.loadingStyleId,

            "currencyId": shipping.currencyId,
            "contactPersonId": shipping.contactPersonId,
            //  "contactPerson": shipping.contactPerson,
            "shipBy": shipping.shipBy,
            "isTranshipmentAllowed": shipping.isTranshipmentAllowed,
            "countryOfOriginId": shipping.countryOfOriginId,
            "shippingType": shipping.shippingType,
            "deliveryTerms": shipping.deliveryTerms
        }

        return this.http.put(Helper.url(this.urls.getShippingLocation) + '/' + shipping.id, obj, { headers: reqHeaders });


    }
    deleteShipping(id: number) {
        return this.http.delete<Shipping[]>(Helper.url(this.urls.getShippingLocation) + '/' + id);
    }

    getShippingLocation() {

        return this.http.get(Helper.url(this.urls.getShippingLocation));

    }
    getCustomerAddressById(id: number) {
        return this.http.get<Shipping[]>(Helper.url(this.urls.getShippingLocation) + '/' + id);
    }
    // get Load Plan

    getLoadPlan() {

        return this.http.get(Helper.url(this.urls.getLoadPlan));
    }

    //get Currency
    getCurrency() {
        return this.http.get(Helper.url(this.urls.getCurrency));
    }

    //get shipping Type
    getShippingType() {
        return this.http.get(Helper.url(this.urls.getShippingType));
    }

    //get contact person by customer id Method
    getContactPerson(cId?: number, bId?: number) {

        if (cId) {
            return this.http.get(Helper.url(this.urls.getCustomerContactById) + '/' + cId);
        } else {
            return this.http.get(Helper.url(this.urls.getBranchContactById) + '/' + bId);
        }

    }

    //get shipping Method
    getShippingMethod() {
        return this.http.get(Helper.url(this.urls.getShippingMethod));
    }


}