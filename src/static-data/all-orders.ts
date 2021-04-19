import Color from 'color';
import theme from '../@vex/utils/tailwindcss';

export const aioTableLabels = [
  {
    text: 'Ready to Ship',
    backgroundColor: Color(theme.colors.green['500']).fade(0.9),
    color: theme.colors.green['500']
  },
  {
    text: 'in Progress',
    backgroundColor: Color(theme.colors.cyan['500']).fade(0.9),
    color: theme.colors.cyan['500']
  },
  {
    text: 'pending',
    backgroundColor: Color(theme.colors.teal['500']).fade(0.9),
    color: theme.colors.teal['500']
  },
  {
    text: 'shipped',
    backgroundColor: Color(theme.colors.purple['500']).fade(0.9),
    color: theme.colors.purple['500']
  },
];

export const allOrders = [
  {
    id: 0,
    poNumber: 'po-121212',
    piNumber: 'BHSB/9079/2019',
    customer: 'Dejesus',
   
    itemName: 'Nissan Angel 234',
    orderQty: '1,500',
    shipedQty: '1,500',
    balance: '1,500',

    shipTo: 'Asad',
    poDate: new Date(2018, 11, 24).toDateString(),
    shipmentDate:  new Date(2018, 11, 24).toDateString(),
    remainingDays:42+ ' days',
    labels: [aioTableLabels[2]],
    sizes: 'medium',
    orderPrize: [
      {
        itemName: 'item1',
        size: 'large',
        cartons: 2,
        price: 55,
        currency: 'USD',
        prizeCartan:2,
        totalValue: 0
      },
      {
        itemName: 'item2',
        size: 'xLarge',
        cartons: 4,
        price: 55,
        currency: 'USD',
        prizeCartan:2,
        totalValue: 0
      }
    ],
    paymentTerms:'PayPal',
    specialClause: 'Lorem Ipsum',

    contactPerson: 'Denial DeGeateno',
    shipBy: 'Sea Fright',
    transhipment: 'Allowed',
    contactDetails: '+6012 323 9802',
    deleveryTerms: 'F.O.B Port Klang',
    orginOFGoods: 'Malyasia',
    type: 'Import',

   
  },
 
  {
    id: 1,
    poNumber: 'po-121212',
    piNumber: 'BHSB/9079/2019',
    customer: 'Jamal',

    itemName: 'Nissan Angel 234',
    orderQty: '1,500',
    shipedQty: '1,500',
    balance: '1,500',


    shipTo: 'Asad',
    poDate: new Date(2019, 11, 24).toDateString(),
    shipmentDate:  new Date(2019, 11, 24).toDateString(),
    remainingDays:42+ ' days',
    labels: [aioTableLabels[2]],
    sizes: 'large',
    orderPrize: [
      {
        itemName: 'item1',
        size: 'large',
        cartons: 2,
        price: 55,
        currency: 'PKR',
        prizeCartan:2,
        totalValue: 0
      },
      {
        itemName: 'item2',
        size: 'xLarge',
        cartons: 1,
        price: 55,
        currency: 'USD',
        prizeCartan:2,
        totalValue: 0
      }
    ],
    paymentTerms:'PayPal',
    specialClause: 'Lorem Ipsum',

    contactPerson: 'Ayesha',
    shipBy: 'Sea Fright',
    transhipment: 'Allowed',
    contactDetails: '+6012 323 9802',
    deleveryTerms: 'F.O.B Port Klang',
    orginOFGoods: 'Pakistan',
    type: 'Export',
  },
 
  
];
