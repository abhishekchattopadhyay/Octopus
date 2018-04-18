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
import { Irmxtype } from '../../../Interface/rmxtype.interface';
import { testcaseservice } from '../../../services/testcase.service';
import { alertpopservice } from '../../../services/alertpop.service';
@Component({
    selector:'rmx-type',
    templateUrl:'./rmxtype.component.html'
})
export class rmxtype{
    buttonName = 'Add';
    _rmxtype: Irmxtype[];
    loading = true;
    Rmxform: FormGroup;
    constructor(private _testcaseservice: testcaseservice, private formBuilder: FormBuilder) { }
    ngOnInit() {
        this.Rmxform = this.formBuilder.group({
            Rmxname: ['', Validators.required]
        });
        this._rmxtype = this._testcaseservice.getRMXType();
        this.loading = false;
    }
    isFieldValid(field: string) {
        return !this.Rmxform.get(field).valid && this.Rmxform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    SaveRmx() {
        if (!this.Rmxform.valid) {
            this.validateAllFormFields(this.Rmxform);
        } else {
            if (this.buttonName === 'Edit') {
                console.log('form Edited');
            } else {
                console.log('form submitted');
            }
        }
    }
    EditRmx(field: string) {
        this.Rmxform.setValue({ Rmxname: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.Rmxform.reset();
    }
    DeleteRmx(field: string) {
        if (confirm('Are you sure to delete Rmx: ' + field + ' ?')) {
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