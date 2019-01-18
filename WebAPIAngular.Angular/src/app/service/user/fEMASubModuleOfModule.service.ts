import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FEMASubModuleOfModule, GetFEMASubModuleOfModuleRequest } from '../../model/fEMASubModuleOfModule';

@Injectable()
export class FEMASubModuleOfModuleUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFEMASubModuleOfModule(getFEMASubModuleOfModuleRequest: GetFEMASubModuleOfModuleRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FEMAModuleId', (getFEMASubModuleOfModuleRequest.FEMAModuleId != null) ? getFEMASubModuleOfModuleRequest.FEMAModuleId.toString() : null);
        search.set('PageNumber', (getFEMASubModuleOfModuleRequest.PageNumber != null) ? getFEMASubModuleOfModuleRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFEMASubModuleOfModuleRequest.PageSize != null) ? getFEMASubModuleOfModuleRequest.PageSize.toString() : null);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/femasubmoduleofmodules", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}