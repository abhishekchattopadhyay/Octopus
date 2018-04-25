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
import { rmxtypeservice } from '../../../services/rmxtype.service';
import { alertpopservice } from '../../../services/alertpop.service';
import { Response } from '@angular/http';
import swal from 'sweetalert2';
@Component({
    selector:'rmx-type',
    templateUrl:'./rmxtype.component.html'
})
export class rmxtype{
    buttonName = 'Add';
    _modulestrName = 'Rmx type';
    _rmxtype: Irmxtype[];
    RmxTypeform: FormGroup;
    constructor(private _rmxtypeservice: rmxtypeservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        this.RmxTypeform = this.formBuilder.group({
            Rmxtype: ['', Validators.required],
            RmxOldtype: ['']
        });
        this.RefereshRmxtypeList();
    }
    RefereshRmxtypeList() {
        this._rmxtypeservice.getRmxType()
            .subscribe((rmxtypedata) => this._rmxtype = rmxtypedata, (error) => {this._rmxtype=[]; console.log(error) });
    }
    isFieldValid(field: string) {
        return !this.RmxTypeform.get(field).valid && this.RmxTypeform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    SaveRmxtype() {
        if (!this.RmxTypeform.valid) {
            this.validateAllFormFields(this.RmxTypeform);
        } else {
            let RmxoldName = this.RmxTypeform.get('RmxOldtype').value,
                RmxnewName = this.RmxTypeform.get('Rmxtype').value;
            if (this.buttonName === 'Edit') {
                if (RmxoldName === '') {
                    this._alertservice.errorOccurred();
                    return;
                } else if (RmxoldName === RmxnewName) {
                    this._alertservice.infoAlert('Please change the Rmx type before saving');
                    return;
                }
                this._rmxtypeservice.putRmxType(RmxnewName, RmxoldName)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form Edited');
                            this.Reset();
                            this.RefereshRmxtypeList();
                            this._alertservice.successedit(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }
                    }
                    );
            } else {
                this._rmxtypeservice.postRmxType(this.RmxTypeform.get('Rmxtype').value)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form submitted');
                            this.Reset();
                            this.RefereshRmxtypeList();
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
    EditRmxtype(field: string) {
        this.RmxTypeform.setValue({ Rmxtype: field, RmxOldtype: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.RmxTypeform.reset();
    }
    DeleteRmxtype(field: string) {
        console.log(field);
        this._alertservice.alertwithrevert().then((result) => {
            if (result.value) {
                this._rmxtypeservice.deleteRmxType(field)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('Item deleted');
                            this.Reset();
                            this.RefereshRmxtypeList();
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