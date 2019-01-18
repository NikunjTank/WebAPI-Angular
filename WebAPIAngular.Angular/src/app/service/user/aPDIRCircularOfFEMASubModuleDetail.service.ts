import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { APDIRCircularOfFEMASubModuleDetail, GetAPDIRCircularOfFEMASubModuleDetailRequest } from '../../model/aPDIRCircularOfFEMASubModuleDetail';
import { IndexAmendment, GetIndexAmendmentRequest } from '../../model/indexAmendment';
import { FemaIndex, GetFemaIndexRequest } from '../../model/femaIndex';
import { FemaSubIndex, GetFemaSubIndexRequest } from '../../model/femaSubIndex';

@Injectable()
export class APDIRCircularOfFEMASubModuleDetailUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getAPDIRCircularOfFEMASubModuleDetail(getFEMASubModuleDetailRequest: GetAPDIRCircularOfFEMASubModuleDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('APDIRCircularId', (getFEMASubModuleDetailRequest.APDIRCircularId != null) ? getFEMASubModuleDetailRequest.APDIRCircularId.toString() : null);
        search.set('MasterDirectionId', (getFEMASubModuleDetailRequest.MasterDirectionId != null) ? getFEMASubModuleDetailRequest.MasterDirectionId.toString() : null);
        search.set('Year', getFEMASubModuleDetailRequest.Year);
        search.set('SearchText', getFEMASubModuleDetailRequest.SearchText);
        search.set('IsActive', (getFEMASubModuleDetailRequest.IsActive != null) ? getFEMASubModuleDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFEMASubModuleDetailRequest.PageNumber != null) ? getFEMASubModuleDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFEMASubModuleDetailRequest.PageSize != null) ? getFEMASubModuleDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getFEMASubModuleDetailRequest.OrderBy);
        search.set('OrderByDirection', getFEMASubModuleDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/apdircirculars", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getAPDIRCircularYears(): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return this._http.get(Global.API_SITE + "user/api/apdircircularyears", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}