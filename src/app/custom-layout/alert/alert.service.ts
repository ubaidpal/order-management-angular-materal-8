import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }
     
    confirm(message: string,siFn:()=>void,noFn:()=>void){
        this.setConfirmation(message,siFn,noFn);
      }
      setConfirmation(message: string,siFn:()=>void,noFn:()=>void) {
        let that = this;
        this.subject.next({ type: "confirm",
                    text: message,
                    siFn:
                    function(){
                        that.subject.next(); //this will close the modal
                        siFn();
                    },
                    noFn:function(){
                        that.subject.next();
                        noFn();
                    }
                 });

             }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'success', text: message , });
    }

    error(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'error', text: message });
    }
    warning(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'warning', text: message });
    }
   

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }
}