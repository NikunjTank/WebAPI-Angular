import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FetersCodeGroupDetail, GetFetersCodeGroupDetailRequest } from '../../model/fetersCodeGroupDetail';

@Injectable()
export class FetersCodeGroupDetailAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFetersCodeGroupDetail(getFetersCodeGroupDetailRequest: GetFetersCodeGroupDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('FetersCodeGroupDetailId', (getFetersCodeGroupDetailRequest.FetersCodeGroupDetailId != null) ? getFetersCodeGroupDetailRequest.FetersCodeGroupDetailId.toString() : null);
        search.set('FetersCodeDetailId', (getFetersCodeGroupDetailRequest.FetersCodeDetailId != null) ? getFetersCodeGroupDetailRequest.FetersCodeDetailId.toString() : null);
        search.set('SearchText', getFetersCodeGroupDetailRequest.SearchText);
        search.set('IsActive', (getFetersCodeGroupDetailRequest.IsActive != null) ? getFetersCodeGroupDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFetersCodeGroupDetailRequest.PageNumber != null) ? getFetersCodeGroupDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFetersCodeGroupDetailRequest.PageSize != null) ? getFetersCodeGroupDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getFetersCodeGroupDetailRequest.OrderBy);
        search.set('OrderByDirection', getFetersCodeGroupDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/feterscodegroupdetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFetersCodeGroupDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/feterscodegroupdetails/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFetersCodeGroupDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/feterscodegroupdetails/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFetersCodeGroupDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/feterscodegroupdetails/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}