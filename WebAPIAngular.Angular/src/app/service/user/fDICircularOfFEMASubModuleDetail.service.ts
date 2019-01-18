import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FDICircular, GetFDICircularRequest } from '../../model/fDICircular';
import { FDICircularIndexAmendment, GetFDICircularIndexAmendmentRequest } from '../../model/fDICircularIndexAmendment';
import { FAQ, GetFAQRequest } from '../../model/fAQ';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../model/fDICircularIndex';
import { FDICircularSubIndex, GetFDICircularSubIndexRequest } from '../../model/fDICircularSubIndex';
import { FDIChapter, GetFDIChapterRequest } from '../../model/fDIChapter';

@Injectable()
export class FDICircularOfFEMASubModuleDetailUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFDICircular(getFDICircularRequest: GetFDICircularRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FDICircularId', (getFDICircularRequest.FDICircularId != null) ? getFDICircularRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularRequest.SearchText);
        search.set('IsActive', (getFDICircularRequest.IsActive != null) ? getFDICircularRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularRequest.PageNumber != null) ? getFDICircularRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularRequest.PageSize != null) ? getFDICircularRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fdicirculars", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFDICircularChapter(getFDICircularChapterRequest: GetFDIChapterRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FDICircularChapterId', (getFDICircularChapterRequest.FDIChapterId != null) ? getFDICircularChapterRequest.FDIChapterId.toString() : null);
        search.set('FDICircularId', (getFDICircularChapterRequest.FDICircularId != null) ? getFDICircularChapterRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularChapterRequest.SearchText);
        search.set('IsActive', (getFDICircularChapterRequest.IsActive != null) ? getFDICircularChapterRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularChapterRequest.PageNumber != null) ? getFDICircularChapterRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularChapterRequest.PageSize != null) ? getFDICircularChapterRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularChapterRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularChapterRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fdichapters", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFDICircularIndex(getFDICircularIndexRequest: GetFDICircularIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FDICircularIndexId', (getFDICircularIndexRequest.FDICircularIndexId != null) ? getFDICircularIndexRequest.FDICircularIndexId.toString() : null);
        search.set('FDIChapterId', (getFDICircularIndexRequest.FDIChapterId != null) ? getFDICircularIndexRequest.FDIChapterId.toString() : null);
        search.set('FDICircularId', (getFDICircularIndexRequest.FDICircularId != null) ? getFDICircularIndexRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularIndexRequest.SearchText);
        search.set('IsActive', (getFDICircularIndexRequest.IsActive != null) ? getFDICircularIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularIndexRequest.PageNumber != null) ? getFDICircularIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularIndexRequest.PageSize != null) ? getFDICircularIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularIndexRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fdicircularindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFDICircularSubIndex(getFDICircularSubIndexRequest: GetFDICircularSubIndexRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FDICircularSubIndexId', (getFDICircularSubIndexRequest.FDICircularSubIndexId != null) ? getFDICircularSubIndexRequest.FDICircularSubIndexId.toString() : null);
        search.set('FDICircularIndexId', (getFDICircularSubIndexRequest.FDICircularIndexId != null) ? getFDICircularSubIndexRequest.FDICircularIndexId.toString() : null);
        search.set('FDICircularId', (getFDICircularSubIndexRequest.FDICircularId != null) ? getFDICircularSubIndexRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularSubIndexRequest.SearchText);
        search.set('IsActive', (getFDICircularSubIndexRequest.IsActive != null) ? getFDICircularSubIndexRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularSubIndexRequest.PageNumber != null) ? getFDICircularSubIndexRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularSubIndexRequest.PageSize != null) ? getFDICircularSubIndexRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularSubIndexRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularSubIndexRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fdicircularsubindexes", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFDICircularIndexAmendment(getFDICircularIndexAmendmentRequest: GetFDICircularIndexAmendmentRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FDICircularIndexAmendmentId', (getFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId != null) ? getFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId.toString() : null);
        search.set('FDICircularId', (getFDICircularIndexAmendmentRequest.FDICircularId != null) ? getFDICircularIndexAmendmentRequest.FDICircularId.toString() : null);
        search.set('SearchText', getFDICircularIndexAmendmentRequest.SearchText);
        search.set('IsActive', (getFDICircularIndexAmendmentRequest.IsActive != null) ? getFDICircularIndexAmendmentRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFDICircularIndexAmendmentRequest.PageNumber != null) ? getFDICircularIndexAmendmentRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFDICircularIndexAmendmentRequest.PageSize != null) ? getFDICircularIndexAmendmentRequest.PageSize.toString() : null);
        search.set('OrderBy', getFDICircularIndexAmendmentRequest.OrderBy);
        search.set('OrderByDirection', getFDICircularIndexAmendmentRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fdicircularindexamendments", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }    

    getFDICircularFAQ(getFAQRequest: GetFAQRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FAQId', (getFAQRequest.FAQId != null) ? getFAQRequest.FAQId.toString() : null);
        search.set('SearchText', getFAQRequest.SearchText);
        search.set('IsActive', (getFAQRequest.IsActive != null) ? getFAQRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFAQRequest.PageNumber != null) ? getFAQRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFAQRequest.PageSize != null) ? getFAQRequest.PageSize.toString() : null);
        search.set('OrderBy', getFAQRequest.OrderBy);
        search.set('OrderByDirection', getFAQRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/faqs", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}