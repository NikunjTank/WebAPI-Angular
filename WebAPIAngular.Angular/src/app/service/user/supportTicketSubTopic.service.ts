import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { SupportTicketSubTopic, GetSupportTicketSubTopicRequest } from '../../model/supportTicketSubTopic';

@Injectable()
export class SupportTicketSubTopicUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSupportTicketSubTopic(getSupportTicketSubTopicRequest: GetSupportTicketSubTopicRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('SupportTicketSubTopicId', (getSupportTicketSubTopicRequest.SupportTicketSubTopicId != null) ? getSupportTicketSubTopicRequest.SupportTicketSubTopicId.toString() : null);
        search.set('FEMAModuleId', (getSupportTicketSubTopicRequest.FEMAModuleId != null) ? getSupportTicketSubTopicRequest.FEMAModuleId.toString() : null);
        search.set('SearchText', getSupportTicketSubTopicRequest.SearchText);
        search.set('IsActive', (getSupportTicketSubTopicRequest.IsActive != null) ? getSupportTicketSubTopicRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSupportTicketSubTopicRequest.PageNumber != null) ? getSupportTicketSubTopicRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSupportTicketSubTopicRequest.PageSize != null) ? getSupportTicketSubTopicRequest.PageSize.toString() : null);
        search.set('OrderBy', getSupportTicketSubTopicRequest.OrderBy);
        search.set('OrderByDirection', getSupportTicketSubTopicRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/supportticketsubtopics", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

}