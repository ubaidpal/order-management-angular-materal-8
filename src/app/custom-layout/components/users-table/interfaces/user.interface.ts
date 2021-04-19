export interface User {
  id: number;
  name: string;
  imageSrc?: string,
  email: string;
  agencyRole: number;
  privillage: number;
  office?: string;
  agency: number;
  password: string;
  status: boolean;
}
