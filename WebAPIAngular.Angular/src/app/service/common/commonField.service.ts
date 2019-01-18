import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { GetCommonFieldRequest } from '../../model/commonField';

@Injectable()
export class CommonFieldService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getCommonField(getCommonFieldRequest: GetCommonFieldRequest): Observable<any> {
        //let headers = new Headers({ 'Authorization': (this._global.getRoleId() == Global.ADMIN_ROLEID.toString()) ? this._global.getToken() : this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FieldTypeName', getCommonFieldRequest.FieldTypeName);
        search.set('SearchText', getCommonFieldRequest.SearchText);

        let requestOptions = new RequestOptions();
        //requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "common/api/commonfields", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}