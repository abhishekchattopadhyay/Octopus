import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class alertpopservice {
    alertwithrevert(): boolean {
        let flag: boolean = true;
        swal({
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
        }).then((result) => {
            if (result.value) {
                flag = true;
            } else if (
                // Read more about handling dismissals
                result.dismiss === swal.DismissReason.cancel
            ) {
                flag = false;
            }
        });
        return flag;
    }
    successsave() {
        swal(
            'Great job!',
            'Data saved successfully!',
            'success'
        );
    }
    successedit() {
        swal(
            'Great job!',
            'Data edited successfully!',
            'success'
        );
    }
    sucessDeleted() {
        swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
        );
    }
    canceled() {
        swal(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
        );
    }
}