import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { SectorDetail, GetSectorDetailRequest } from '../../model/sectorDetail';

@Injectable()
export class SectorDetailAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSectorDetail(getSectorDetailRequest: GetSectorDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('SectorDetailId', (getSectorDetailRequest.SectorDetailId != null) ? getSectorDetailRequest.SectorDetailId.toString() : null);
        search.set('SectorId', (getSectorDetailRequest.SectorId != null) ? getSectorDetailRequest.SectorId.toString() : null);
        search.set('SubSectorId', (getSectorDetailRequest.SubSectorId != null) ? getSectorDetailRequest.SubSectorId.toString() : null);
        search.set('SearchText', getSectorDetailRequest.SearchText);
        search.set('IsActive', (getSectorDetailRequest.IsActive != null) ? getSectorDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSectorDetailRequest.PageNumber != null) ? getSectorDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSectorDetailRequest.PageSize != null) ? getSectorDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getSectorDetailRequest.OrderBy);
        search.set('OrderByDirection', getSectorDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/sectordetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addSectorDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/sectordetails/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateSectorDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/sectordetails/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteSectorDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/sectordetails/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getSectorDetailYear(): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });
        
        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.get(Global.API_SITE + "admin/api/sectordetailyears", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}