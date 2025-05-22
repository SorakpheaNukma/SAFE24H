$(document).ready(function () {
    ///
    const addressGL = document.querySelector('meta[name="address"]').content;
    const countryGL = document.querySelector('meta[name="country"]').content;


    if (addressGL !== undefined || addressGL !== null) {
        $('#more-address').val(addressGL);
    }

    if (countryGL) {
        const matchingOption = $('#country option[value="' + countryGL + '"]');

        if (matchingOption.length) {
            $('#country').val(countryGL);
        }
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function updateAddress(address, country) {
        $.ajax({
            url: '/update-address',
            method: 'PUT',
            data: {
                'address': address,
                'country': country,
            },
            success: function (res) {
                if (res.status === 200) {
                    showSuccess('update address successfully🎉');
                } else {
                    showError('Failed to update addresss!');
                }
            },
            error: function (res) {
                let errorMessage = 'Something went wrong!';

                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    let firstError = Object.values(error)[0][0];
                    errorMessage = firstError;
                } else if (res.status === 500) {
                    errorMessage = 'An error occurred. Please try again later.';
                }

                showError(errorMessage);
            }
        });
    }


    $('#saveAddressButton').on('click', function (e) {
        e.preventDefault();
        let country = $('#country').val();
        let address = $('#more-address').val();

        if (country === '' || address === '') {
            alert('Please fill More address or country');
            return false;
        }
        localStorage.setItem('selectedProvince', country);

        updateAddress(address, country);
    });

});