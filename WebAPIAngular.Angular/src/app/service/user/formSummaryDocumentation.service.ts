import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { FormSummaryDocumentation, GetFormSummaryDocumentationRequest } from '../../model/formSummaryDocumentation';
import { FormSummaryDocumentationDetail, GetFormSummaryDocumentationDetailRequest } from '../../model/formSummaryDocumentationDetail';

@Injectable()
export class FormSummaryDocumentationUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getFormSummaryDocumentation(getFormSummaryDocumentationRequest: GetFormSummaryDocumentationRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FormSummaryDocumentationId', (getFormSummaryDocumentationRequest.FormSummaryDocumentationId != null) ? getFormSummaryDocumentationRequest.FormSummaryDocumentationId.toString() : null);
        search.set('SubMenuName', getFormSummaryDocumentationRequest.SubMenuName);
        search.set('SearchText', getFormSummaryDocumentationRequest.SearchText);
        search.set('IsActive', (getFormSummaryDocumentationRequest.IsActive != null) ? getFormSummaryDocumentationRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFormSummaryDocumentationRequest.PageNumber != null) ? getFormSummaryDocumentationRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFormSummaryDocumentationRequest.PageSize != null) ? getFormSummaryDocumentationRequest.PageSize.toString() : null);
        search.set('OrderBy', getFormSummaryDocumentationRequest.OrderBy);
        search.set('OrderByDirection', getFormSummaryDocumentationRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/formsummarydocumentations", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest: GetFormSummaryDocumentationDetailRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('FormSummaryDocumentationDetailId', (getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId != null) ? getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId.toString() : null);
        search.set('FormSummaryDocumentationId', (getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId != null) ? getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId.toString() : null);
        search.set('SubMenuName', getFormSummaryDocumentationDetailRequest.SubMenuName);
        search.set('SearchText', getFormSummaryDocumentationDetailRequest.SearchText);
        search.set('IsActive', (getFormSummaryDocumentationDetailRequest.IsActive != null) ? getFormSummaryDocumentationDetailRequest.IsActive.toString() : null);
        search.set('PageNumber', (getFormSummaryDocumentationDetailRequest.PageNumber != null) ? getFormSummaryDocumentationDetailRequest.PageNumber.toString() : null);
        search.set('PageSize', (getFormSummaryDocumentationDetailRequest.PageSize != null) ? getFormSummaryDocumentationDetailRequest.PageSize.toString() : null);
        search.set('OrderBy', getFormSummaryDocumentationDetailRequest.OrderBy);
        search.set('OrderByDirection', getFormSummaryDocumentationDetailRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/formsummarydocumentationdetails", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}