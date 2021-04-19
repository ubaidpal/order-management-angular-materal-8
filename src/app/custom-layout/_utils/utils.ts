import * as _ from "underscore";

export default class Utils {
  static setLocalStorage(key: any, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getLocalStorage(key: any) {
    return JSON.parse(localStorage.getItem(key));
  }

  static deleteLocalStorage(key: any) {
    localStorage.removeItem(key);
  }

  static resetLocalStorageItems() {
    let keysToRemove = [
      "sizesVariations",
      "productCategories",
      "staticProperties",
      "productPropertiesTypes",
      "countriesList",
      "packingMaterials"
    ];
    keysToRemove.forEach((k) => this.deleteLocalStorage(k));
  }

  static newLocalApiVersion() {
    return "v3";
  }

  static getStaticValueByKey(data: any, key: string) {
    let obj = {};
    if (!_.isEmpty(data)) {
      const foundObj = data.find((f) => f.property === key);
      obj = foundObj.values;
    }
    return obj;
  }

  static getStaticPropertyByName(data: any, key: string, isObj?: boolean) {
    let obj: any = "";
    if (!_.isEmpty(data)) {
      const foundObj = data.find((f) => f.name === key);
      obj = foundObj;
    }
    if (isObj) {
      return obj;
    }
    return obj ? obj.id : "";
  }

  static checkPhysicalPropertyFields(selectedRow: any) {
    let obj = {
      showMinMaxTar: false,
      showForceAtBreak: false,
    };
    if (selectedRow.ref === "ASTM D 6319") {
      obj = {
        showMinMaxTar: true,
        showForceAtBreak: false,
      };
    }
    if (selectedRow.ref === "EN 455-2") {
      obj = {
        showForceAtBreak: true,
        showMinMaxTar: false,
      };
    }
    return obj;
  }

  static productPropertiesObjectStructure(
    value: any,
    isObject: boolean,
    propertyId: any
  ) {
    const obj = {
      value: value ? value : "",
      priority: "0",
      isObject,
      propertyId,
    };
    return obj;
  }

  static updateKeyValue(firstObj: any, dataArray: any) {
    let arr = _.clone(dataArray);
    const keys = Object.entries(firstObj);
    for (const [key, value] of Object.entries(arr)) {
      for (const [key2, value2] of keys) {
        if (_.isEmpty(value[key2])) {
          arr[key][key2] = value[key2] ? value[key2] : "";
        }
      }
    }
    return arr;
  }
  static getPhoneCodes(countriesList: any) {
    let codes = [];
    if (!_.isEmpty(countriesList) && countriesList.length > 0) {
      codes = _.compact(_.pluck(countriesList, "phonecode"));
    }
    return codes;
  }

  static getPhoneCodeByNumber(phoneNumber: any) {
    let code = "";
    if (phoneNumber) {
      const phoneArray = phoneNumber.split("-");
      code = phoneArray && phoneArray.length > 0 ? phoneArray[0] : "";
    }
    return code;
  }

  static getValidPhoneNumber(phoneNumber: any) {
    return phoneNumber.replace(/[^0-9.]/g, "");
  }

  static decimalValidation(phoneNumber) {
    //if (phoneNumber.match(/^\d+(\.\d*[1-9])?$/g)) {
      if (phoneNumber.match(/^\d*\.?\d{0,99}$/g)) {
      return phoneNumber;
    } else {
      return "";
    }
  }

  static getDecimalNumber(phoneNumber: any) {
    return phoneNumber.replace("/^d+.d{0,2}$/", "");
  }

  static getDatePickerFormate() {
    const MY_FORMATS = {
      parse: {
        dateInput: 'LL',
      },
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
      }
    }
    return MY_FORMATS;
  }
  static getDateFormate() {
    return 'd MMM yyyy';
  }

  static sortProductsByVariant(filter_Products: any, original_products: any) {
    let filterProducts = _.clone(filter_Products);
    filterProducts = filterProducts.map((op) => {
      const foundProduct = original_products.find((p) => p.id === op.productId);
      let variantId = "";
      if (foundProduct && foundProduct.productVariations) {
        const foundVariant = foundProduct.productVariations.find(
          (pv) => pv.id === op.productVariationId
        );
        variantId = foundVariant ? foundVariant.variationId : "";
      }
      return {
        ...op,
        variantId,
      };
    });
    filterProducts = _.groupBy(
      _.sortBy(filterProducts, "variantId"),
      "productId"
    );
    filterProducts = Object.keys(filterProducts).reduce(function (res, v) {
      return res.concat(filterProducts[v]);
    }, []);
    return filterProducts;
  }

  static getStatusName(status) {
    let name = status;
    if (status === 'cancelled') {
      name = 'Cancelled';
    } else if (status === 'completed' || status == this.status().Completed) {
      name = 'Completed';
    } else if (status === 'shipped' || status == this.status().Shipped) {
      name = 'Shipped';
    } else if (status === 'pending' || status == this.status().New) {
      name = 'New';
    } else if (status === 'in progress' || status === 'in-progress' || status == this.status().InProgress) {
      name = 'In Progress';
    } else if (status === 'ready for shipment' || status == this.status().ReadyForShipment) {
      name = 'Ready for Shipment';
    }
    return name;
  }

  static numberArraySum(array) {
    const quantitySum = array.reduce(function(a, b){
        return parseFloat(a) + parseFloat(b);
    }, 0);
    return quantitySum;
  }

  static status() {
    return {
      "New": "N",
      "ReadyForShipment": "R",
      "Shipped": "S",
      "InProgress": "I",
      "Completed": "C"
    }    
  }
}
