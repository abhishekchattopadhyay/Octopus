import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    ReactiveFormsModule
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Iprotocol } from '../../../Interface/protocol.interface';
import { testcaseservice } from '../../../services/testcase.service';
import { alertpopservice } from '../../../services/alertpop.service';
@Component({
    selector: 'protocol-type',
    templateUrl: './protocoltype.component.html'
})
export class protocoltype implements OnInit {
    buttonName = 'Add';
    _protocols: Iprotocol[];
    loading = true;
    Protocolform: FormGroup;
    constructor(private _testcaseservice: testcaseservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        this.Protocolform = this.formBuilder.group({
            Protocolname: ['', Validators.required]
        });
        this._protocols = this._testcaseservice.getProtocol();
        this.loading = false;
    }
    isFieldValid(field: string) {
        return !this.Protocolform.get(field).valid && this.Protocolform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    SaveProtocol() {
        if (!this.Protocolform.valid) {
            this.validateAllFormFields(this.Protocolform);
        } else {
            if (this.buttonName === 'Edit') {
                console.log('form Edited');
                this.Reset();
                this._alertservice.successedit();
            } else {
                console.log('form submitted');
                this.Reset();
                this._alertservice.successsave();
            }
        }
    }
    EditProtocol(field: string) {
        this.Protocolform.setValue({ Protocolname: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.Protocolform.reset();
    }
    DeleteProtocol(field: string) {
        if (this._alertservice.alertwithrevert()) {
            //this._alertservice.sucessDeleted();
        } else {
            this._alertservice.canceled();
        }
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            console.log(field);
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

}