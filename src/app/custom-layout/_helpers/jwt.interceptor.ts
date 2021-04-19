import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services/authentication.service';



import { tap, finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    count = 0;
    constructor(
        private authenticationService: AuthenticationService,
         private spinner: NgxSpinnerService
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();
        this.count++;
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.access_token) {
            //console.log(currentUser.token);
            request = request.clone({
                setHeaders: { 
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${currentUser.access_token}`
                }
            });
          //  console.log(request.body);
        }

        //return next.handle(request);
        return next.handle(request).pipe(
            tap(
              (event) => {
                // console.log(event);
              },
      
              (error) => {
                // console.log(error);
              }
            ),
            finalize(() => {
              this.count--;
      
              if (this.count == 0) {
                this.spinner.hide();
                // console.log("hide spinner");
              }
            })
          );
        
    }
}