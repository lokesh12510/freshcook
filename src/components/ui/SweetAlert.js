import React from 'react';

import sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const swal = withReactContent(sweetalert2);

export const swalAlert = (options) => {
    return swal.fire(options);
}

export const successAlert = (text) => {
    return swalAlert({
        title: '',
        html: text,
        icon: 'success',
        timer: 10000,
    });
}

export const errorAlert = (text) => {
    return swalAlert({
        title: '',
        html: text,
        icon: 'error',
        timer: 10000,
    });
}

export const warningAlert = (text) => {
    return swalAlert({
        title: '',
        html: text,
        icon: 'warning',
        timer: 10000,
    });
}

export const infoAlert = (text) => {
    return swalAlert({
        title: '',
        html: text,
        icon: 'info',
        timer: 10000,
    });
}

export const deleteConfirm = () => {
    return swalAlert({
        html: 'Are you sure you want to delete?',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    });
}