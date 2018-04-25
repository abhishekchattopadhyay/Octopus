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
import { Itesttype } from '../../../Interface/testtype.interface';
import { testtypeservice } from '../../../services/testtype.service';
import { alertpopservice } from '../../../services/alertpop.service';
import { Response } from '@angular/http';
import swal from 'sweetalert2';
@Component({
    selector: 'test-type',
    templateUrl: './testtype.component.html'
})
export class testtype {
    buttonName = 'Add';
    _modulestrName = 'Test type';
    _testtype: Itesttype[];
    TestTypeform: FormGroup;
    constructor(private _testtypeservice: testtypeservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        this.TestTypeform = this.formBuilder.group({
            Testtype: ['', Validators.required],
            TestOldtype: ['']
        });
        this.RefereshTesttypeList();
    }
    RefereshTesttypeList() {
        this._testtypeservice.getTestType()
            .subscribe((testtypedata) => this._testtype = testtypedata, (error) => { this._testtype = []; console.log(error) });
    }
    isFieldValid(field: string) {
        return !this.TestTypeform.get(field).valid && this.TestTypeform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    SaveTesttype() {
        if (!this.TestTypeform.valid) {
            this.validateAllFormFields(this.TestTypeform);
        } else {
            let TestoldName = this.TestTypeform.get('TestOldtype').value,
                TestnewName = this.TestTypeform.get('Testtype').value;
            if (this.buttonName === 'Edit') {
                if (TestoldName === '') {
                    this._alertservice.errorOccurred();
                    return;
                } else if (TestoldName === TestnewName) {
                    this._alertservice.infoAlert('Please change the Test type before saving');
                    return;
                }
                this._testtypeservice.putTestType(TestnewName, TestoldName)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form Edited');
                            this.Reset();
                            this.RefereshTesttypeList();
                            this._alertservice.successedit(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }
                    }
                    );
            } else {
                this._testtypeservice.postTestType(this.TestTypeform.get('Testtype').value)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form submitted');
                            this.Reset();
                            this.RefereshTesttypeList();
                            this._alertservice.successsave(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }

                    }
                    );

            }
        }
    }
    EditTesttype(field: string) {
        this.TestTypeform.setValue({ Testtype: field, TestOldtype: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.TestTypeform.reset();
    }
    DeleteTesttype(field: string) {
        console.log(field);
        this._alertservice.alertwithrevert().then((result) => {
            if (result.value) {
                this._testtypeservice.deleteTestType(field)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('Item deleted');
                            this.Reset();
                            this.RefereshTesttypeList();
                            this._alertservice.sucessDeleted(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }

                    }
                    );
            } else if (result.dismiss === swal.DismissReason.cancel) {
                this._alertservice.canceled(this._modulestrName);
            }
        });
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