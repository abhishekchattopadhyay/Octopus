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
import { Imodule } from '../../../Interface/module.interface';
import { moduleservice } from '../../../services/module.service';
import { alertpopservice } from '../../../services/alertpop.service';
import { Response } from '@angular/http';
import swal from 'sweetalert2';
@Component({
    selector: 'add-module',
    templateUrl: './addmodule.component.html'
})
export class addmodule implements OnInit {
    buttonName = 'Add';
    _modulestrName = 'Module';
    _modules: Imodule[];
    Moduleform: FormGroup;
    constructor(private _moduleservice: moduleservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        this.Moduleform = this.formBuilder.group({
            Modulename: ['', Validators.required],
            ModuleOldname: ['']
        });
        this.RefereshModuleList();
    }
    RefereshModuleList() {
        this._moduleservice.getModule()
            .subscribe((moduledata) => this._modules = moduledata, (error) => { this._modules = []; console.log(error) });
    }
    isFieldValid(field: string) {
        return !this.Moduleform.get(field).valid && this.Moduleform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    SaveModule() {
        if (!this.Moduleform.valid) {
            this.validateAllFormFields(this.Moduleform);
        } else {
            let PoldName = this.Moduleform.get('ModuleOldname').value,
                PnewName = this.Moduleform.get('Modulename').value;
            if (this.buttonName === 'Edit') {
                if (PoldName === '') {
                    this._alertservice.errorOccurred();
                    return;
                } else if (PoldName === PnewName) {
                    this._alertservice.infoAlert('Please change the Module name before saving');
                    return;
                }
                this._moduleservice.putModule(PnewName, PoldName)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form Edited');
                            this.Reset();
                            this.RefereshModuleList();
                            this._alertservice.successedit(this._modulestrName);
                        } else {
                            console.log(response.status);
                            this._alertservice.errorOccurred();
                        }
                    }
                    );
            } else {
                this._moduleservice.postModule(this.Moduleform.get('Modulename').value)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('form submitted');
                            this.Reset();
                            this.RefereshModuleList();
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
    EditModule(field: string) {
        this.Moduleform.setValue({ Modulename: field, ModuleOldname: field });
        this.buttonName = 'Edit';
    }
    Reset() {
        this.buttonName = 'Add';
        this.Moduleform.reset();
    }
    DeleteModule(field: string) {
        console.log(field);
        this._alertservice.alertwithrevert().then((result) => {
            if (result.value) {
                this._moduleservice.deleteModule(field)
                    .subscribe((response: Response) => {
                        if (response.status === 201) {
                            console.log(response);
                            console.log('Item deleted');
                            this.Reset();
                            this.RefereshModuleList();
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