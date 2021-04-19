import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models/user';
import { Country } from '../_models/country';
import { Role } from '../_models/role';
import { Observable } from 'rxjs';
import { Customer } from '../components/customer-component/interfaces/customer.model';
import { Shipping } from '../components/customer-component/interfaces/shipping.model';
import { Helper } from '../_helpers/helper';
import { Branch } from '../components/customer-component/interfaces/branch.interface';
import { Contact } from '../components/contact/model/contact.model'
@Injectable({ providedIn: 'root' })
export class PackingService {
    private urls = {
        "orderPacking": "/OrderPacking",
        "orderPackingByOrderId": "/OrderPacking/order",

    };
    getPrimaryContact: Branch;
    obj: any = [];
    getAllContact: any = [];
    get addresses() {
        return this.getPrimaryContact.addresses
    }
    constructor(private http: HttpClient) {

    }

    //get shipping Method
    getOrderPacking() {
        return this.http.get(Helper.url(this.urls.orderPacking));
    }
    
    getOrderPackingByOrderId(orderId?: number) {
        return this.http.get(Helper.url(this.urls.orderPackingByOrderId) + '/' + orderId);
    }


}