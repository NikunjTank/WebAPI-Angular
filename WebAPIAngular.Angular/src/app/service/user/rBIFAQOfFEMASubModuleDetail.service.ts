import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { RBIFAQOfFEMASubModuleDetail, GetRBIFAQOfFEMASubModuleDetailRequest } from '../../model/rBIFAQOfFEMASubModuleDetail';

@Injectable()
export class RBIFAQOfFEMASubModuleDetailUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRBIFAQOfFEMASubModuleDetail(getFEMASubModuleDetailRequest: GetRBIFAQOfFEMASubModuleDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FEMASubModuleOfModuleId', (getFEMASubModuleDetailRequest.FEMASubModuleOfModuleId != null) ? getFEMASubModuleDetailRequest.FEMASubModuleOfModuleId.toString() : null);
        search.set('SearchText', getFEMASubModuleDetailRequest.SearchText);
        search.set('IsActive', (getFEMASubModuleDetailRequest.IsActive != null) ? getFEMASubModuleDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFEMASubModuleDetailRequest.PageNumber != null) ? getFEMASubModuleDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFEMASubModuleDetailRequest.PageSize != null) ? getFEMASubModuleDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getFEMASubModuleDetailRequest.OrderBy);
        search.set('OrderByDirection', getFEMASubModuleDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rbifaqoffemasubmoduledetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
    
}