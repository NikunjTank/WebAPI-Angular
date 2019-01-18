import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { PressNoteAPDIRCircular, GetPressNoteAPDIRCircularRequest } from '../../model/pressNoteAPDIRCircular';

@Injectable()
export class PressNoteAPDIRCircularAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getPressNoteAPDIRCircular(getPressNoteAPDIRCircularRequest: GetPressNoteAPDIRCircularRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('PressNoteAPDIRCircularId', (getPressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId != null) ? getPressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId.toString() : null);
        search.set('PressNoteId', (getPressNoteAPDIRCircularRequest.PressNoteId != null) ? getPressNoteAPDIRCircularRequest.PressNoteId.toString() : null);
        search.set('SearchText', getPressNoteAPDIRCircularRequest.SearchText);
        search.set('IsActive', (getPressNoteAPDIRCircularRequest.IsActive != null) ? getPressNoteAPDIRCircularRequest.IsActive.toString() : null);
        search.set('PageNumber', (getPressNoteAPDIRCircularRequest.PageNumber != null) ? getPressNoteAPDIRCircularRequest.PageNumber.toString() : null);
        search.set('PageSize', (getPressNoteAPDIRCircularRequest.PageSize != null) ? getPressNoteAPDIRCircularRequest.PageSize.toString() : null);
        search.set('OrderBy', getPressNoteAPDIRCircularRequest.OrderBy);
        search.set('OrderByDirection', getPressNoteAPDIRCircularRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/pressnoteapdircirculars", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addPressNoteAPDIRCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnoteapdircirculars/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updatePressNoteAPDIRCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnoteapdircirculars/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deletePressNoteAPDIRCircular(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnoteapdircirculars/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}