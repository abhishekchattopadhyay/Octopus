import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    ReactiveFormsModule
} from '@angular/forms';


@Component({
    selector: 'add-dma',
    templateUrl: './adddma.component.html'
})
export class adddma implements OnInit {
    Dmaform: FormGroup;
  
    constructor(private formBuilder: FormBuilder) {}
  
    ngOnInit() {
      this.Dmaform = this.formBuilder.group({
        name: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        address: this.formBuilder.group({
          street: [null, Validators.required],
          street2: [null],
          zipCode: [null, Validators.required],
          city: [null, Validators.required],
          state: [null, Validators.required],
          country: [null, Validators.required]
        })
      });
    }
  
    isFieldValid(field: string) {
      return !this.Dmaform.get(field).valid && this.Dmaform.get(field).touched;
    }
  
    displayFieldCss(field: string) {
      return {
        'has-error': this.isFieldValid(field),
        'has-feedback': this.isFieldValid(field)
      };
    }
  
    onSubmit() {
      console.log(this.Dmaform);
      if (this.Dmaform.valid) {
        console.log('form submitted');
      } else {
        this.validateAllFormFields(this.Dmaform);
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
  
    reset(){
      this.Dmaform.reset();
    }
  }