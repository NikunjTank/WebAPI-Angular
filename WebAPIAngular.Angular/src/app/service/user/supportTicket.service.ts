import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { SupportTicket, GetSupportTicketRequest } from '../../model/supportTicket';
import { GetSubTopicRequest, SubTopic } from '../../model/authorWriteUpDetail';

@Injectable()
export class SupportTicketUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSupportTicket(getSupportTicketRequest: GetSupportTicketRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('SupportTicketId', (getSupportTicketRequest.SupportTicketId != null) ? getSupportTicketRequest.SupportTicketId.toString() : null);
        search.set('IsCurrentUser', (getSupportTicketRequest.IsCurrentUser != null) ? getSupportTicketRequest.IsCurrentUser.toString() : null);
        search.set('IsForPostQuery', (getSupportTicketRequest.IsForPostQuery != null) ? getSupportTicketRequest.IsForPostQuery.toString() : null);
        search.set('TopicId', (getSupportTicketRequest.TopicId != null) ? getSupportTicketRequest.TopicId.toString() : null);
        search.set('SubTopicId', (getSupportTicketRequest.SubTopicId != null) ? getSupportTicketRequest.SubTopicId.toString() : null);
        search.set('SearchText', getSupportTicketRequest.SearchText);
        search.set('IsActive', (getSupportTicketRequest.IsActive != null) ? getSupportTicketRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSupportTicketRequest.PageNumber != null) ? getSupportTicketRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSupportTicketRequest.PageSize != null) ? getSupportTicketRequest.PageSize.toString() : null);
        search.set('OrderBy', getSupportTicketRequest.OrderBy);
        search.set('OrderByDirection', getSupportTicketRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/supporttickets", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addSupportTicket(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getUserToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "user/api/supporttickets/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}