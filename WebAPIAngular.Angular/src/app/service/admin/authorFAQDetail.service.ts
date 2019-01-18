import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { AuthorFAQDetail, GetAuthorFAQDetailRequest, GetSubTopicRequest, SubTopic } from '../../model/authorFAQDetail';

@Injectable()
export class AuthorFAQDetailAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAuthorFAQDetail(getAuthorFAQDetailRequest: GetAuthorFAQDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('AuthorFAQDetailId', (getAuthorFAQDetailRequest.AuthorFAQDetailId != null) ? getAuthorFAQDetailRequest.AuthorFAQDetailId.toString() : null);
        search.set('AuthorFAQId', (getAuthorFAQDetailRequest.AuthorFAQId != null) ? getAuthorFAQDetailRequest.AuthorFAQId.toString() : null);
        search.set('SearchText', getAuthorFAQDetailRequest.SearchText);
        search.set('IsActive', (getAuthorFAQDetailRequest.IsActive != null) ? getAuthorFAQDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getAuthorFAQDetailRequest.PageNumber != null) ? getAuthorFAQDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getAuthorFAQDetailRequest.PageSize != null) ? getAuthorFAQDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getAuthorFAQDetailRequest.OrderBy);
        search.set('OrderByDirection', getAuthorFAQDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/authorfaqdetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addAuthorFAQDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorfaqdetails/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateAuthorFAQDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorfaqdetails/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteAuthorFAQDetail(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorfaqdetails/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
    
    getSubTopic(getSubTopicRequest: GetSubTopicRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('SubTopicId', (getSubTopicRequest.SubTopicId != null) ? getSubTopicRequest.SubTopicId.toString() : null);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/subTopics", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}