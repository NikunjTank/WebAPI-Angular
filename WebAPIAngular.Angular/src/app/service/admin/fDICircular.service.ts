import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FDICircular, GetFDICircularRequest } from '../../model/fDICircular';

@Injectable()
export class FDICircularAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFDICircular(getFDICircularRequest: GetFDICircularRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('FDICircularId', (getFDICircularRequest.FDICircularId != null) ? getFDICircularRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularRequest.SearchText);
        search.set('IsActive', (getFDICircularRequest.IsActive != null) ? getFDICircularRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularRequest.PageNumber != null) ? getFDICircularRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularRequest.PageSize != null) ? getFDICircularRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/fdicirculars", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFDICircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdicirculars/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFDICircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdicirculars/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFDICircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdicirculars/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/fdicirculars/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}