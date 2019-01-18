import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FAQCategory, GetFAQCategoryRequest } from '../../model/fAQCategory';

@Injectable()
export class FAQCategoryAdminService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFAQCategory(getFAQCategoryRequest: GetFAQCategoryRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getToken() });

        let search = new URLSearchParams();
        search.set('FAQCategoryId', (getFAQCategoryRequest.FAQCategoryId != null) ? getFAQCategoryRequest.FAQCategoryId.toString() : null);
        search.set('SearchText', getFAQCategoryRequest.SearchText);
        search.set('IsActive', (getFAQCategoryRequest.IsActive != null) ? getFAQCategoryRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFAQCategoryRequest.PageNumber != null) ? getFAQCategoryRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFAQCategoryRequest.PageSize != null) ? getFAQCategoryRequest.PageSize.toString() : null);
        search.set('OrderBy', getFAQCategoryRequest.OrderBy);
        search.set('OrderByDirection', getFAQCategoryRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "admin/api/faqcategories", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addFAQCategory(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/faqcategories/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    updateFAQCategory(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/faqcategories/update", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    deleteFAQCategory(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "admin/api/faqcategories/delete", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}