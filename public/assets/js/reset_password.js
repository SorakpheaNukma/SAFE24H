function showLoading() {
    $('#loadingSpinner').show();
    $('#btn-reset-pass').hide();
}
function hideLoading() {
    $('#loadingSpinner').hide();
    $('#btn-reset-pass').show();
}

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    var getEmailParameter = getParameterByName('email');

    if (!getEmailParameter) {
        // (/ is welcome page)
        window.location.href = '/';
        return;
    }

    $('#btn-reset-pass').on('click', function (e) {
        e.preventDefault();
        showLoading();

        var newPassword = $('#new-password').val();
        var confirmPassword = $('#confirm-password').val();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            hideLoading();
            return;
        }

        $.ajax({
            url: '/reset-password',
            type: 'POST',
            data: {
                email: getEmailParameter,
                new_password: newPassword,
            },
            success: function (res) {
                console.log('success', res);
                hideLoading();
                if (res.status === 200) {
                    window.location.href = '/login?reset=true';
                } else {
                    showError('Something went wrong. Please try again.');
                }
            },
            error: function (res) {
                hideLoading();
                console.log('error', res);

                if (res.status === 422) {
                    let error = res.responseJSON.errors;
                    let firstError = Object.values(error)[0][0];
                    showError(firstError);
                } else {
                    showError('An error occurred. Please try again later.');
                }
            }
        });
    });
});
