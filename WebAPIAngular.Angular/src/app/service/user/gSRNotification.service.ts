import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { GSRNotification, GetGSRNotificationRequest, GetGSRNotificationTypeRequest } from '../../model/gSRNotification';

@Injectable()
export class GSRNotificationUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getGSRNotification(getGSRNotificationRequest: GetGSRNotificationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('GSRNotificationId', (getGSRNotificationRequest.GSRNotificationId != null) ? getGSRNotificationRequest.GSRNotificationId.toString() : null);
        search.set('RulesId', (getGSRNotificationRequest.RulesId != null) ? getGSRNotificationRequest.RulesId.toString() : null);
        search.set('SearchText', getGSRNotificationRequest.SearchText);
        search.set('IsActive', (getGSRNotificationRequest.IsActive != null) ? getGSRNotificationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getGSRNotificationRequest.PageNumber != null) ? getGSRNotificationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getGSRNotificationRequest.PageSize != null) ? getGSRNotificationRequest.PageSize.toString() : null);
        search.set('OrderBy', getGSRNotificationRequest.OrderBy);
        search.set('OrderByDirection', getGSRNotificationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/gsrnotifications", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}