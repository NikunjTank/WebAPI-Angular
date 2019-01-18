import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { KeyDefinitionEvent, GetKeyDefinitionEventRequest } from '../../model/keyDefinitionEvent';

@Injectable()
export class KeyDefinitionEventUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getKeyDefinitionEvent(getKeyDefinitionEventRequest: GetKeyDefinitionEventRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('KeyDefinitionEventId', (getKeyDefinitionEventRequest.KeyDefinitionEventId != null) ? getKeyDefinitionEventRequest.KeyDefinitionEventId.toString() : null);
        search.set('DefinitionEventName', getKeyDefinitionEventRequest.DefinitionEventName);
        search.set('SearchText', getKeyDefinitionEventRequest.SearchText);
        search.set('IsActive', (getKeyDefinitionEventRequest.IsActive != null) ? getKeyDefinitionEventRequest.IsActive.toString() : null);
        search.set('PageNumber', (getKeyDefinitionEventRequest.PageNumber != null) ? getKeyDefinitionEventRequest.PageNumber.toString() : null);
        search.set('PageSize', (getKeyDefinitionEventRequest.PageSize != null) ? getKeyDefinitionEventRequest.PageSize.toString() : null);
        search.set('OrderBy', getKeyDefinitionEventRequest.OrderBy);
        search.set('OrderByDirection', getKeyDefinitionEventRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/keydefinitionevents", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}