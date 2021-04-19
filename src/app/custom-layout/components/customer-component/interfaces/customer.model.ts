export class Customer {
  id: number
  name?: string
  registrationNumber?: string
  country?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postcode?: string
  phoneNumber?: string
  branch?: boolean
  allbranch?: boolean
  hasBranch?:boolean
  representative?: string
  role?: number
  email?: string
  phoneNumber2?: string
  branches?:string
  addresses?:string
  contacts?:string
  customerProducts?:string
  phonePrefix?: string
  phonePrefix2?: string
  updatedDate?: string
  representativeRole?: string

  constructor(customer?: Customer) {
    this.id = customer.id && customer.id || 0;
    // this.imageSrc = customer.imageSrc;
    this.name = customer.name && customer.name || '';
    this.registrationNumber = customer.registrationNumber && customer.registrationNumber || '';
    this.country = customer.country && customer.country || '';
    this.addressLine1 = customer.city && customer.addressLine1 || '';
    this.addressLine2 = customer.city && customer.addressLine2 || '';
    this.city = customer.city && customer.city || '';
    this.state = customer.state && customer.state || '';
    this.postcode = customer.postcode && customer.postcode || '';
    this.phoneNumber = customer.phoneNumber && customer.phoneNumber || '';
    this.branch = customer.phoneNumber && customer.branch || false;
    this.allbranch = customer.allbranch && customer.allbranch || false;
    this.hasBranch = customer.hasBranch && customer.hasBranch || false;
    this.representative = customer.representative && customer.representative || '';
    this.role = customer.role && customer.role || 0;
    this.email = customer.email && customer.email || '';
    this.phoneNumber2 = customer.phoneNumber2 && customer.phoneNumber2 || '';
    this.phonePrefix = customer.phonePrefix && customer.phonePrefix || '';
    this.phonePrefix2 = customer.phonePrefix2 && customer.phonePrefix2 || '';
    this.branches = customer.branches && customer.branches || '';
    this.addresses = customer.addresses && customer.addresses || '';
    this.contacts = customer.contacts && customer.contacts || '';
    this.customerProducts = customer.customerProducts && customer.customerProducts || '';
    this.updatedDate = customer.updatedDate && customer.updatedDate || '';
    this.representativeRole = customer.representativeRole && customer.representativeRole || '';
  }

  get fname() {
    let name = '';

    if (this.name) {
      name = this.name;
    }

    return name;
  }

  set fname(value) {
  }

  get address() {
    return `${this.addressLine1}, ${this.postcode} ${this.city}`;
  }

  set address(value) {
  }
  get fullPhone() {
    return ` ${this.phoneNumber}`;
  }


}
