import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { APDIRCircularAfter, GetAPDIRCircularAfterRequest } from '../../model/aPDIRCircularAfter';

@Injectable()
export class APDIRCircularAfterAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAPDIRCircularAfter(getAPDIRCircularAfterRequest: GetAPDIRCircularAfterRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('APDIRCircularAfterId', (getAPDIRCircularAfterRequest.APDIRCircularAfterId != null) ? getAPDIRCircularAfterRequest.APDIRCircularAfterId.toString() : null);
        search.set('APDIRCircularParentId', (getAPDIRCircularAfterRequest.APDIRCircularParentId != null) ? getAPDIRCircularAfterRequest.APDIRCircularParentId.toString() : null);
        search.set('SearchText', getAPDIRCircularAfterRequest.SearchText);
        search.set('IsActive', (getAPDIRCircularAfterRequest.IsActive != null) ? getAPDIRCircularAfterRequest.IsActive.toString() : null);
        search.set('PageNumber', (getAPDIRCircularAfterRequest.PageNumber != null) ? getAPDIRCircularAfterRequest.PageNumber.toString() : null);
        search.set('PageSize', (getAPDIRCircularAfterRequest.PageSize != null) ? getAPDIRCircularAfterRequest.PageSize.toString() : null);
        search.set('OrderBy', getAPDIRCircularAfterRequest.OrderBy);
        search.set('OrderByDirection', getAPDIRCircularAfterRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/apdircircularafters", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addAPDIRCircularAfter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularafters/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateAPDIRCircularAfter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularafters/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteAPDIRCircularAfter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/apdircircularafters/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}