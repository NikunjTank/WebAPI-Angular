import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { AllDefinition, GetAllDefinitionRequest } from '../../model/allDefinition';

@Injectable()
export class AllDefinitionAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAllDefinition(getAllDefinitionRequest: GetAllDefinitionRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('Id', (getAllDefinitionRequest.Id != null) ? getAllDefinitionRequest.Id.toString() : null);
        search.set('ActId', (getAllDefinitionRequest.ActId != null) ? getAllDefinitionRequest.ActId.toString() : null);
        search.set('SearchText', getAllDefinitionRequest.SearchText);
        search.set('IsActive', (getAllDefinitionRequest.IsActive != null) ? getAllDefinitionRequest.IsActive.toString() : null);
        search.set('PageNumber', (getAllDefinitionRequest.PageNumber != null) ? getAllDefinitionRequest.PageNumber.toString() : null);
        search.set('PageSize', (getAllDefinitionRequest.PageSize != null) ? getAllDefinitionRequest.PageSize.toString() : null);
        search.set('OrderBy', getAllDefinitionRequest.OrderBy);
        search.set('OrderByDirection', getAllDefinitionRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/alldefinitions", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addAllDefinition(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/alldefinitions/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateAllDefinition(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/alldefinitions/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteAllDefinition(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/alldefinitions/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}