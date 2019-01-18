import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Global } from '../../common/global';


@Injectable()
export class LatesNewsService {

    constructor(private _http: Http) { }

    _global: Global = new Global();

    getLatesNews(): Observable<any> {
        return this._http.get(Global.API_SITE + "common/api/latestnews")
            .pipe(map((response: Response) => <any>response.json()), catchError(e => throwError(e)));
    }
}