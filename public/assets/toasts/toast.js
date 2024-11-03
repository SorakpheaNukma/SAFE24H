
// Toastr Notif
function showSuccess(message) {
    toastr.success(message, 'Success', {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
    });
}

function showSuccess1(message) {
    toastr.success(message, 'Success', {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 0,
        extendedTimeOut: 0
    });
}


function showError(message) {
    toastr.error(message, 'Error', {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
    });
}

function showWarning(message) {
    toastr.warning(message, 'Warning', {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
    });
}

function showInfo(message) {
    toastr.info(message, 'Info', {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
    });
}
