import {Irmxtype} from './rmxtype.interface';
import {Itesttype} from './testtype.interface';
import { Ivideotype } from './videotype.interface';
import { Iprotocol } from './protocol.interface';
import { Ichoicetype } from './choice.interface';

export interface Itestcase{
    testcaseid:string,
    scheduledate:string,
    scheduletime:string,
    durationHour:string,
    durationMinute:string,
    durationSecond:string,
    rmxIP:string,
    rmxType:Irmxtype,
    rmxBuild:string,
    rmxUser:string,
    rmxPassword:string,
    rmxSuperUserPassword:string,
    dmaIP:string,
    sippPrimaryIP:string,
    sippPrimaryUser:string,
    sipPrimaryUserPassword:string,
    sippSecondaryIP:string,
    sippSecondaryUser:string,
    sipSecondaryUserPassword:string,
    testType:Itesttype,
    videoType:Ivideotype,
    protocolType:Iprotocol,
    onFailureRestart:Ichoicetype,
    recurrence:Ichoicetype,
    rate:string,
    holdTime:string,
    fr:string,
    emailTo:string    
}