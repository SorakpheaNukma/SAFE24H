function showLoading() {
    $('#loadingSpinner').show();
    $('#id-btn-otp').hide();
}
function hideLoading() {
    $('#loadingSpinner').hide();
    $('#id-btn-otp').show();
}

$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#id-btn-otp').on('click', function (e) {
        e.preventDefault();
        var email = $('#email').val();
        if (!email) {
            alert('Please enter your email address');
            return false;
        }
        showLoading();

        $.ajax({
            url: '/send-otp',
            type: 'POST',
            data: {
                email: email
            },
            success: function (res) {
                hideLoading();
                if (res.status === 200) {
                    $('#email').val('');

                    window.location.href = `/otp-page?email=${email}`;
                } else {
                    showError('Something went wrong can\'t send otp', res);
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
    });
});