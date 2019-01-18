import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { RBILiaisonOffice, GetRBILiaisonOfficeRequest } from '../../model/rBILiaisonOffice';

@Injectable()
export class RBILiaisonOfficeAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRBILiaisonOffice(getRBILiaisonOfficeRequest: GetRBILiaisonOfficeRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('RBILiaisonOfficeId', (getRBILiaisonOfficeRequest.RBILiaisonOfficeId != null) ? getRBILiaisonOfficeRequest.RBILiaisonOfficeId.toString() : null);
        search.set('SearchText', getRBILiaisonOfficeRequest.SearchText);
        search.set('IsActive', (getRBILiaisonOfficeRequest.IsActive != null) ? getRBILiaisonOfficeRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRBILiaisonOfficeRequest.PageNumber != null) ? getRBILiaisonOfficeRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRBILiaisonOfficeRequest.PageSize != null) ? getRBILiaisonOfficeRequest.PageSize.toString() : null);
        search.set('OrderBy', getRBILiaisonOfficeRequest.OrderBy);
        search.set('OrderByDirection', getRBILiaisonOfficeRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/rbiliaisonoffices", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
    
    addRBILiaisonOfficeFromExcel(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/rbiliaisonoffices/addfromexcel", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}