import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FIPBPressReleaseCase, GetFIPBPressReleaseCaseRequest } from '../../model/fIPBPressReleaseCase';

@Injectable()
export class FIPBPressReleaseCaseAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFIPBPressReleaseCase(getFIPBPressReleaseCaseRequest: GetFIPBPressReleaseCaseRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('FIPBPressReleaseCaseId', (getFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId != null) ? getFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId.toString() : null);
        search.set('SearchText', getFIPBPressReleaseCaseRequest.SearchText);
        search.set('IsActive', (getFIPBPressReleaseCaseRequest.IsActive != null) ? getFIPBPressReleaseCaseRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFIPBPressReleaseCaseRequest.PageNumber != null) ? getFIPBPressReleaseCaseRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFIPBPressReleaseCaseRequest.PageSize != null) ? getFIPBPressReleaseCaseRequest.PageSize.toString() : null);
        search.set('OrderBy', getFIPBPressReleaseCaseRequest.OrderBy);
        search.set('OrderByDirection', getFIPBPressReleaseCaseRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/fipbpressreleasecases", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFIPBPressReleaseCase(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fipbpressreleasecases/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFIPBPressReleaseCase(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fipbpressreleasecases/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFIPBPressReleaseCase(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fipbpressreleasecases/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/fipbpressreleasecases/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}