import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { GetSubscriptionRequest } from '../../model/subscription';

@Injectable()
export class SubscriptionAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSubscription(getSubscriptionRequest: GetSubscriptionRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('UserId', (getSubscriptionRequest.UserId != null) ? getSubscriptionRequest.UserId.toString() : null);
        search.set('SubscriptionId', (getSubscriptionRequest.SubscriptionId != null) ? getSubscriptionRequest.SubscriptionId.toString() : null);
        search.set('SearchText', getSubscriptionRequest.SearchText);
        search.set('IsActive', (getSubscriptionRequest.IsActive != null) ? getSubscriptionRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSubscriptionRequest.PageNumber != null) ? getSubscriptionRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSubscriptionRequest.PageSize != null) ? getSubscriptionRequest.PageSize.toString() : null);
        search.set('OrderBy', getSubscriptionRequest.OrderBy);
        search.set('OrderByDirection', getSubscriptionRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/subscriptions", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateSubscription(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/subscriptions/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}