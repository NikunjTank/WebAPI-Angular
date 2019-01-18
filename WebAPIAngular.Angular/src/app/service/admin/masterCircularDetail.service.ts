import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { MasterCircularDetail, GetMasterCircularDetailRequest } from '../../model/masterCircularDetail';

@Injectable()
export class MasterCircularDetailAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getMasterCircularDetail(getMasterCircularDetailRequest: GetMasterCircularDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('MasterCircularDetailId', (getMasterCircularDetailRequest.MasterCircularDetailId != null) ? getMasterCircularDetailRequest.MasterCircularDetailId.toString() : null);
        search.set('MasterCircularId', (getMasterCircularDetailRequest.MasterCircularId != null) ? getMasterCircularDetailRequest.MasterCircularId.toString() : null);
        search.set('SearchText', getMasterCircularDetailRequest.SearchText);
        search.set('IsActive', (getMasterCircularDetailRequest.IsActive != null) ? getMasterCircularDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterCircularDetailRequest.PageNumber != null) ? getMasterCircularDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterCircularDetailRequest.PageSize != null) ? getMasterCircularDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterCircularDetailRequest.OrderBy);
        search.set('OrderByDirection', getMasterCircularDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/mastercirculardetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addMasterCircularDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculardetails/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateMasterCircularDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculardetails/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteMasterCircularDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/mastercirculardetails/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getMasterCircularDetailYear(): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });
        
        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.get(Global.API_SITE + "admin/api/mastercirculardetailyears", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/mastercirculardetails/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}