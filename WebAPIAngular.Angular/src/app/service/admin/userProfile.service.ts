import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { UserProfile, GetUserProfileRequest } from '../../model/userProfile';

@Injectable()
export class UserProfileAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getUserProfile(getUserProfileRequest: GetUserProfileRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('UserId', (getUserProfileRequest.UserId != null) ? getUserProfileRequest.UserId.toString() : null);
        search.set('SearchText', getUserProfileRequest.SearchText);
        search.set('IsActive', (getUserProfileRequest.IsActive != null) ? getUserProfileRequest.IsActive.toString() : null);
        search.set('PageNumber', (getUserProfileRequest.PageNumber != null) ? getUserProfileRequest.PageNumber.toString() : null);
        search.set('PageSize', (getUserProfileRequest.PageSize != null) ? getUserProfileRequest.PageSize.toString() : null);
        search.set('OrderBy', getUserProfileRequest.OrderBy);
        search.set('OrderByDirection', getUserProfileRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/userprofiles", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateProfile(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/userprofiles/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    sendOTPForUserProfile(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/sendotpforuserprofile", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}