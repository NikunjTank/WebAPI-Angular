import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { Manual, GetManualRequest } from '../../model/manual';

@Injectable()
export class ManualAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getManual(getManualRequest: GetManualRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('ManualId', (getManualRequest.ManualId != null) ? getManualRequest.ManualId.toString() : null);
        search.set('SearchText', getManualRequest.SearchText);
        search.set('IsActive', (getManualRequest.IsActive != null) ? getManualRequest.IsActive.toString() : null);
        search.set('PageNumber', (getManualRequest.PageNumber != null) ? getManualRequest.PageNumber.toString() : null);
        search.set('PageSize', (getManualRequest.PageSize != null) ? getManualRequest.PageSize.toString() : null);
        search.set('OrderBy', getManualRequest.OrderBy);
        search.set('OrderByDirection', getManualRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/manuals", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addManual(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/manuals/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateManual(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/manuals/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteManual(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/manuals/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/manuals/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}