
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    loginTest(email, password) {

        let appUrl = config.apiUrl + "/connect/login.php";// login Url
        let client_id = 'auth_spa',
            grant_type = 'password',
            obj = { email, password, client_id, grant_type };

        var param = JSON.stringify(obj);
        return this.http.post<any>(appUrl, param)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                //  console.log(user);
                return user;
            }));
    }

    login(email, password) {
        //  let appUrl = config.apiUrl+"/connect/login.php";// login Url
        let appUrl = config.apiUrl + "/connect/token";// login Url
        let username = email,
            client_id = 'auth_spa',
            grant_type = 'password',
            scope = "openid email phone profile offline_access roles auth_ap";
   
        const nbody = new URLSearchParams();
        nbody.set("username", username);
        nbody.set("password", password);
        nbody.set("client_id", client_id);
        nbody.set("grant_type", grant_type);
       // nbody.set("scope", scope);
        const body = nbody.toString();
      
            const reqHeaders = new HttpHeaders({

                'Accept' : 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                 'No-Auth' : 'True'
            });
        return this.http.post<any>(appUrl,body , { headers: reqHeaders })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
               // console.log(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}