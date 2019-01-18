import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';

import { SupportTicketReply, GetSupportTicketReplyRequest } from '../../model/supportTicketReply';

@Injectable()
export class SupportTicketReplyUserService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getSupportTicketReply(getSupportTicketReplyRequest: GetSupportTicketReplyRequest): Observable<any> {
        let headers = new Headers({ 'Authorization': this._global.getUserToken() });

        let search = new URLSearchParams();
        search.set('SupportTicketId', (getSupportTicketReplyRequest.SupportTicketId != null) ? getSupportTicketReplyRequest.SupportTicketId.toString() : null);
        search.set('SearchText', getSupportTicketReplyRequest.SearchText);
        search.set('IsActive', (getSupportTicketReplyRequest.IsActive != null) ? getSupportTicketReplyRequest.IsActive.toString() : null);
        search.set('PageNumber', (getSupportTicketReplyRequest.PageNumber != null) ? getSupportTicketReplyRequest.PageNumber.toString() : null);
        search.set('PageSize', (getSupportTicketReplyRequest.PageSize != null) ? getSupportTicketReplyRequest.PageSize.toString() : null);
        search.set('OrderBy', getSupportTicketReplyRequest.OrderBy);
        search.set('OrderByDirection', getSupportTicketReplyRequest.OrderByDirection);

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;
        requestOptions.search = search;

        return this._http.get(Global.API_SITE + "user/api/supportticketreplies", requestOptions)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }

    addSupportTicketReply(model: any): Observable<any> {
        let body = JSON.stringify(model);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this._global.getUserToken() });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(Global.API_SITE + "user/api/supportticketreplies/add", body, options)
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}