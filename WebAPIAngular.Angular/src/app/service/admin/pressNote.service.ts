import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { PressNote, GetPressNoteRequest } from '../../model/pressNote';

@Injectable()
export class PressNoteAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getPressNote(getPressNoteRequest: GetPressNoteRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('PressNoteId', (getPressNoteRequest.PressNoteId != null) ? getPressNoteRequest.PressNoteId.toString() : null);
        search.set('Year', getPressNoteRequest.Year);
        search.set('SearchText', getPressNoteRequest.SearchText);
        search.set('IsActive', (getPressNoteRequest.IsActive != null) ? getPressNoteRequest.IsActive.toString() : null);
        search.set('PageNumber', (getPressNoteRequest.PageNumber != null) ? getPressNoteRequest.PageNumber.toString() : null);
        search.set('PageSize', (getPressNoteRequest.PageSize != null) ? getPressNoteRequest.PageSize.toString() : null);
        search.set('OrderBy', getPressNoteRequest.OrderBy);
        search.set('OrderByDirection', getPressNoteRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/pressnotes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addPressNote(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotes/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updatePressNote(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotes/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deletePressNote(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotes/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    fileUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/pressnotes/uploadfiles", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}