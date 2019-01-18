import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { Notification, GetNotificationRequest, GetNotificationTypeRequest } from '../../model/notification';

@Injectable()
export class NotificationAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getNotification(getNotificationRequest: GetNotificationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('NotificationId', (getNotificationRequest.NotificationId != null) ? getNotificationRequest.NotificationId.toString() : null);
        search.set('RegulationId', (getNotificationRequest.RegulationId != null) ? getNotificationRequest.RegulationId.toString() : null);
        search.set('SearchText', getNotificationRequest.SearchText);
        search.set('IsActive', (getNotificationRequest.IsActive != null) ? getNotificationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getNotificationRequest.PageNumber != null) ? getNotificationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getNotificationRequest.PageSize != null) ? getNotificationRequest.PageSize.toString() : null);
        search.set('OrderBy', getNotificationRequest.OrderBy);
        search.set('OrderByDirection', getNotificationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/notifications", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/notifications/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/notifications/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteNotification(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/notifications/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    notificationPDFUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/notifications/uploadnotificationpdf", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    gSRPDFUpload(formData: any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', this._global.getToken());

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.post(Global.API_SITE + "admin/api/notifications/uploadgsrpdf", formData, requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getNotificationType(getNotificationTypeRequest: GetNotificationTypeRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });
        
        let search = new URLSearchParams();
        search.set('NotificationTypeId', (getNotificationTypeRequest.NotificationTypeId != null) ? getNotificationTypeRequest.NotificationTypeId.toString() : null);
        
        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;
        
        return this._http.get(Global.API_SITE + "admin/api/notificationtypes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}