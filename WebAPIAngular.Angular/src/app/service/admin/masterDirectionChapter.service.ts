import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../model/masterDirectionChapter';

@Injectable()
export class MasterDirectionChapterAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getMasterDirectionChapter(getMasterDirectionChapterRequest: GetMasterDirectionChapterRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionChapterId', (getMasterDirectionChapterRequest.MasterDirectionChapterId != null) ? getMasterDirectionChapterRequest.MasterDirectionChapterId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionChapterRequest.MasterDirectionId != null) ? getMasterDirectionChapterRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionChapterRequest.SearchText);
        search.set('IsActive', (getMasterDirectionChapterRequest.IsActive != null) ? getMasterDirectionChapterRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionChapterRequest.PageNumber != null) ? getMasterDirectionChapterRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionChapterRequest.PageSize != null) ? getMasterDirectionChapterRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionChapterRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionChapterRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/masterdirectionchapters", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addMasterDirectionChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/masterdirectionchapters/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateMasterDirectionChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/masterdirectionchapters/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteMasterDirectionChapter(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/masterdirectionchapters/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}