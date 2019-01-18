import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";

import { Global } from '../../common/global';



@Injectable()
export class AccountService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    userRegister(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/userregister", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    verifyAccountForMobile(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/verifyaccountformobile", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    sendOTPForLogin(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/sendotpforlogin", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    loginWithMobile(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/loginwithmobile", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    loginWithUserName(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/loginwithusername", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    logout(): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/logout", {}, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    logoutUser(): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getUserToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/logout", {}, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}