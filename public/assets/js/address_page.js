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

        updateAddress(address, country);
    });


    ////////////////////////////// here for map 
    // function setMapIframe(lat, lng) {
    //     const iframe = document.getElementById('google-map-iframe');

    //     document.getElementById('map-message').style.display = 'none';
    //     iframe.style.display = 'block';
    // }

    // function showMapOrMessage(accuracy, lat, lng) {
    //     const iframe = document.getElementById('google-map-iframe');
    //     const message = document.getElementById('map-message');
    //     if (accuracy < 350) {
    //         setMapIframe(lat, lng);
    //         iframe.style.display = 'block';
    //         message.style.display = 'none';
    //     } else {
    //         iframe.style.display = 'none';
    //         message.style.display = 'block';
    //     }
    // }

    // function goToCurrentLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             const lat = position.coords.latitude;
    //             const lng = position.coords.longitude;
    //             const accuracy = position.coords.accuracy;
    //             showMapOrMessage(accuracy, lat, lng);
    //         }, (error) => {
    //             alert("Unable to retrieve your location.");
    //         });
    //     } else {
    //         alert("Geolocation is not supported by this browser.");
    //     }
    // }


    // goToCurrentLocation();
    // ////////////////////////////// end of map
});