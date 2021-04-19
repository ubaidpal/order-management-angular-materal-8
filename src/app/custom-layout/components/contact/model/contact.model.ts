export class Contact {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  customerId?:string;
  branchId?: string;
  customer?:string;
  branch?:string;

  role?: string;
  isPrimary?: boolean;
  phonePrefix?:string;
  
 
 
  

  constructor(c?: Contact) {
    this.id = c.id && c.id || 0;
    this.name = c.name && c.name || '';
    this.phone = c.phone  && c.phone || '';
    this.email = c.email  && c.email || '';
    this.customerId = c.customerId && c.customerId || '';
    this.branchId = c.branchId && c.branchId || '';
    this.customer = c.customer && c.customer || '';
    this.branch = c.branch && c.branch || '';

    this.role = c.role && c.role || '';
    this.isPrimary = c.isPrimary && c.isPrimary || false;
    this.phonePrefix = c.phonePrefix && c.phonePrefix ||'';
  
  

  

   
  }

  
}
