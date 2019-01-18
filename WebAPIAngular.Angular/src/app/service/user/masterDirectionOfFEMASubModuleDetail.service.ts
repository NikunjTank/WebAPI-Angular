import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { MasterDirectionOfFEMASubModuleDetail, GetMasterDirectionOfFEMASubModuleDetailRequest } from '../../model/masterDirectionOfFEMASubModuleDetail';
import { MasterDirectionIndexAmendment, GetMasterDirectionIndexAmendmentRequest } from '../../model/masterDirectionIndexAmendment';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../model/masterDirectionIndex';
import { MasterDirectionSubIndex, GetMasterDirectionSubIndexRequest } from '../../model/masterDirectionSubIndex';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../model/masterDirectionChapter';
import { MasterDirectionFAQ, GetMasterDirectionFAQRequest } from '../../model/masterDirectionFAQ';

@Injectable()
export class MasterDirectionOfFEMASubModuleDetailUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getMasterDirectionOfFEMASubModuleDetail(getFEMASubModuleDetailRequest: GetMasterDirectionOfFEMASubModuleDetailRequest): Observable<any> {
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

        return this._http.get(Global.API_SITE + "user/api/masterdirectionoffemasubmoduledetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getMasterDirectionChapter(getMasterDirectionChapterRequest: GetMasterDirectionChapterRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionChapterId', (getMasterDirectionChapterRequest.MasterDirectionChapterId != null) ? getMasterDirectionChapterRequest.MasterDirectionChapterId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionChapterRequest.MasterDirectionId != null) ? getMasterDirectionChapterRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionChapterRequest.SearchText);
        search.set('IsActive', (getMasterDirectionChapterRequest.IsActive != null) ? getMasterDirectionChapterRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionChapterRequest.PageNumber != null) ? getMasterDirectionChapterRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionChapterRequest.PageSize != null) ? getMasterDirectionChapterRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionChapterRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionChapterRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/masterdirectionchapters", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getMasterDirectionIndex(getMasterDirectionIndexRequest: GetMasterDirectionIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionIndexId', (getMasterDirectionIndexRequest.MasterDirectionIndexId != null) ? getMasterDirectionIndexRequest.MasterDirectionIndexId.toString() : null);
        search.set('MasterDirectionChapterId', (getMasterDirectionIndexRequest.MasterDirectionChapterId != null) ? getMasterDirectionIndexRequest.MasterDirectionChapterId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionIndexRequest.MasterDirectionId != null) ? getMasterDirectionIndexRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionIndexRequest.SearchText);
        search.set('IsActive', (getMasterDirectionIndexRequest.IsActive != null) ? getMasterDirectionIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionIndexRequest.PageNumber != null) ? getMasterDirectionIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionIndexRequest.PageSize != null) ? getMasterDirectionIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionIndexRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/masterdirectionindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest: GetMasterDirectionSubIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionSubIndexId', (getMasterDirectionSubIndexRequest.MasterDirectionSubIndexId != null) ? getMasterDirectionSubIndexRequest.MasterDirectionSubIndexId.toString() : null);
        search.set('MasterDirectionIndexId', (getMasterDirectionSubIndexRequest.MasterDirectionIndexId != null) ? getMasterDirectionSubIndexRequest.MasterDirectionIndexId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionSubIndexRequest.MasterDirectionId != null) ? getMasterDirectionSubIndexRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionSubIndexRequest.SearchText);
        search.set('IsActive', (getMasterDirectionSubIndexRequest.IsActive != null) ? getMasterDirectionSubIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionSubIndexRequest.PageNumber != null) ? getMasterDirectionSubIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionSubIndexRequest.PageSize != null) ? getMasterDirectionSubIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionSubIndexRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionSubIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/masterdirectionsubindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getMasterDirectionIndexAmendment(getMasterDirectionIndexAmendmentRequest: GetMasterDirectionIndexAmendmentRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionIndexAmendmentId', (getMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId != null) ? getMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionIndexAmendmentRequest.MasterDirectionId != null) ? getMasterDirectionIndexAmendmentRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionIndexAmendmentRequest.SearchText);
        search.set('IsActive', (getMasterDirectionIndexAmendmentRequest.IsActive != null) ? getMasterDirectionIndexAmendmentRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionIndexAmendmentRequest.PageNumber != null) ? getMasterDirectionIndexAmendmentRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionIndexAmendmentRequest.PageSize != null) ? getMasterDirectionIndexAmendmentRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionIndexAmendmentRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionIndexAmendmentRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/masterdirectionindexamendments", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }    

    getMasterDirectionFAQ(getMasterDirectionFAQRequest: GetMasterDirectionFAQRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('MasterDirectionFAQId', (getMasterDirectionFAQRequest.MasterDirectionFAQId != null) ? getMasterDirectionFAQRequest.MasterDirectionFAQId.toString() : null);
        search.set('MasterDirectionId', (getMasterDirectionFAQRequest.MasterDirectionId != null) ? getMasterDirectionFAQRequest.MasterDirectionId.toString() : null);
        search.set('SearchText', getMasterDirectionFAQRequest.SearchText);
        search.set('IsActive', (getMasterDirectionFAQRequest.IsActive != null) ? getMasterDirectionFAQRequest.IsActive.toString() : null);
        search.set('PageNumber', (getMasterDirectionFAQRequest.PageNumber != null) ? getMasterDirectionFAQRequest.PageNumber.toString() : null);
        search.set('PageSize', (getMasterDirectionFAQRequest.PageSize != null) ? getMasterDirectionFAQRequest.PageSize.toString() : null);
        search.set('OrderBy', getMasterDirectionFAQRequest.OrderBy);
        search.set('OrderByDirection', getMasterDirectionFAQRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/masterdirectionfaqs", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}