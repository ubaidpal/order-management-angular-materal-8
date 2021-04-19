import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from './alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' ,styleUrls: ['./alert.scss'], })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
                switch (message && message.type) {
                    case 'success':
                        message.cssClass = 'bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md';
                        break;
                    case 'error':
                        message.cssClass = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';
                        break;
                    case 'warning':  
                        message.cssClass = 'bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4';
                        break;
                    case 'confirm':  
                      console.log(message);
                    
                        message.cssClass = 'bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4';
                        break;    
                    default:    
                      
                    break;
                }

                this.message = message;
            });
    }
   
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    closeAlertMessage() {
        this.alertService.clear();
        //this.subscription.unsubscribe();
   }
}