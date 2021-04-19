export class Catelouge {
  id?: number;
  name?: string;
  code?: string;
  customerId?: string;
  customerBrand?: string;
  type?: string;
  sizes?: string;
  updatedOn?: any;
  productProperties?: any;
  productVariations?: any;
  updatedAt?: any;
  

  constructor(c?: Catelouge) {
    this.id = c.id && c.id || 0;
    this.name = c.name && c.name || '';
    this.code = c.code && c.code || '';
    this.customerId = c.customerId && c.customerId || '';
    this.customerBrand = c.customerBrand && c.customerBrand || '';
    this.type = c.type  && c.type || '';
    this.sizes = c.sizes  && c.sizes || '';
    this.updatedOn = c.updatedOn  && c.updatedOn || '';
    this.productProperties = c.productProperties && c.productProperties || [];
    this.productVariations = c.productVariations && c.productVariations || [];
    this.updatedAt = c.updatedAt && c.updatedAt || '';
   
  }

  
}
