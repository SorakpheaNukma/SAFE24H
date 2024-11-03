$(document).ready(function () {
    function showLoading() {
        $('#loadingSpinner').show();
        $('#signupButton').hide();
    }

    function hideLoading() {
        $('#loadingSpinner').hide();
        $('#signupButton').show();
    }

    $('#signupButton').on('click', function (e) {
        e.preventDefault();
        showLoading();

        let formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            password: $('#password').val(),
            password_confirmation: $('#ConfirmPassword').val(),
        };

        $.ajax({
            url: '/sign-up',
            method: 'POST',
            data: formData,
            success: function (res) {
                hideLoading();

                if (res.message) {
                    window.location.href = '/login?success=true';
                } else if (res.error) {
                    showError(res.error);
                }
            },
            error: function (res) {
                hideLoading();

                if (res.status === 422) {
                    let errors = res.responseJSON.errors;
                    let firstError = Object.values(errors)[0][0];
                    showError(firstError);
                } else {
                    showError('An error occurred. Please try again later.');
                }
            }
        });
    });

});
