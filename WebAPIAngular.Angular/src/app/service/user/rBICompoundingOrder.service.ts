import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { RBICompoundingOrder, GetRBICompoundingOrderRequest } from '../../model/rBICompoundingOrder';

@Injectable()
export class RBICompoundingOrderUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRBICompoundingOrder(getRBICompoundingOrderRequest: GetRBICompoundingOrderRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('RBICompoundingOrderId', (getRBICompoundingOrderRequest.RBICompoundingOrderId != null) ? getRBICompoundingOrderRequest.RBICompoundingOrderId.toString() : null);
        search.set('SearchText', getRBICompoundingOrderRequest.SearchText);
        search.set('IsActive', (getRBICompoundingOrderRequest.IsActive != null) ? getRBICompoundingOrderRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRBICompoundingOrderRequest.PageNumber != null) ? getRBICompoundingOrderRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRBICompoundingOrderRequest.PageSize != null) ? getRBICompoundingOrderRequest.PageSize.toString() : null);
        search.set('OrderBy', getRBICompoundingOrderRequest.OrderBy);
        search.set('OrderByDirection', getRBICompoundingOrderRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rbicompoundingorders", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}