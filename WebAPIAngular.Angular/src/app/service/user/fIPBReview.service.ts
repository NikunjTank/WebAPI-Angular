import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FIPBReview, GetFIPBReviewRequest } from '../../model/fIPBReview';

@Injectable()
export class FIPBReviewUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFIPBReview(getFIPBReviewRequest: GetFIPBReviewRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FIPBReviewId', (getFIPBReviewRequest.FIPBReviewId != null) ? getFIPBReviewRequest.FIPBReviewId.toString() : null);
        search.set('SearchText', getFIPBReviewRequest.SearchText);
        search.set('IsActive', (getFIPBReviewRequest.IsActive != null) ? getFIPBReviewRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFIPBReviewRequest.PageNumber != null) ? getFIPBReviewRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFIPBReviewRequest.PageSize != null) ? getFIPBReviewRequest.PageSize.toString() : null);
        search.set('OrderBy', getFIPBReviewRequest.OrderBy);
        search.set('OrderByDirection', getFIPBReviewRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/fipbreviews", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}