import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { MasterCircular, GetMasterCircularRequest } from '../../model/masterCircular';

@Injectable()
export class MasterCircularAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getMasterCircular(getMasterCircularRequest: GetMasterCircularRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('MasterCircularId', (getMasterCircularRequest.MasterCircularId != null) ? getMasterCircularRequest.MasterCircularId.toString() : null);
        search.set('SearchText', getMasterCircularRequest.SearchText);
        search.set('IsActive', (getMasterCircularRequest.IsActive != null) ? getMasterCircularRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterCircularRequest.PageNumber != null) ? getMasterCircularRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterCircularRequest.PageSize != null) ? getMasterCircularRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterCircularRequest.OrderBy);
        search.set('OrderByDirection', getMasterCircularRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/mastercirculars", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addMasterCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculars/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateMasterCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculars/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteMasterCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculars/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}