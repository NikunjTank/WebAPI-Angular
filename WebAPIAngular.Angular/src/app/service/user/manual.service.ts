import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { Manual, GetManualRequest } from '../../model/manual';

@Injectable()
export class ManualUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getManual(getManualRequest: GetManualRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

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

        return this._http.get(Global.API_SITE + "user/api/manuals", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}