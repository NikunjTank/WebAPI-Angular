import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { ContactUs, GetContactUsRequest } from '../../model/contactUs';

@Injectable()
export class ContactUsService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getContactUs(getContactUsRequest: GetContactUsRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('ContactUsId', (getContactUsRequest.ContactUsId != null) ? getContactUsRequest.ContactUsId.toString() : null);
        search.set('SearchText', getContactUsRequest.SearchText);
        search.set('IsActive', (getContactUsRequest.IsActive != null) ? getContactUsRequest.IsActive.toString() : null);
        search.set('PageNumber', (getContactUsRequest.PageNumber != null) ? getContactUsRequest.PageNumber.toString() : null);
        search.set('PageSize', (getContactUsRequest.PageSize != null) ? getContactUsRequest.PageSize.toString() : null);
        search.set('OrderBy', getContactUsRequest.OrderBy);
        search.set('OrderByDirection', getContactUsRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "api/contactuss", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addContactUs(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/contactuss/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
    
    deleteContactUs(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "api/contactuss/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}