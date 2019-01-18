import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { SubSector, GetSubSectorRequest } from '../../model/subSector';

@Injectable()
export class SubSectorAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSubSector(getSubSectorRequest: GetSubSectorRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('SubSectorId', (getSubSectorRequest.SubSectorId != null) ? getSubSectorRequest.SubSectorId.toString() : null);
        search.set('SectorId', (getSubSectorRequest.SectorId != null) ? getSubSectorRequest.SectorId.toString() : null);
        search.set('SearchText', getSubSectorRequest.SearchText);
        search.set('IsActive', (getSubSectorRequest.IsActive != null) ? getSubSectorRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSubSectorRequest.PageNumber != null) ? getSubSectorRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSubSectorRequest.PageSize != null) ? getSubSectorRequest.PageSize.toString() : null);
        search.set('OrderBy', getSubSectorRequest.OrderBy);
        search.set('OrderByDirection', getSubSectorRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/subsectors", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addSubSector(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/subsectors/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateSubSector(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/subsectors/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteSubSector(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/subsectors/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getSubSectorYear(): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.get(Global.API_SITE + "admin/api/subsectoryears", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}