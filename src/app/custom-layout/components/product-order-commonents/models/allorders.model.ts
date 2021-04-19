import { OrderPrize } from './orderPrize.model';

export class AllOrders {
  id?: number;
  poNumber?: string;
  piNumber?: string;

  orderNo?: string;
  customer?: string;
  customerName?: string;
  customerId?:string;
  productId?:string;
  itemName? : string;
  orderQty? :string;
  shipedQty?:string;
  balance?:string;

  shipTo?: string;
  poDate?: any;
  shipmentDate?: any;
  remainingDays: string;
  status?: any;
  product?:any;
  sizes? :any;
  fromPort? : any;
  branch? : any;
  piDate?: any;
  currency? : any
  country? :any;
  orderPrize?:OrderPrize[];
  paymentTerms? : any;
  specialClause? : any;

  contactPerson? : any;
  shipBy?: string;
  transhipment?: string;
  contactDetails?: string;
  deleveryTerms?: string;
  orginOFGoods?: string;
  type?: string;
  productBrand?: string;
  productCode?: string;
  proformaInvoiceNo?: string;
  proformaInvoiceDate?: string;
  quantityPacked?: string;
  quantityShipped?: string;
  orderProducts?: [];
  customerBranch?: object;
  customerContact?: object;
  shippingLocation?: object;
  countryId?: number;
  deliveryTerms?: string;
  isTranshipmentAllowed?: boolean;
  orderDate?: string;
  originOfGoods?: string;
  packingMaterials?: string;
  shippingType?: string;

  constructor(AllOrders) {
    this.id = AllOrders.id;
    this.poNumber = AllOrders.poNumber;
    this.piNumber = AllOrders.piNumber;
    this.orderNo = AllOrders.orderNo;
    this.customer = AllOrders.customer;
    this.customerName = AllOrders.customerName;
    this.customerId = AllOrders.customerId;
    this.productId = AllOrders.productId;
    
    this.itemName = AllOrders.itemName;
    this.orderQty = AllOrders.orderQty;
    this.shipedQty = AllOrders.shipedQty;
    this.balance = AllOrders.balance;

    this.shipTo = AllOrders.shipTo;
    this.poDate = AllOrders.poDate;
    this.shipmentDate = AllOrders.shipmentDate;
    this.remainingDays = AllOrders.remainingDays;
    this.status = AllOrders.status;
    this.product = AllOrders.product;
    this.sizes = AllOrders.sizes;
    this.fromPort = AllOrders.fromPort;
    this.branch = AllOrders.branch;
    this.piDate = AllOrders.piDate;

    this.currency = AllOrders.currency;
    this.country = AllOrders.country;
  
    this.orderPrize = AllOrders.orderPrize &&  AllOrders.orderPrize || [];

    this.paymentTerms = AllOrders.paymentTerms;
    this.specialClause = AllOrders.specialClause;

    this.contactPerson = AllOrders.contactPerson;
    this.shipBy = AllOrders.shipBy;
    this.transhipment = AllOrders.transhipment;
    this.contactDetails = AllOrders.contactDetails;
    this.deleveryTerms = AllOrders.deleveryTerms;
    this.orginOFGoods = AllOrders.orginOFGoods;
    this.type = AllOrders.type;
    this.productCode = AllOrders.productCode;
    this.productBrand = AllOrders.productBrand;
    this.proformaInvoiceNo = AllOrders.proformaInvoiceNo;
    this.proformaInvoiceDate = AllOrders.proformaInvoiceDate;
    this.quantityPacked = AllOrders.quantityPacked;
    this.quantityShipped = AllOrders.quantityShipped;
    this.orderProducts = AllOrders.orderProducts;
    this.customerBranch = AllOrders.customerBranch;
    this.customerContact = AllOrders.customerContact;
    this.shippingLocation = AllOrders.shippingLocation;
    this.countryId = AllOrders.countryId;
    this.deliveryTerms = AllOrders.deliveryTerms;
    this.isTranshipmentAllowed = AllOrders.isTranshipmentAllowed;
    this.orderDate = AllOrders.orderDate;
    this.originOfGoods = AllOrders.originOfGoods;
    this.packingMaterials = AllOrders.packingMaterials;
    this.shippingType = AllOrders.shippingType;
  }

 
}
