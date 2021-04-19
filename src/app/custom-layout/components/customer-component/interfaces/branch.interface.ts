import { Address } from './address.interface';

export class Branch {
  id: number;
  imageSrc?: string;
  name?: string;
  country?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postCode?: string;
  phone?: string;
  starred?: boolean;
  customerId?:number;
  phonePrefix?:string;
  addresses?:Address[];


  constructor(b?:Branch) {
   this.id = b && b.id || 0;
   this.imageSrc = b &&  b.imageSrc || '';
   this.name = b &&  b.name || '';
   this.country = b &&  b.country || 0;
   this.addressLine1 = b &&  b.addressLine1 || '';
   this.addressLine2 = b &&  b.addressLine2 || '';
   this.city = b &&  b.city || '';
   this.state = b &&  b.state || '';
   this.postCode = b &&  b.postCode || '';
   this.phone = b &&  b.phone || '';
   this.phonePrefix = b &&  b.phonePrefix || '';
   this.starred = b &&  b.starred || true;
   this.customerId =  b &&  b.customerId || null;
   this.addresses = b &&  b.addresses || [];

  }
}
