import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Iprotocol } from '../Interface/protocol.interface';
@Injectable()
export class protocolservice {
    _headers = new Headers({ 'Content-Type': 'application/json' });
    _options = new RequestOptions({ headers: this._headers });
    _serviceUrl: string = 'http://localhost:8000/api';
    _strData: any;
    _body: any;
    constructor(private _http: Http) { }

    getProtocol(): Observable<Iprotocol[]> {
        return this._http.get(this._serviceUrl + '/Protocol')
            .map((response: Response) => <Iprotocol[]>response.json())
            .catch(this.handleError);
    }
    postProtocol(data: string): Observable<Response> {
        this._strData = { name: data };
        this._body = JSON.stringify(this._strData);
        return this._http.post(this._serviceUrl + '/Protocol', this._body, this._options)
            .map((res: Response) => res)
            .catch(this.handleError);
    }
    putProtocol(Newdata: string, OldData: string): Observable<Response> {
        this._strData = { oldname: OldData, newname: Newdata };
        this._body = JSON.stringify(this._strData);
        return this._http.put(this._serviceUrl + '/Protocol', this._body, this._options)
            .map((res: Response) => res)
            .catch(this.handleError);
    }
    deleteProtocol(data: string): Observable<Response> {
        this._strData = { name: data };
        this._body = JSON.stringify(this._strData);
        return this._http.delete(this._serviceUrl + '/Protocol',new RequestOptions({
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