import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FemaIndex, GetFemaIndexRequest } from '../../model/femaIndex';

@Injectable()
export class FemaIndexAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFemaIndex(getFemaIndexRequest: GetFemaIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('IndexId', (getFemaIndexRequest.IndexId != null) ? getFemaIndexRequest.IndexId.toString() : null);
        search.set('RegulationId', (getFemaIndexRequest.RegulationId != null) ? getFemaIndexRequest.RegulationId.toString() : null);
        search.set('SearchText', getFemaIndexRequest.SearchText);
        search.set('IsActive', (getFemaIndexRequest.IsActive != null) ? getFemaIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFemaIndexRequest.PageNumber != null) ? getFemaIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFemaIndexRequest.PageSize != null) ? getFemaIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getFemaIndexRequest.OrderBy);
        search.set('OrderByDirection', getFemaIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/femaindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFemaIndex(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/femaindexes/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFemaIndex(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/femaindexes/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFemaIndex(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/femaindexes/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}