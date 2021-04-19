import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icMail from '@iconify/icons-ic/twotone-mail';
import icChat from '@iconify/icons-ic/twotone-chat';
import icStar from '@iconify/icons-ic/twotone-star';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icAddress from '@iconify/icons-ic/twotone-add-location';
import icPlus from '@iconify/icons-ic/add';
import { iconsFA } from "src/static-data/icons-fa";
import { CustomerService } from 'src/app/custom-layout/_services/customer.service';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/custom-layout/_services/common.service';
@Component({
  selector: 'vex-contacts-card',
  templateUrl: './branches-card.component.html',
  styleUrls: ['./branches-card.component.scss']
})
export class BranchesCardComponent implements OnInit {

  //@Input() props: { countries: any;  contact: Contact = new Contact(); };

 @Input() contact: Contact = new Contact();
 @Input() countries: any;
  @Output() openContact = new EventEmitter<Contact['id']>();
  @Output() toggleStar = new EventEmitter<Contact['id']>();

  icBusiness = icBusiness;
  icPhone = icPhone;
  icMail = icMail;
  icChat = icChat;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icAddress = icAddress;
  icPlus = icPlus;
  iconsPlus = iconsFA.plus;
  mapMarkerAlt = iconsFA["map-marker-alt"];

  countryName:any;
  constructor(   private commonService: CommonService) { }

  ngOnInit() {
   
    //console.log('contact >>', this.countries)
  }
 
  getCountryName(id?:number){
    if(this.countries){
  
      this.countryName = this.countries.find(elm => elm.id == id );
     
      if(this.countryName ){
        return  this.countryName.name;
      }else{
        return '';
      }
     
    }
 
  }
  emitToggleStar(event: MouseEvent, contactId: Contact['id']) {
    event.stopPropagation();
    this.toggleStar.emit(contactId);
  }
}
