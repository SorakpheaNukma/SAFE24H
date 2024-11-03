function showLoading() {
    $('#loadingSpinner').show();
    $('#btn-verify-otp').hide();
}
function hideLoading() {
    $('#loadingSpinner').hide();
    $('#btn-verify-otp').show();
}

function verifyOTP(email, otp) {
    showLoading();

    $.ajax({
        url: '/verify-otp',
        type: 'POST',
        data: {
            email: email,
            otp: otp,
        },
        success: function (res) {
            hideLoading();

            if (res.status === 200) {
                window.location.href = `/reset-password-page?email=${email}`;
            } else {
                showError('Something went wrong can\'t verify otp', res);
            }
        },
        error: function (res) {
            hideLoading();

            if (res.status === 422) {
                let error = res.responseJSON.error;
                let firstError = Object.values(error)[0][0];
                showError(firstError);
            } else if (res.status === 500) {
                showError('An error occurred. Please try again later.');
            } else {
                showError('Something went wrong. Please try again later.');
            }
        }
    });
}

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function checkEmailEmpty(email) {
    if (!email) {
        // (/ is welcome page)
        window.location.href = '/';
        return;
    }
}

$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var getEmailPara = getParameterByName('email');
    checkEmailEmpty(getEmailPara);

    $('#btn-verify-otp').on('click', function (e) {
        e.preventDefault();
        var getOTP = $('#id-input-otp').val();

        if (!getOTP) {
            alert('Please enter your OTP');
            return;
        }

        verifyOTP(getEmailPara, getOTP);
    });

    //

});