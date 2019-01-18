import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FDIChapter, GetFDIChapterRequest } from '../../model/fDIChapter';

@Injectable()
export class FDIChapterAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFDIChapter(getFDIChapterRequest: GetFDIChapterRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('FDIChapterId', (getFDIChapterRequest.FDIChapterId != null) ? getFDIChapterRequest.FDIChapterId.toString() : null);
        search.set('FDICircularId', (getFDIChapterRequest.FDICircularId != null) ? getFDIChapterRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDIChapterRequest.SearchText);
        search.set('IsActive', (getFDIChapterRequest.IsActive != null) ? getFDIChapterRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDIChapterRequest.PageNumber != null) ? getFDIChapterRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDIChapterRequest.PageSize != null) ? getFDIChapterRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDIChapterRequest.OrderBy);
        search.set('OrderByDirection', getFDIChapterRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/fdichapters", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFDIChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdichapters/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFDIChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdichapters/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFDIChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/fdichapters/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}