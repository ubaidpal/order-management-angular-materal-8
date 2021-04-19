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

export const aioTableData = [
  {
    id: 0,
    name: 'Daniel',
    primary: true,
    role: 'Marketing',
    bname:'Romeovilla, USA',
    phoneNumber: '+32 (818) 580-3557',
    email: 'dejesus.chang@yourcompany.biz'
    
  },
  {
    id: 1,
    name: 'Bakhtawar',
    primary: true,
    role: 'Accounting',
    bname:'Romeovilla, USA',
    phoneNumber: '+32 (818) 580-3557',
    email: 'dejesus.chang@yourcompany.biz'
  },
  
];
