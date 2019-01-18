import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { CalculatorSubTopic, GetCalculatorSubTopicRequest } from '../../model/calculatorSubTopic';

@Injectable()
export class CalculatorSubTopicUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getCalculatorSubTopic(getCalculatorSubTopicRequest: GetCalculatorSubTopicRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('CalculatorSubTopicId', (getCalculatorSubTopicRequest.CalculatorSubTopicId != null) ? getCalculatorSubTopicRequest.CalculatorSubTopicId.toString() : null);
        search.set('FEMAModuleId', (getCalculatorSubTopicRequest.FEMAModuleId != null) ? getCalculatorSubTopicRequest.FEMAModuleId.toString() : null);
        search.set('SearchText', getCalculatorSubTopicRequest.SearchText);
        search.set('IsActive', (getCalculatorSubTopicRequest.IsActive != null) ? getCalculatorSubTopicRequest.IsActive.toString() : null);
        search.set('PageNumber', (getCalculatorSubTopicRequest.PageNumber != null) ? getCalculatorSubTopicRequest.PageNumber.toString() : null);
        search.set('PageSize', (getCalculatorSubTopicRequest.PageSize != null) ? getCalculatorSubTopicRequest.PageSize.toString() : null);
        search.set('OrderBy', getCalculatorSubTopicRequest.OrderBy);
        search.set('OrderByDirection', getCalculatorSubTopicRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/calculatorsubtopics", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

}