import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { DIPPClarification, GetDIPPClarificationRequest } from '../../model/dIPPClarification';

@Injectable()
export class DIPPClarificationUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getDIPPClarification(getDIPPClarificationRequest: GetDIPPClarificationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('DIPPClarificationId', (getDIPPClarificationRequest.DIPPClarificationId != null) ? getDIPPClarificationRequest.DIPPClarificationId.toString() : null);
        search.set('SearchText', getDIPPClarificationRequest.SearchText);
        search.set('IsActive', (getDIPPClarificationRequest.IsActive != null) ? getDIPPClarificationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getDIPPClarificationRequest.PageNumber != null) ? getDIPPClarificationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getDIPPClarificationRequest.PageSize != null) ? getDIPPClarificationRequest.PageSize.toString() : null);
        search.set('OrderBy', getDIPPClarificationRequest.OrderBy);
        search.set('OrderByDirection', getDIPPClarificationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/dippclarifications", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}