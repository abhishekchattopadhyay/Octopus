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
declare var $: any;
@Component({
    selector: 'protocol-type',
    templateUrl: './protocoltype.component.html'
})
export class protocoltype implements OnInit {
    buttonName = 'Add';
    _protocols: Iprotocol[];
    loading = true;
    Protocolform: FormGroup;
    constructor(private _testcaseservice: testcaseservice, private formBuilder: FormBuilder) { }
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
            console.log('form submitted');
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
        if (confirm('Are you sure to delete Protocol: ' + field + ' ?')) {
            console.log('Deleted');
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