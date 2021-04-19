export class Customer {
  id: number;
  imageSrc?: string;
  productCode?: string;
  productName?: string;
  customer?: string;
  brand?: string;
  type?: any;
  size?: string;
  updateDate?: string;
  
  name?: string;
  code?: string;
  customerId?: string;
  customerBrand?: any;
  updatedAt?: any;
  productVariations?: any;
  productProperties?: any;
  customerProducts?: any;

  constructor(customer) {
    this.id = customer.id;
    this.imageSrc = customer.imageSrc;
    this.productCode = customer.productCode;
    this.productName = customer.productName;
    this.customer = customer.customer;
    this.brand = customer.brand;
    this.type = customer.type;
    this.size = customer.size;
    this.updateDate = customer.updateDate;
    this.customerProducts = customer.customerProducts ? customer.customerProducts : [];


    this.name = customer.name && customer.name || '';
    this.code = customer.code && customer.code || '';
    this.customerId = customer.customerId && customer.customerId || '';
    this.customerBrand = customer.customerBrand && customer.customerBrand || '';
    this.type = customer.type  && customer.type || '';
    this.updatedAt = customer.updatedAt  && customer.updatedAt || '';
    this.productVariations = customer.productVariations && customer.productVariations || '',
    this.productProperties = customer.productProperties && customer.productProperties || ''
   
  }

  // get name() {
  //   let name = '';

  //   if (this.productCode && this.productName) {
  //     name = this.productCode + ' ' + this.productName;
  //   } else if (this.productCode) {
  //     name = this.productCode;
  //   } else if (this.productName) {
  //     name = this.productName;
  //   }

  //   return name;
  // }

  // set name(value) {
  // }

  // get address() {
  //   return `${this.customer}, ${this.customer} ${this.city}`;
  // }

  // set address(value) {
  // }
}
