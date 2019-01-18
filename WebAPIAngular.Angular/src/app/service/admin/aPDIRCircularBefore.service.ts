import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { APDIRCircularBefore, GetAPDIRCircularBeforeRequest } from '../../model/aPDIRCircularBefore';

@Injectable()
export class APDIRCircularBeforeAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAPDIRCircularBefore(getAPDIRCircularBeforeRequest: GetAPDIRCircularBeforeRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('APDIRCircularBeforeId', (getAPDIRCircularBeforeRequest.APDIRCircularBeforeId != null) ? getAPDIRCircularBeforeRequest.APDIRCircularBeforeId.toString() : null);
        search.set('APDIRCircularParentId', (getAPDIRCircularBeforeRequest.APDIRCircularParentId != null) ? getAPDIRCircularBeforeRequest.APDIRCircularParentId.toString() : null);
        search.set('SearchText', getAPDIRCircularBeforeRequest.SearchText);
        search.set('IsActive', (getAPDIRCircularBeforeRequest.IsActive != null) ? getAPDIRCircularBeforeRequest.IsActive.toString() : null);
        search.set('PageNumber', (getAPDIRCircularBeforeRequest.PageNumber != null) ? getAPDIRCircularBeforeRequest.PageNumber.toString() : null);
        search.set('PageSize', (getAPDIRCircularBeforeRequest.PageSize != null) ? getAPDIRCircularBeforeRequest.PageSize.toString() : null);
        search.set('OrderBy', getAPDIRCircularBeforeRequest.OrderBy);
        search.set('OrderByDirection', getAPDIRCircularBeforeRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/apdircircularbefores", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addAPDIRCircularBefore(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularbefores/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateAPDIRCircularBefore(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularbefores/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteAPDIRCircularBefore(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularbefores/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}