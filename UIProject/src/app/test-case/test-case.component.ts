import { Component, OnInit } from '@angular/core';
import { testcaseservice } from '../services/testcase.service';
import { Ichoicetype } from '../Interface/choice.interface';
import { Iprotocol } from '../Interface/protocol.interface';
import { Irmxtype } from '../Interface/rmxtype.interface';
import { Itestcase } from '../Interface/testcase.interface';
import { Ivideotype } from '../Interface/videotype.interface';
import { Itesttype } from '../Interface/testtype.interface';
import { protocolservice } from '../services/protocol.service';

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
  _testtype: Itesttype[];

  constructor(private _testcaseservice: testcaseservice, private _protocolservice: protocolservice) { }
  ngOnInit() {
    this._choice = this._testcaseservice.getChoice();
    this._protocolservice.getProtocol()
      .subscribe((response) => this._protocol = response);
    this._rmxtype = this._testcaseservice.getRMXType();
    this._videotype = this._testcaseservice.getVideoType();
    this._testtype = this._testcaseservice.getTestType();
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
      rmxType: [],
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
      testType: [""],
      videoType: [""],
      protocolType: [""],
      onFailureRestart: [""],
      recurrence: [""],
      rate: "",
      holdTime: "",
      fr: "",
      emailTo: ""
    };
  }
}
