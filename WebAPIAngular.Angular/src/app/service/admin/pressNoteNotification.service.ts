import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { PressNoteNotification, GetPressNoteNotificationRequest } from '../../model/pressNoteNotification';

@Injectable()
export class PressNoteNotificationAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getPressNoteNotification(getPressNoteNotificationRequest: GetPressNoteNotificationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('PressNoteNotificationId', (getPressNoteNotificationRequest.PressNoteNotificationId != null) ? getPressNoteNotificationRequest.PressNoteNotificationId.toString() : null);
        search.set('PressNoteId', (getPressNoteNotificationRequest.PressNoteId != null) ? getPressNoteNotificationRequest.PressNoteId.toString() : null);
        search.set('SearchText', getPressNoteNotificationRequest.SearchText);
        search.set('IsActive', (getPressNoteNotificationRequest.IsActive != null) ? getPressNoteNotificationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getPressNoteNotificationRequest.PageNumber != null) ? getPressNoteNotificationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getPressNoteNotificationRequest.PageSize != null) ? getPressNoteNotificationRequest.PageSize.toString() : null);
        search.set('OrderBy', getPressNoteNotificationRequest.OrderBy);
        search.set('OrderByDirection', getPressNoteNotificationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/pressnotenotifications", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addPressNoteNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotenotifications/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updatePressNoteNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotenotifications/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deletePressNoteNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/pressnotenotifications/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}