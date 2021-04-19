import { Branch } from '../app/custom-layout/components/customer-component/interfaces/branch.interface';

export const branchData: Branch[] = [
  {
    id: 1,
    imageSrc: 'assets/img/avatars/branches.jpg',
    name: 'Ubaid Ullah',
    country: 92,
    addressLine1: 'Supportal',
    addressLine2: 'Supportal',
    city: 'Lahore',
    state: 'Punjab',
    postCode: "54000",
    phone: '+21 (988) 504-2559',
    starred: false,
    addresses: [
      {
        name: 'aaaa',
        email: 'bbbb',
        phone: 'ccccc',
        role: 'ddddd',
        status: false
      },
      {
        name: 'asd',
        email: 'hs',
        phone: 'lhore',
        role: 'pak',
        status: true
      }
    ]
  },
  {
    id: 2,
    imageSrc: 'assets/img/avatars/branches.jpg',
    name: 'Guerrero Morales',
    country: 101,
    addressLine1: 'Supportal2',
    addressLine2: 'Supportal2',
    city: 'Turkey',
    state: 'Ankara',
    postCode: "54000",
    phone: '+21 (988) 504-2559',
    starred: false,
    addresses: [{
      name: 'asd',
      email: 'hs',
      phone: 'lhore',
      role: 'pak',
      status: true
    }]
  }
];
