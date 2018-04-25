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
    selector: 'add-rmx',
    templateUrl: './addrmx.component.html'
})
export class addrmx {
    buttonName = 'Add';
    _modulestrName = 'RMX';
    _rmxtype: Irmxtype[];
    AddRmxform: FormGroup;
    constructor(private _rmxtypeservice: rmxtypeservice, private formBuilder: FormBuilder, private _alertservice: alertpopservice) { }
    ngOnInit() {
        const ipPattern = '/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/';

        this.AddRmxform = this.formBuilder.group({
            RmxIP: ['0.0.0.0', Validators.compose([Validators.required, Validators.pattern(ipPattern)])],
            RmxType: ['', Validators.required],
            RmxUser: ['', Validators.required],
            RmxPassword: ['', Validators.required],
            RmxSUPassword: ['', Validators.required]
        });
        this._rmxtypeservice.getRmxType()
            .subscribe((rmxtypedata) => this._rmxtype = rmxtypedata, (error) => { this._rmxtype = []; console.log(error) });
        // this.RefereshVideotypeList();
    }
    // RefereshVideotypeList() {
    //     this._videotypeservice.getVideoType()
    //         .subscribe((videotypedata) => this._videotype = videotypedata, (error) => { console.log(error) });
    // }
    isFieldValid(field: string) {
        return !this.AddRmxform.get(field).valid && this.AddRmxform.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    // SaveVideotype() {
    //     if (!this.VideoTypeform.valid) {
    //         this.validateAllFormFields(this.VideoTypeform);
    //     } else {
    //         let VideooldName = this.VideoTypeform.get('VideoOldtype').value,
    //             VideonewName = this.VideoTypeform.get('Videotype').value;
    //         if (this.buttonName === 'Edit') {
    //             if (VideooldName === '') {
    //                 this._alertservice.errorOccurred();
    //                 return;
    //             } else if (VideooldName === VideonewName) {
    //                 this._alertservice.infoAlert('Please change the Video type before saving');
    //                 return;
    //             }
    //             this._videotypeservice.putVideoType(VideonewName, VideooldName)
    //                 .subscribe((response: Response) => {
    //                     if (response.status === 201) {
    //                         console.log(response);
    //                         console.log('form Edited');
    //                         this.Reset();
    //                         this.RefereshVideotypeList();
    //                         this._alertservice.successedit(this._modulestrName);
    //                     } else {
    //                         console.log(response.status);
    //                         this._alertservice.errorOccurred();
    //                     }
    //                 }
    //                 );
    //         } else {
    //             this._videotypeservice.postVideoType(this.VideoTypeform.get('Videotype').value)
    //                 .subscribe((response: Response) => {
    //                     if (response.status === 201) {
    //                         console.log(response);
    //                         console.log('form submitted');
    //                         this.Reset();
    //                         this.RefereshVideotypeList();
    //                         this._alertservice.successsave(this._modulestrName);
    //                     } else {
    //                         console.log(response.status);
    //                         this._alertservice.errorOccurred();
    //                     }

    //                 }
    //                 );

    //         }
    //     }
    // }
    // EditVideotype(field: string) {
    //     this.VideoTypeform.setValue({ Videotype: field, VideoOldtype: field });
    //     this.buttonName = 'Edit';
    // }
    // Reset() {
    //     this.buttonName = 'Add';
    //     this.VideoTypeform.reset();
    // }
    // DeleteVideotype(field: string) {
    //     console.log(field);
    //     this._alertservice.alertwithrevert().then((result) => {
    //         if (result.value) {
    //             this._videotypeservice.deleteVideoType(field)
    //                 .subscribe((response: Response) => {
    //                     if (response.status === 201) {
    //                         console.log(response);
    //                         console.log('Item deleted');
    //                         this.Reset();
    //                         this.RefereshVideotypeList();
    //                         this._alertservice.sucessDeleted(this._modulestrName);
    //                     } else {
    //                         console.log(response.status);
    //                         this._alertservice.errorOccurred();
    //                     }

    //                 }
    //                 );
    //         } else if (result.dismiss === swal.DismissReason.cancel) {
    //             this._alertservice.canceled(this._modulestrName);
    //         }
    //     });
    // }
    // validateAllFormFields(formGroup: FormGroup) {
    //     Object.keys(formGroup.controls).forEach(field => {
    //         console.log(field);
    //         const control = formGroup.get(field);
    //         if (control instanceof FormControl) {
    //             control.markAsTouched({ onlySelf: true });
    //         } else if (control instanceof FormGroup) {
    //             this.validateAllFormFields(control);
    //         }
    //     });
    // }
}