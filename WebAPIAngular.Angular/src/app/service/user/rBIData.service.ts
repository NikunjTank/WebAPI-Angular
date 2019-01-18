import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { RBIData, GetRBIDataRequest } from '../../model/rBIData';
import { RBIDataDetail, GetRBIDataDetailRequest } from '../../model/rBIDataDetail';

@Injectable()
export class RBIDataUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRBIData(getRBIDataRequest: GetRBIDataRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('RBIDataId', (getRBIDataRequest.RBIDataId != null) ? getRBIDataRequest.RBIDataId.toString() : null);
        search.set('SearchText', getRBIDataRequest.SearchText);
        search.set('IsActive', (getRBIDataRequest.IsActive != null) ? getRBIDataRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRBIDataRequest.PageNumber != null) ? getRBIDataRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRBIDataRequest.PageSize != null) ? getRBIDataRequest.PageSize.toString() : null);
        search.set('OrderBy', getRBIDataRequest.OrderBy);
        search.set('OrderByDirection', getRBIDataRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rbidatas", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getRBIDataDetail(getRBIDataDetailRequest: GetRBIDataDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('RBIDataDetailId', (getRBIDataDetailRequest.RBIDataDetailId != null) ? getRBIDataDetailRequest.RBIDataDetailId.toString() : null);
        search.set('RBIDataId', (getRBIDataDetailRequest.RBIDataId != null) ? getRBIDataDetailRequest.RBIDataId.toString() : null);
        search.set('Year', (getRBIDataDetailRequest.Year != null) ? getRBIDataDetailRequest.Year.toString() : null);
        search.set('Month', (getRBIDataDetailRequest.Month != null) ? getRBIDataDetailRequest.Month.toString() : null);
        search.set('SearchText', getRBIDataDetailRequest.SearchText);
        search.set('IsActive', (getRBIDataDetailRequest.IsActive != null) ? getRBIDataDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRBIDataDetailRequest.PageNumber != null) ? getRBIDataDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRBIDataDetailRequest.PageSize != null) ? getRBIDataDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getRBIDataDetailRequest.OrderBy);
        search.set('OrderByDirection', getRBIDataDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rbidatadetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getRBIDataDetailYears(): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.get(Global.API_SITE + "user/api/rbidatadetailyears", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}