import { Component, OnInit } from '@angular/core';
import { testcaseservice } from '../services/testcase.service';
import { Ichoicetype } from '../Interface/choice.interface';
import { Iprotocol } from '../Interface/protocol.interface';
import { Irmxtype } from '../Interface/rmxtype.interface';
import { Itestcase } from '../Interface/testcase.interface';
import { Ivideotype } from '../Interface/videotype.interface';
import { Itesttype } from '../Interface/testtype.interface';

@Component({
  selector: 'app-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.css']
})
export class TestCaseComponent implements OnInit {
  _choice: Ichoicetype[];
  _protocol: Iprotocol[];
  _rmxtype: Irmxtype[];
  _testcasedefault: Itestcase[];
  _videotype: Ivideotype[];
  _testtype:Itesttype[];

  constructor(private _testcaseservice: testcaseservice) { }
  ngOnInit() {
    this._choice = this._testcaseservice.getChoice();
    this._protocol = this._testcaseservice.getProtocol();
    this._rmxtype = this._testcaseservice.getRMXType();
    this._videotype = this._testcaseservice.getVideoType();
    this._testtype=this._testcaseservice.getTestType();
  }
  getDefaultTestCase(): Itestcase {
    return {
      testcaseid: "0",
      scheduledate: "",
      scheduletime: "",
      durationHour: "",
      durationMinute: "",
      durationSecond: "",
      rmxIP: "",
      rmxType: { name: "", value: "" },
      rmxBuild: "",
      rmxUser: "",
      rmxPassword: "",
      rmxSuperUserPassword: "",
      dmaIP: "",
      sippPrimaryIP: "",
      sippPrimaryUser: "",
      sipPrimaryUserPassword: "",
      sippSecondaryIP: "",
      sippSecondaryUser: "",
      sipSecondaryUserPassword: "",
      testType: { name: "", value: "" },
      videoType: { name: "", value: "" },
      protocolType: { name: "", value: "" },
      onFailureRestart: { name: "", value: "" },
      recurrence: { name: "", value: "" },
      rate: "",
      holdTime: "",
      fr: "",
      emailTo: ""
    };
  }
}
