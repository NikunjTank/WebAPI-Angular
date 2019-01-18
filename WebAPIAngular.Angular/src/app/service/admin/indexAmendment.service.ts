import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { IndexAmendment, GetIndexAmendmentRequest } from '../../model/indexAmendment';

@Injectable()
export class IndexAmendmentAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getIndexAmendment(getIndexAmendmentRequest: GetIndexAmendmentRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('IndexAmendmentId', (getIndexAmendmentRequest.IndexAmendmentId != null) ? getIndexAmendmentRequest.IndexAmendmentId.toString() : null);
        search.set('RegulationId', (getIndexAmendmentRequest.RegulationId != null) ? getIndexAmendmentRequest.RegulationId.toString() : null);
        search.set('NotificationId', (getIndexAmendmentRequest.NotificationId != null) ? getIndexAmendmentRequest.NotificationId.toString() : null);
        search.set('SearchText', getIndexAmendmentRequest.SearchText);
        search.set('IsActive', (getIndexAmendmentRequest.IsActive != null) ? getIndexAmendmentRequest.IsActive.toString() : null);
        search.set('PageNumber', (getIndexAmendmentRequest.PageNumber != null) ? getIndexAmendmentRequest.PageNumber.toString() : null);
        search.set('PageSize', (getIndexAmendmentRequest.PageSize != null) ? getIndexAmendmentRequest.PageSize.toString() : null);
        search.set('OrderBy', getIndexAmendmentRequest.OrderBy);
        search.set('OrderByDirection', getIndexAmendmentRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/indexamendments", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addIndexAmendment(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/indexamendments/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateIndexAmendment(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/indexamendments/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteIndexAmendment(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/indexamendments/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}