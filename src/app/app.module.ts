import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID ,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule ,HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

import { LoginModule } from './custom-layout/components/login/login.module';

import { ReactiveFormsModule } from '@angular/forms';


import { JwtInterceptor } from './custom-layout/_helpers/jwt.interceptor';
import {  ErrorInterceptor } from './custom-layout/_helpers/error.interceptor';
import { SharedModule } from './shared/shared.module';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Vex
    VexModule,
    LoginModule,
    CustomLayoutModule,
    SharedModule,
    MatMomentDateModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
