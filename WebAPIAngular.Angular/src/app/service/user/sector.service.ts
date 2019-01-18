import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { Sector, GetSectorRequest } from '../../model/sector';
import { SubSector, GetSubSectorRequest } from '../../model/subSector';
import { SectorDetail, GetSectorDetailRequest } from '../../model/sectorDetail';

@Injectable()
export class SectorUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSector(getSectorRequest: GetSectorRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('SectorId', (getSectorRequest.SectorId != null) ? getSectorRequest.SectorId.toString() : null);
        search.set('SearchText', getSectorRequest.SearchText);
        search.set('IsActive', (getSectorRequest.IsActive != null) ? getSectorRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSectorRequest.PageNumber != null) ? getSectorRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSectorRequest.PageSize != null) ? getSectorRequest.PageSize.toString() : null);
        search.set('OrderBy', getSectorRequest.OrderBy);
        search.set('OrderByDirection', getSectorRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/sectors", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getSectorDetail(getSectorDetailRequest: GetSectorDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

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

        return this._http.get(Global.API_SITE + "user/api/sectordetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getSubSector(getSubSectorRequest: GetSubSectorRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

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

        return this._http.get(Global.API_SITE + "user/api/subsectors", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}