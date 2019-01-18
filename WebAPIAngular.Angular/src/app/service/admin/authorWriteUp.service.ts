import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

//import { AuthorWriteUp, GetAuthorWriteUpRequest, GetTopicRequest, Topic } from '../../model/authorWriteUp';
import { AuthorWriteUp, GetAuthorWriteUpRequest } from '../../model/authorWriteUp';

@Injectable()
export class AuthorWriteUpAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAuthorWriteUp(getAuthorWriteUpRequest: GetAuthorWriteUpRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('AuthorWriteUpId', (getAuthorWriteUpRequest.AuthorWriteUpId != null) ? getAuthorWriteUpRequest.AuthorWriteUpId.toString() : null);
        search.set('SearchText', getAuthorWriteUpRequest.SearchText);
        search.set('IsActive', (getAuthorWriteUpRequest.IsActive != null) ? getAuthorWriteUpRequest.IsActive.toString() : null);
        search.set('PageNumber', (getAuthorWriteUpRequest.PageNumber != null) ? getAuthorWriteUpRequest.PageNumber.toString() : null);
        search.set('PageSize', (getAuthorWriteUpRequest.PageSize != null) ? getAuthorWriteUpRequest.PageSize.toString() : null);
        search.set('OrderBy', getAuthorWriteUpRequest.OrderBy);
        search.set('OrderByDirection', getAuthorWriteUpRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/authorwriteups", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addAuthorWriteUp(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorwriteups/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateAuthorWriteUp(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorwriteups/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteAuthorWriteUp(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/authorwriteups/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/authorwriteups/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    //getTopic(getTopicRequest: GetTopicRequest): Observable<any> {
    //    let headers = new Headers({ 'Authorization': this._global.getToken() });

    //    let search = new URLSearchParams();
    //    search.set('TopicId', (getTopicRequest.TopicId != null) ? getTopicRequest.TopicId.toString() : null);

    //    let requestOptions = new RequestOptions();
    //    requestOptions.headers = headers;
    //    requestOptions.search = search;

    //    return this._http.get(Global.API_SITE + "admin/api/topics", requestOptions)
    //        .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    //}
}