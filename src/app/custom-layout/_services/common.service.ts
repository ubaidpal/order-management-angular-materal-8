import { Injectable, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from "rxjs/operators";
import { Country } from '../_models/country';
import { Helper } from '../_helpers/helper';
import Utils from '../_utils/utils';
import _ from 'underscore';


@Injectable({ providedIn: 'root' })

export class CommonService {
    private urls = {
        "countries": "/static/countries",
        "propertyTypes": "/static/propertyTypes",
        "productCategories": "/static/productCategories",
        "variations": "/static/variations",
        "properties": "/static/properties",
        "propertyValues": "/static/PropertyValues",
        "packingMaterials": "/static/packingMaterials"
    };
   
    constructor(private http: HttpClient) {

    }

    getCountries(success?: any, error?: any) {
        const countriesList = Utils.getLocalStorage('countriesList');
        if (!_.isEmpty(countriesList) && countriesList.length > 0) {
            setTimeout(() => {
                if (_.isFunction(success))
                    success(countriesList)
            }, 5);
            return;
        }
        this.http.get<Country[]>(Helper.url(this.urls.countries))
            .pipe(first())
            .subscribe(
            data => {
                let cData = data ? data : [];
                Utils.setLocalStorage('countriesList', cData);
                if (_.isFunction(success))
                    success(cData);
            },
            err => {
                if (_.isFunction(error))
                    error(err);
            }
        );
    }

    async getPropertyTypes(success?: any, error?: any) {
        const pPt = Utils.getLocalStorage('productPropertiesTypes');
        if (!_.isEmpty(pPt)) {
          setTimeout(() => {
            if (_.isFunction(success))
                success(pPt);      
          }, 5);
          return;
        }
        this.http.get(Helper.url(this.urls.propertyTypes))
          .pipe(first())
          .subscribe(
            data => {
              Utils.setLocalStorage('productPropertiesTypes', data);
              if (_.isFunction(success))
                success(data);
            },
            err => {
                if (_.isFunction(error))
                    error(err);
            }
          );
      }

    async getProductCategories(success?: any, error?: any) {
    const pC = Utils.getLocalStorage('productCategories');
    if (!_.isEmpty(pC)) {
        if (_.isFunction(success))
            success(pC);
        return;
    }
    this.http.get(Helper.url(this.urls.productCategories))
        .pipe(first())
        .subscribe(
        data => {
            if (data) {            
            Utils.setLocalStorage('productCategories', data);
            if (_.isFunction(success))
                success(data);
            }
        },
        err => {
            if (_.isFunction(error))
                error(err);
        }
        );
    }

    async getSizesVariations(success?: any, error?: any) {
        const sV = Utils.getLocalStorage('sizesVariations');
        if (!_.isEmpty(sV)) {
            if (_.isFunction(success))
                success(sV);
            return;
        }
        this.http.get(Helper.url(this.urls.variations))
            .pipe(first())
            .subscribe(
            data => {
                if (data) {
                Utils.setLocalStorage('sizesVariations', data);
                if (_.isFunction(success))
                    success(data);
                }
            },
            err => {
                if (_.isFunction(error))
                    error(err);
            }
        );
    }

    async getAllProperties(success?: any, error?: any) {
        this.http.get(Helper.url(this.urls.properties))
          .pipe(first())
          .subscribe(
            data => {
              if (data) {
                if (_.isFunction(success))
                    success(data);
              }
            },
            err => {
              if (_.isFunction(error))
                    error(err);
            }
        );
    }

    async getAllStaticProperties(success?: any, error?: any) {
        const sP = Utils.getLocalStorage('staticProperties');
        if (!_.isEmpty(sP)) {
          setTimeout(() => {
            if (_.isFunction(success))
                success(sP);
          }, 0);
          return;
        }
        this.http.get(Helper.url(this.urls.propertyValues))
          .pipe(first())
          .subscribe(
            data => {
              if (data) {
                Utils.setLocalStorage('staticProperties', data);
                if (_.isFunction(success))
                    success(data);
              }
            },
            err => {
              if (_.isFunction(error))
                    error(err);
            }
        );
    }

    async getStaticPackingMaterials(success?: any, error?: any) {
        const sP = Utils.getLocalStorage('packingMaterials');
        if (!_.isEmpty(sP)) {
          setTimeout(() => {
            if (_.isFunction(success))
                success(sP);
          }, 0);
          return;
        }
        this.http.get(Helper.url(this.urls.packingMaterials))
          .pipe(first())
          .subscribe(
            data => {
              if (data) {
                Utils.setLocalStorage('packingMaterials', data);
                if (_.isFunction(success))
                    success(data);
              }
            },
            err => {
              if (_.isFunction(error))
                    error(err);
            }
        );
    }

    callAllStaticApi() {
        this.getCountries();
        this.getPropertyTypes();
        this.getProductCategories();
        this.getSizesVariations();
        this.getAllProperties();
        this.getAllStaticProperties();
    }



}