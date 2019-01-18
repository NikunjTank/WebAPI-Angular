import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';


import { RulesOfFEMASubModuleDetail, GetRulesOfFEMASubModuleDetailRequest} from '../../model/rulesOfFEMASubModuleDetail';

import { RulesIndex, GetRulesIndexRequest } from '../../model/rulesIndex';
import { RulesSubIndex, GetRulesSubIndexRequest } from '../../model/rulesSubIndex';
import { RulesIndexAmendment, GetRulesIndexAmendmentRequest } from '../../model/rulesIndexAmendment';

@Injectable()
export class RulesOfFEMASubModuleDetailUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getRulesOfFEMASubModuleDetail(getFEMASubModuleDetailRequest: GetRulesOfFEMASubModuleDetailRequest): Observable<any> {
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

        return this._http.get(Global.API_SITE + "user/api/rulesoffemasubmoduledetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getRulesIndex(getRulesIndexRequest: GetRulesIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('IndexId', (getRulesIndexRequest.IndexId != null) ? getRulesIndexRequest.IndexId.toString() : null);
        search.set('RulesId', (getRulesIndexRequest.RulesId != null) ? getRulesIndexRequest.RulesId.toString() : null);
        search.set('SearchText', getRulesIndexRequest.SearchText);
        search.set('IsActive', (getRulesIndexRequest.IsActive != null) ? getRulesIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRulesIndexRequest.PageNumber != null) ? getRulesIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRulesIndexRequest.PageSize != null) ? getRulesIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getRulesIndexRequest.OrderBy);
        search.set('OrderByDirection', getRulesIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rulesindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getRulesSubIndex(getRulesSubIndexRequest: GetRulesSubIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('SubIndexId', (getRulesSubIndexRequest.SubIndexId != null) ? getRulesSubIndexRequest.SubIndexId.toString() : null);
        search.set('IndexId', (getRulesSubIndexRequest.IndexId != null) ? getRulesSubIndexRequest.IndexId.toString() : null);
        search.set('RulesId', (getRulesSubIndexRequest.RulesId != null) ? getRulesSubIndexRequest.RulesId.toString() : null);
        search.set('SearchText', getRulesSubIndexRequest.SearchText);
        search.set('IsActive', (getRulesSubIndexRequest.IsActive != null) ? getRulesSubIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRulesSubIndexRequest.PageNumber != null) ? getRulesSubIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRulesSubIndexRequest.PageSize != null) ? getRulesSubIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getRulesSubIndexRequest.OrderBy);
        search.set('OrderByDirection', getRulesSubIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rulessubindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getRulesIndexAmendment(getRulesIndexAmendmentRequest: GetRulesIndexAmendmentRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('RulesIndexAmendmentId', (getRulesIndexAmendmentRequest.RulesIndexAmendmentId != null) ? getRulesIndexAmendmentRequest.RulesIndexAmendmentId.toString() : null);
        search.set('RulesId', (getRulesIndexAmendmentRequest.RulesId != null) ? getRulesIndexAmendmentRequest.RulesId.toString() : null);
        search.set('SearchText', getRulesIndexAmendmentRequest.SearchText);
        search.set('IsActive', (getRulesIndexAmendmentRequest.IsActive != null) ? getRulesIndexAmendmentRequest.IsActive.toString() : null);
        search.set('PageNumber', (getRulesIndexAmendmentRequest.PageNumber != null) ? getRulesIndexAmendmentRequest.PageNumber.toString() : null);
        search.set('PageSize', (getRulesIndexAmendmentRequest.PageSize != null) ? getRulesIndexAmendmentRequest.PageSize.toString() : null);
        search.set('OrderBy', getRulesIndexAmendmentRequest.OrderBy);
        search.set('OrderByDirection', getRulesIndexAmendmentRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/rulesindexamendments", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}