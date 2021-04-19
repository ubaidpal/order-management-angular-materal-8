export class Shipping {
  id?: number
  name?: string
  shipTo?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  country?: string
  countryId?: string
  postCode?: string
  loadingStyleId?: string
  phone?: string
  email?:string

  currency?: string
  currencyId?:number
  contactPersonId?:number
  contactPerson?: []
  shipBy?: string
  isTranshipmentAllowed?: boolean
  countryOfOriginId?: string
  shippingType?: string
  deliveryTerms?: string


  constructor(Shipping) {

    this.id = Shipping.id;
    this.name = Shipping.name;
    this.shipTo = Shipping.shipTo;
    this.addressLine1 = Shipping.addressLine1;
    this.addressLine2 = Shipping.addressLine2;
    this.city = Shipping.city;
    this.state = Shipping.state;
    this.country = Shipping.country;
    this.countryId = Shipping.countryId;
    this.postCode = Shipping.postCode;
    this.loadingStyleId = Shipping.loadingStyleId;
    this.phone = Shipping.phone;
    this.email = Shipping.email;

    this.currency = Shipping.currency;
    this.currencyId = Shipping.currencyId;
    this.contactPersonId = Shipping.contactPersonId;
    this.contactPerson = Shipping.contactPerson;
    this.shipBy = Shipping.shipBy;
    this.isTranshipmentAllowed = Shipping.isTranshipmentAllowed && Shipping.isTranshipmentAllowed || false;
    this.countryOfOriginId = Shipping.countryOfOriginId;
    this.shippingType = Shipping.shippingType;
    this.deliveryTerms = Shipping.deliveryTerms;


  }



  get address() {
    return `${this.addressLine1}, ${this.postCode} ${this.city}`;
  }

  set address(value) {
  }


}
