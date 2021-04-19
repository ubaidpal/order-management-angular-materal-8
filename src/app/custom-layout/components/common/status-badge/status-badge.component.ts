import { Component, OnInit, Input } from '@angular/core';
import Utils from 'src/app/custom-layout/_utils/utils';

@Component({
  selector: 'vex-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent implements OnInit {

  @Input() status?: any;
  
  badgeStatus: any = '';
  UtilStatus = Utils.status();

  constructor() {    
  }

  ngOnInit() {
    if (this.status) {
      let status = this.status;
      this.badgeStatus = status;
    }
  }

}
