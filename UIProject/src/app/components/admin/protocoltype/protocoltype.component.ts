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
import { protocolservice } from '../../../services/protocol.service';
import { alertpopservice } from '../../../services/alertpop.service';
import { Response } from '@angular/http';
import swal from 'sweetalert2';
@Component({
    selector: 'protocol-type',
    templateUrl: './protocoltype.component.html'
})
export class protocoltype implements OnInit {
    buttonName = 'Add';
    _modulestrName = 'Protocol';
    _protocols: Iprotocol[];
    Protocolform: FormGroup;
    constructor(private _protocolservice: protocolservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        this.Protocolform = this.formBuilder.group({
            Protocolname: ['', Validators.required],
            ProtocolOldname: ['']
        });
        this.RefereshProtocolList();
    }
    RefereshProtocolList() {
        this._protocolservice.getProtocol()
            .subscribe((protocoldata) => this._protocols = protocoldata, (error) => { this._protocols=[]; console.log(error) });
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
            let PoldName = this.Protocolform.get('ProtocolOldname').value,
                PnewName = this.Protocolform.get('Protocolname').value;
            if (this.buttonName === 'Edit') {
                if (PoldName === '') {
                    this._alertservice.errorOccurred();
                    return;
                } else if (PoldName === PnewName) {
                    this._alertservice.infoAlert('Please change the Protocol name before saving');
                    return;
                }
                this._protocolservice.putProtocol(PnewName, PoldName)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form Edited');
                            this.Reset();
                            this.RefereshProtocolList();
                            this._alertservice.successedit(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }
                    }
                    );
            } else {
                this._protocolservice.postProtocol(this.Protocolform.get('Protocolname').value)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form submitted');
                            this.Reset();
                            this.RefereshProtocolList();
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
    EditProtocol(field: string) {
        this.Protocolform.setValue({ Protocolname: field, ProtocolOldname: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.Protocolform.reset();
    }
    DeleteProtocol(field: string) {
        console.log(field);
        this._alertservice.alertwithrevert().then((result) => {
            if (result.value) {
                this._protocolservice.deleteProtocol(field)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('Item deleted');
                            this.Reset();
                            this.RefereshProtocolList();
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