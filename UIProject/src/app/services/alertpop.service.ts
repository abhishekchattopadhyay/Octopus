import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class alertpopservice {
    alertwithrevert() {
        return swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Stooooop!',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false,
            reverseButtons: true
        });
    }
    successsave(Item: string) {
        swal(
            'Great job!',
            Item + ' saved successfully!',
            'success'
        );
    }
    successedit(Item: string) {
        swal(
            'Great job!',
            Item + ' edited successfully!',
            'success'
        );
    }
    sucessDeleted(Item: string) {
        swal(
            'Deleted!',
            Item + ' deleted successfully!',
            'success'
        );
    }
    canceled(Item: string) {
        swal(
            'Cancelled',
            'Your ' + Item + ' is safe :)',
            'error'
        );
    }
    errorOccurred() {
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        });
    }
    infoAlert(info: string) {
        swal({
            title: info,
            animation: false,
            customClass: 'animated tada'
        });
    }
}