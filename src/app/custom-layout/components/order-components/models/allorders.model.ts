import { OrderPrize } from './orderPrize.model';

export class AllOrders {
  id?: number;
  orderNo ?: string;
  orderDate ?: string;
  proformaInvoiceNo?: string;
  customer?: object;
  customerName?: string;
  customerId?: string;
  customerBranchId?: string;
  shippingLocationId?: string;
  currencyId?:string;
  countryId?:string;
  proformaInvoiceDate?: any;
  shipmentDate?: any;
  paymentTerms: string;
  status?: any;
  product?:any;
  sizes? :any;
  fromPort? : any;
  branch? : any;
  piDate?: any;
  currency? : any
  country? :any;
  orderPrize?:OrderPrize[];
  specialClause? : any;

  contactPerson? : any;
  shipBy?: string;
  transhipment?: string;
  contactDetails?: string;
  deleveryTerms?: string;
  orginOFGoods?: string;
  type?: string;

  labels?:string;
  shippingLocation?: object;
  packingProgress?: object;
  orderProducts?: any;
  packingMaterials?: any;
  customerContact?: any;
  originOfGoods?: any;
  shippingType?: any;

  constructor(AllOrders) {
    this.id = AllOrders.id;
    this.orderNo  = AllOrders.orderNo ;
    this.orderDate  = AllOrders.orderDate ;
    this.proformaInvoiceNo = AllOrders.proformaInvoiceNo;
    this.customer = AllOrders.customer;
    this.customerName = AllOrders.customerName;
    this.customerId = AllOrders.customerId;
    this.countryId = AllOrders.countryId;
    this.currencyId = AllOrders.currencyId;
    this.customerBranchId = AllOrders.customerBranchId;
    this.shippingLocationId = AllOrders.shippingLocationId;
    this.proformaInvoiceDate = AllOrders.proformaInvoiceDate;
    this.shipmentDate = AllOrders.shipmentDate;
    this.paymentTerms = AllOrders.paymentTerms;
    this.status = AllOrders.status;
    this.product = AllOrders.product;
    this.sizes = AllOrders.sizes;
    this.fromPort = AllOrders.fromPort;
    this.branch = AllOrders.branch;
    this.piDate = AllOrders.piDate;

    this.currency = AllOrders.currency;
    this.country = AllOrders.country;
  
    this.orderPrize = AllOrders.orderPrize &&  AllOrders.orderPrize || [];

  
    this.specialClause = AllOrders.specialClause;

    this.contactPerson = AllOrders.contactPerson;
    this.shipBy = AllOrders.shipBy;
    this.transhipment = AllOrders.transhipment;
    this.contactDetails = AllOrders.contactDetails;
    this.deleveryTerms = AllOrders.deleveryTerms;
    this.orginOFGoods = AllOrders.orginOFGoods;
    this.type = AllOrders.type;

    this.labels = AllOrders.labels;
    this.shippingLocation = AllOrders.shippingLocation;
    this.packingProgress = AllOrders.packingProgress;
    this.orderProducts = AllOrders.orderProducts;
    this.packingMaterials = AllOrders.packingMaterials;
    this.customerContact = AllOrders.customerContact;
    this.originOfGoods = AllOrders.originOfGoods;
    this.shippingType = AllOrders.shippingType;
  }

 
}
