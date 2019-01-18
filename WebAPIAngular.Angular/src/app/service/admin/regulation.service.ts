import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { Regulation, GetRegulationRequest } from '../../model/regulation';

@Injectable()
export class RegulationAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRegulation(getRegulationRequest: GetRegulationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('RegulationId', (getRegulationRequest.RegulationId != null) ? getRegulationRequest.RegulationId.toString() : null);
        search.set('SearchText', getRegulationRequest.SearchText);
        search.set('IsActive', (getRegulationRequest.IsActive != null) ? getRegulationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRegulationRequest.PageNumber != null) ? getRegulationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRegulationRequest.PageSize != null) ? getRegulationRequest.PageSize.toString() : null);
        search.set('OrderBy', getRegulationRequest.OrderBy);
        search.set('OrderByDirection', getRegulationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/regulations", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addRegulation(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/regulations/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateRegulation(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/regulations/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteRegulation(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/regulations/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}