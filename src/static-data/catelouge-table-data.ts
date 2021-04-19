import Color from 'color';
import theme from '../@vex/utils/tailwindcss';

export const aioTableLabels = [
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

export const CatelougeTableData = [
  {
    id: 0,
    name: 'Kimbech Pure G3 Blue Niterilla',
    pCode: 'NACS 300B (CR-10)',
    customer: 'Kibely Clark',
    bname:'Kimtech Pune',
    type: 'Niterile',
    sizes: '5 Variants',
    updatedOn: 'Jan 07 2020'
    
  },
  {
    id: 1,
    name: 'Kimbech Pure G3 Blue Niterilla',
    pCode: 'NACS 256B (CR-100)',
    customer: 'Kibely Clark',
    bname:'Kimtech Pune',
    type: 'Niterile',
    sizes: '4 Variants',
    updatedOn: 'Feb 28 2020'
  },
  
];
