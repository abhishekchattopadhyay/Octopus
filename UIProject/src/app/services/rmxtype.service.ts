import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Irmxtype } from '../Interface/rmxtype.interface';
@Injectable()
export class rmxtypeservice {
    _headers = new Headers({ 'Content-Type': 'application/json' });
    _options = new RequestOptions({ headers: this._headers });
    _serviceUrl: string = 'http://localhost:8000/api/RmxType';
    _strData: any;
    _body: any;
    constructor(private _http: Http) { }

    getRmxType(): Observable<Irmxtype[]> {
        return this._http.get(this._serviceUrl )
            .map((response: Response) => <Irmxtype[]>response.json())
            .catch(this.handleError);
    }
    postRmxType(data: string): Observable<Response> {
        this._strData = { type: data };
        this._body = JSON.stringify(this._strData);
        return this._http.post(this._serviceUrl , this._body, this._options)
            .map((res: Response) => res)
            .catch(this.handleError);
    }
    putRmxType(Newdata: string, OldData: string): Observable<Response> {
        this._strData = { oldtype: OldData, newtype: Newdata };
        this._body = JSON.stringify(this._strData);
        return this._http.put(this._serviceUrl , this._body, this._options)
            .map((res: Response) => res)
            .catch(this.handleError);
    }
    deleteRmxType(data: string): Observable<Response> {
        this._strData = { type: data };
        this._body = JSON.stringify(this._strData);
        return this._http.delete(this._serviceUrl ,new RequestOptions({
            headers: this._headers,
            body: this._body
         }))
            .map((res: Response) => res)
            .catch(this.handleError);
    }
    handleError(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}