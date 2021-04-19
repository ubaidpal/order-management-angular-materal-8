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
export class ProductService {
    private urls = {
        "customer": "/customer",
        "products": "/products",
        "addProduct": "/product",
        "product": "/Product",
        "productsByIds": "/product/details",

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
    getProducts() {
        return this.http.get(Helper.url(this.urls.product));
    }
    
    getProductById(Pid?: number) {
        return this.http.get(Helper.url(this.urls.addProduct) + '/' + Pid);
    }

    getProductsByCustomerId(Cid?: number) {
        return this.http.get(Helper.url(this.urls.customer) + '/' + Cid + this.urls.products);
    }

    //add Product
    addProduct(formData: any) {
       // console.log('final *** formData >>', formData)
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.addProduct), formData, { headers: reqHeaders });
    }

    upateProduct(formData: any, productId) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        let fData = formData;
        fData.id = productId;
        return this.http.put(Helper.url(this.urls.addProduct) + '/' + productId, fData, { headers: reqHeaders });
    }

    delProductById(Pid?: number) {
    
        return this.http.delete(Helper.url(this.urls.addProduct) + '/' + Pid);
    }

    getProductsByIds(formData: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.productsByIds), formData, { headers: reqHeaders });
    }

}