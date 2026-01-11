$(document).ready(function () {
    const rememberCheckbox = $('#remember');
    const emailInput = $('#email');
    const passwordInput = $('#password');

    if (localStorage.getItem('rememberMe') === 'true') {
        rememberCheckbox.prop('checked', true);
        emailInput.val(localStorage.getItem('rememberedEmail') || '');
        passwordInput.val(localStorage.getItem('rememberedPassword') || '');
    }

    rememberCheckbox.on('change', function () {
        if (rememberCheckbox.is(':checked')) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedEmail', emailInput.val());
            localStorage.setItem('rememberedPassword', passwordInput.val());
        } else {
            clearLocal();
        }
    });

    function clearLocal() {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
    }

    emailInput.on('input', function () {
        if (rememberCheckbox.is(':checked')) {
            localStorage.setItem('rememberedEmail', emailInput.val());
        }
    });

    passwordInput.on('input', function () {
        if (rememberCheckbox.is(':checked')) {
            localStorage.setItem('rememberedPassword', passwordInput.val());
        }
    });

    //
    $('#togglePassword').on('click', function () {
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);

        $('#toggleIcon').toggleClass('fa-eye-slash fa-eye');
    });

    function showLoading() {
        $('#loadingSpinner').show();
        $('#loginButton').hide();
    }
    function hideLoading() {
        $('#loadingSpinner').hide();
        $('#loginButton').show();
    }


    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    var resetSuccess = getParameterByName('reset');
    if (resetSuccess) {
        showSuccess('Password reset successful. You can now login.');
    }

    $('#loginButton').on('click', function (event) {
        event.preventDefault();
        showLoading();

        var formData = {
            "email": $('#email').val(),
            "password": $('#password').val()
        }
        $.ajax({
            url: '/login',
            method: 'POST',
            data: formData,
            success: function (res) {
                hideLoading();
                localStorage.removeItem("token");
                localStorage.setItem("token", res.token);
                localStorage.removeItem("user_id");
                localStorage.setItem("user_id", res.user_id);
                localStorage.removeItem("username");
                localStorage.setItem("username", res.username);
                localStorage.removeItem("is_logged_in");
                localStorage.setItem('is_logged_in', 'true');

                if (res.token) {
                    window.location.href = res.redirect_url;
                }
            },
            error: function (res) {
                hideLoading();

                if (res.status === 422) {
                    let errors = res.responseJSON.errors;
                    let firstError = Object.values(errors)[0][0];
                    showError(firstError);
                } else if (res.status === 402) {
                    showError(res.responseJSON.errors);
                } else {
                    showError('An error occurred. Please try again later.');
                }
            }
        });
    });


    function notifi() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            clearLocal();
            emailInput.val('');
            passwordInput.val('');
            showSuccess('Sign up successfully🎉');

            urlParams.set('success', 'false');
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            window.history.pushState(null, '', newUrl);
        }
    }
    notifi();
});
