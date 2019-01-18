import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FetersCode, GetFetersCodeRequest } from '../../model/fetersCode';
import { FetersCodeDetail, GetFetersCodeDetailRequest } from '../../model/fetersCodeDetail';
import { FetersCodeGroupDetail, GetFetersCodeGroupDetailRequest } from '../../model/fetersCodeGroupDetail';

@Injectable()
export class FetersCodeUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFetersCode(getFetersCodeRequest: GetFetersCodeRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FetersCodeId', (getFetersCodeRequest.FetersCodeId != null) ? getFetersCodeRequest.FetersCodeId.toString() : null);
        search.set('SearchText', getFetersCodeRequest.SearchText);
        search.set('IsActive', (getFetersCodeRequest.IsActive != null) ? getFetersCodeRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFetersCodeRequest.PageNumber != null) ? getFetersCodeRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFetersCodeRequest.PageSize != null) ? getFetersCodeRequest.PageSize.toString() : null);
        search.set('OrderBy', getFetersCodeRequest.OrderBy);
        search.set('OrderByDirection', getFetersCodeRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fetersCodes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFetersCodeDetail(getFetersCodeDetailRequest: GetFetersCodeDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FetersCodeDetailId', (getFetersCodeDetailRequest.FetersCodeDetailId != null) ? getFetersCodeDetailRequest.FetersCodeDetailId.toString() : null);
        search.set('FetersCodeId', (getFetersCodeDetailRequest.FetersCodeId != null) ? getFetersCodeDetailRequest.FetersCodeId.toString() : null);
        search.set('SearchText', getFetersCodeDetailRequest.SearchText);
        search.set('IsActive', (getFetersCodeDetailRequest.IsActive != null) ? getFetersCodeDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFetersCodeDetailRequest.PageNumber != null) ? getFetersCodeDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFetersCodeDetailRequest.PageSize != null) ? getFetersCodeDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getFetersCodeDetailRequest.OrderBy);
        search.set('OrderByDirection', getFetersCodeDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/feterscodedetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFetersCodeGroupDetail(getFetersCodeGroupDetailRequest: GetFetersCodeGroupDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

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

        return this._http.get(Global.API_SITE + "user/api/feterscodegroupdetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}