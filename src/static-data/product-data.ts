import Color from 'color';
import theme from '../@vex/utils/tailwindcss';
import { DateTime } from 'luxon';
export const productTableLabels = [
  {
    text: 'New',
    backgroundColor: Color(theme.colors.green['500']).fade(0.9),
    color: theme.colors.green['500']
  },
  {
    text: 'Lead',
    backgroundColor: Color(theme.colors.cyan['500']).fade(0.9),
    color: theme.colors.cyan['500']
  },
  {
    text: 'In Progress',
    backgroundColor: Color(theme.colors.teal['500']).fade(0.9),
    color: theme.colors.teal['500']
  },
  {
    text: 'Completed',
    backgroundColor: Color(theme.colors.purple['500']).fade(0.9),
    color: theme.colors.purple['500']
  },
];

export const productTableData = [
  {
    id: 0,
    productCode: 'NAC-300 (CR-10)',
    productName: 'Kimtect Pure G3 Blue Nitre',
    customer: 'Kimbly Clerk',
    brand: 'Kleenguard',
    type: 'Nitrile',
    size: '4 Varient',
    updateDate: DateTime.local().minus({ minutes: 2 }).toRelative(),
   
  },
  {
    id: 1,
    productCode: 'NAC-300 (CR-10)',
    productName: 'Kimtect Pure G3 Blue Nitre',
    customer: 'Kimbly Clerk',
    brand: 'Kimtect Pure',
    type: 'Nitrile',
    size: '4 Varient',
    updateDate: DateTime.local(),
  },
  {
    id: 2,
    productCode: 'NAC-300 (CR-10)',
    productName: 'Kimtect Pure G3 Blue Nitre',
    customer: 'Kimbly Albert',
    brand: 'Kleenguard',
    type: 'Nitril2',
    size: '4 Varient',
    updateDate: DateTime.local().minus({ minutes: 2 }).toRelative(),
  },
  
];
