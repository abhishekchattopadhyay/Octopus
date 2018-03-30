import { Injectable } from '@angular/core';
import { Ichoicetype } from '../Interface/choice.interface';
import { Iprotocol } from '../Interface/protocol.interface';
import { Irmxtype } from '../Interface/rmxtype.interface';
import { Itesttype } from '../Interface/testtype.interface';
import { Ivideotype } from '../Interface/videotype.interface';

@Injectable()
export class testcaseservice {

    getChoice(): Ichoicetype[] {
        return [{ name: "Yes",value:"Yes" }, { name: "No",value:"No" }];
    }
    getProtocol(): Iprotocol[] {
        return [{ name: "SIP", value: "SIP" }, { name: "h323", value: "h323" }];
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
}