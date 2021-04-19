import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';
import { usersData } from '../../../../../static-data/users';
import { Icon } from '@visurel/iconify-angular';
import { User } from '../interfaces/user.interface';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';
import icHistory from '@iconify/icons-ic/twotone-history';
import icPeople from '@iconify/icons-ic/people-outline';
import icBlock from '@iconify/icons-ic/block';
import icStar from '@iconify/icons-ic/twotone-star';
import icLabel from '@iconify/icons-ic/twotone-label';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from '../../../../../@vex/animations/stagger.animation';


export interface UsersTableMenu {
  type: 'link' | 'subheading' ; 
  id?: 'frequently' | 'starred' | 'all' | 'family' | 'friends' | 'colleagues' | 'business' | 'activeUser' | 'blockeUser';
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}

@Component({
  selector: 'vex-users-table-menu',
  templateUrl: './users-table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class UsersTableMenuComponent implements OnInit {

  getActiveUsers = 0;
  getBlockedUser = 0;
  @Input() items: UsersTableMenu[] = [
    {
      type: 'link',
      id: 'all',
      icon: icViewHeadline,
      label: 'All Users'
    },
     {
      type: 'link',
      id: 'activeUser',
      icon: icPeople,
      label: 'Active User'
    },
    {
      type: 'link',
      id: 'blockeUser',
      icon: icBlock,
      label: 'Blocked User'
    },
    // {
    //   type: 'link',
    //   id: 'frequently',
    //   icon: icHistory,
    //   label: 'Frequently contacted'
    // },
    // {
    //   type: 'link',
    //   id: 'starred',
    //   icon: icStar,
    //   label: 'Starred'
    // },
    // {
    //   type: 'subheading',
    //   label: 'Labels'
    // },
    // {
    //   type: 'link',
    //   id: 'family',
    //   icon: icLabel,
    //   label: 'Family',
    //   classes: {
    //     icon: 'text-primary-500'
    //   }
    // },
    // {
    //   type: 'link',
    //   id: 'friends',
    //   icon: icLabel,
    //   label: 'Friends',
    //   classes: {
    //     icon: 'text-green-500'
    //   }
    // },
    // {
    //   type: 'link',
    //   id: 'colleagues',
    //   icon: icLabel,
    //   label: 'Colleagues',
    //   classes: {
    //     icon: 'text-amber-500'
    //   }
    // },
    // {
    //   type: 'link',
    //   id: 'business',
    //   icon: icLabel,
    //   label: 'Business',
    //   classes: {
    //     icon: 'text-gray-500'
    //   }
    // },
  ];

  @Output() filterChange = new EventEmitter<User[]>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: UsersTableMenu['id'] = 'all';
  icPersonAdd = icPersonAdd;

  constructor() { }

  ngOnInit() {
   this.isActiveUserApiCall();
   this.isBlockedUserApiCall();
  }

  setFilter(category: UsersTableMenu['id']) {
    this.activeCategory = category;

    
    if (category === 'all') {
    
       // api get all user
      return this.filterChange.emit(usersData);
    }
    if (category === 'activeUser') {
      this.isActiveUserApiCall();
      // api get all active user
      return this.filterChange.emit([]);
    }

    if (category === 'blockeUser') {
      this.isBlockedUserApiCall();
      // api get all active user
      return this.filterChange.emit(usersData);
    }

  
    // if (category === 'frequently'
    //   || category === 'family'
    //   || category === 'friends'
    //   || category === 'colleagues'
    //   || category === 'business') {
    //   return this.filterChange.emit([]);
    // }
  }

  isActive(category: UsersTableMenu['id']) {
    return this.activeCategory === category;
  }
  isActiveUserApiCall(){
    // Api Call
  return  this.getActiveUsers =  10;
    
  }
  isBlockedUserApiCall(){
  
    // Api Call
  return  this.getBlockedUser =  26;
    
  }
}
