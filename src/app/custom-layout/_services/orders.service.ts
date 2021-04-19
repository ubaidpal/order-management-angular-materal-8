import { Injectable, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, catchError, tap, map } from "rxjs/operators";
import * as _ from "underscore";
import { User } from '../_models/user';
import { Country } from '../_models/country';
import { Role } from '../_models/role';
import { Observable } from 'rxjs';
import { Customer } from '../components/customer-component/interfaces/customer.model';
import { Shipping } from '../components/customer-component/interfaces/shipping.model';
import { Helper } from '../_helpers/helper';
import { Branch } from '../components/customer-component/interfaces/branch.interface';
import { Contact } from '../components/contact/model/contact.model'
import { formatDate } from '@angular/common';
import * as moment from 'moment'; 

@Injectable({ providedIn: 'root' })

export class OrderService {
    private urls = {
        "order": "/order",
        "invoice": "/invoice",
        "shipmentDate": "/invoice/shipmentDate",
        "invoiceComplete": "/invoice/complete",
        "updatePacking": "/order/updatePacking",
        "orderCounts": "/order/counts",
        "shipment": "/shipment",
        "shipmentInvoice": "/shipment/invoice",
        "shipmentByOrder": "/shipment/order",
        "packing": "/packing",
        "packingOrder": "/packing/order",
        "orderPacking": "/orderPacking",
        "orderPackingByOrderId": "/orderPacking/order",
        "ordersPacking": "/order/orderPacking"
    };
    getPrimaryContact: Branch;
    obj: any = [];
    getAllContact: any = [];
    newDate = Date.now();
    varitions: any;
    get addresses() {
        return this.getPrimaryContact.addresses
    }
    constructor(private http: HttpClient) {

    }

    getAllOrders() {
        return this.http.get(Helper.url(this.urls.order));
    }
    deleteOrder(id: number) {
        return this.http.delete<Customer[]>(Helper.url(this.urls.order) + '/' + id);
    }
    addUpdateOrder(customer?: any, getdata?: any) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Credentials': 'true'

        });
        const variationArray: any = [];

        if (customer.orderPrize) {
            customer.orderPrize.forEach(veration => {
                // let productVariantFound:any = '';
                // if (getdata && getdata.orderProducts && getdata.orderProducts.length > 0)
                //     productVariantFound = getdata.orderProducts.find(f => (f.productId == veration.itemName && f.productVariationId === veration.size))

                let ob: any = {
                    "productId": veration.itemName ? veration.itemName : '',
                    "productVariationId": veration.size ? veration.size : '',
                    "quantity": veration.cartons ? veration.cartons : '',
                    "unitPrice": veration.price ? veration.price : 0
                }

                if (veration.itemId && veration.itemId !== null) {
                    ob.id = veration.itemId;
                }
                variationArray.push(ob);

            });
        }

        const obj: any = {
            "orderNo": customer.poNumber,
            "orderDate": customer.poDate,
            "proformaInvoiceNo": customer.piNumber,
            "proformaInvoiceDate": customer.piDate,
            "customerId": customer.customer,
            "fromPort": customer.fromPort,
            "customerBranchId": customer.branch,
            "shippingLocationId": customer.shipTo,
            "currencyId": customer.currency,
            "countryId": customer.country,
            "shipmentDate": customer.shipmentDate,
            "shipBy": customer.shipBy,
            "paymentTerms": customer.paymentTerms,
            "specialClause": customer.specialClause,

            "contactPerson": customer.contactPerson,
            "deliveryTerms": customer.deliveryTerms,
            "isTranshipmentAllowed": customer.isTranshipmentAllowed,
            "contactDetails": customer.contactDetails,
            "originOfGoods": customer.originOfGoods,
            "shippingType": customer.shippingType,

            "status": 'pending',
            "orderProducts": variationArray

        }


        if (customer.id && customer.id > 0) {
            obj.status = getdata.status;
            obj.id = customer.id;
            const res = this.http.put(Helper.url(this.urls.order) + '/' + customer.id, obj, { headers: reqHeaders });
            return res;
        } else {

            const res = this.http.post(Helper.url(this.urls.order), obj, { headers: reqHeaders });
            return res;
        }


    }
    
    getOrdersById(id?: number) {

        return this.http.get(Helper.url(this.urls.order) + '/' + id);
    }

    markAsCompelte(id?: number) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.order + '/complete/' + id), {}, { headers: reqHeaders });
    }

    updateStatus(id?: number, status?: string) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.order + '/update_status/' + id + '/' + status), {}, { headers: reqHeaders });
    }


    addUpdateOrderInvoice(obj?: any) {

        const reqHeaders = new HttpHeaders({

            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Credentials': 'true'

        });

        if (obj.id && obj.id > 0) {
            return this.http.put(Helper.url(this.urls.invoice) + '/' + obj.id, obj, { headers: reqHeaders });

        } else {
            return this.http.post(Helper.url(this.urls.invoice), obj, { headers: reqHeaders });
        }




    }

    getAllInvoice() {

        return this.http.get(Helper.url(this.urls.invoice));
    }

    deleteInovice(id?: number) {

        return this.http.delete(Helper.url(this.urls.invoice) + '/' + id);
    }

    getInoviceById(id?: number) {

        return this.http.get(Helper.url(this.urls.invoice) + '/' + id);
    }

    addShipmentDate(obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        const newObj: any = {
            "invoiceId": obj.invoiceId,
            "currentShipmentDate": new Date(obj.currentShipmentDate),
            "newShipmentDate": new Date(obj.newShipmentDate),
            "reason": obj.reason ? obj.reason : '',

        }
       // console.log(obj);
        return this.http.post(Helper.url(this.urls.shipmentDate), newObj, { headers: reqHeaders });
    }

    invoiceComplete(obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        const newObj: any = {
            "invoiceId": obj.invoiceId,
            "shippedOn": new Date(obj.shippedOn),
            "vesselId": obj.vesselId,

        }
      //  console.log(newObj);
        return this.http.post(Helper.url(this.urls.invoiceComplete), newObj, { headers: reqHeaders });
    }
    updateInvoiceStatus(id?: number, status?: string) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.invoice + '/update_status/' + id + '/' + status), {}, { headers: reqHeaders });
    }
    
    updatePacking(obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.updatePacking), obj, { headers: reqHeaders });
    }

    getOrderCounts() {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.orderCounts), {}, { headers: reqHeaders });
    }

    getShipment() {
        return this.http.get(Helper.url(this.urls.shipment));
    }

    getShipmentByOrderId(id) {
        return this.http.get(Helper.url(this.urls.shipmentByOrder) + '/' + id);
    }

    getShipmentById(id?: number) {
        return this.http.get(Helper.url(this.urls.shipment) + '/' + id);
    }

    getShipmentInvoiceById(id?: number) {
        return this.http.get(Helper.url(this.urls.shipmentInvoice) + '/' + id);
    }

    createShipment(obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.shipment), obj, { headers: reqHeaders });
    }

    updateShipment(obj?: any, id?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.put(Helper.url(this.urls.shipment + '/' + id), obj, { headers: reqHeaders });
    }

    deleteShipment(id?: number) {
        return this.http.delete(Helper.url(this.urls.shipment) + '/' + id);
    }

    getPacking() {
        return this.http.get(Helper.url(this.urls.packing));
    }
    
    getPackingByOrderId(id) {
        return this.http.get(Helper.url(this.urls.packingOrder) + '/' + id);
    }

    createPackingMaterial(obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.packing), obj, { headers: reqHeaders });
    }

    updatePackingMaterial(id?:any , obj?: any) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.put(Helper.url(this.urls.packing) + '/' + id, obj, { headers: reqHeaders });
    }

    addOrderPacking(obj) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.orderPacking), obj, { headers: reqHeaders });
    }

    getOrderPackingByOrderId(id) {
        return this.http.get(Helper.url(this.urls.orderPackingByOrderId) + '/' + id);
    }
    
    getOrdersPacking(obj) {
        const reqHeaders = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(Helper.url(this.urls.ordersPacking), obj, { headers: reqHeaders });
    }
}