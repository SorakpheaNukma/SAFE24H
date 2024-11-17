$(document).ready(function () {
    window.getAllUsers = function getAllUsers(callback = null) {
        $.ajax({
            url: '/get-all-users',
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    if (callback && typeof callback === 'function') {
                        callback(res.data);
                    }
                } else {
                    alert('Failed get users!!');
                }
            },
            error: function (res) {
                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    let firstError = Object.values(error)[0][0];
                    showError(firstError);
                } else if (res.status === 500) {
                    showError('An error occurred. Please try again later.');
                } else {
                    showError('Something went wrong!');
                }
            }
        });
    };
});
