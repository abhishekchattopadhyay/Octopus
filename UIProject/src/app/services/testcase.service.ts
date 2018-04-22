import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Ichoicetype } from '../Interface/choice.interface';
import { Iprotocol } from '../Interface/protocol.interface';
import { Irmxtype } from '../Interface/rmxtype.interface';
import { Itesttype } from '../Interface/testtype.interface';
import { Ivideotype } from '../Interface/videotype.interface';


@Injectable()
export class testcaseservice {
    _headers = new Headers({ 'Content-Type': 'application/json' });
    _options = new RequestOptions({ headers: this._headers });
    _serviceUrl: string = 'http://localhost:8000/api';
    _strData: any;
    _body: any;
    constructor(private _http: Http) { }
    getChoice(): Ichoicetype[] {
        return [{ name: "Yes", value: "Yes" }, { name: "No", value: "No" }];
    }
    getRMXType(): Irmxtype[] {
        return [{ name: "RMX 4000", value: "RMX_4000" }, { name: "RMX 2000", value: "RMX_2000" },
        { name: "NINJA", value: "NINJA" }, { name: "RPCS_VE", value: "RPCS_VE" }];
    }
    getTestType(): Itesttype[] {
        return [{ name: "2cps av", value: "2cps_av" }, { name: "5cps a", value: "5cps_a" }];
    }
    getVideoType(): Ivideotype[] {
        return [{ name: "CIF", value: "CIF" }, { name: "HD", value: "HD" }, { name: "SD", value: "SD" }];
    }
    handleError(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}