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
                    showSuccess('បានធ្វើបច្ចុប្បន្នភាពអាសយដ្ឋានដោយជោគជ័យ🎉');
                } else {
                    showError('បានធ្វើបច្ចុប្បន្នភាពអាសយដ្ឋានដោយជោគជ័យ');
                }
            },
            error: function (res) {
                let errorMessage = 'មានបញ្ហាអ្វីមួយកើតឡើង!';

                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    let firstError = Object.values(error)[0][0];
                    errorMessage = firstError;
                } else if (res.status === 500) {
                    errorMessage = 'មានបញ្ហាផ្នែកម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀត!';
                }

                showError(errorMessage);
            }
        });
    }
    function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'ជោគជ័យ!',
        text: message,
        confirmButtonText: 'យល់ព្រម',
        confirmButtonColor: '#3085d6'
    });
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'បរាជ័យ!',
        text: message,
        confirmButtonText: 'បិទ',
        confirmButtonColor: '#d33'
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
    // Khởi tạo bản đồ Leaflet tại phần tử có id="map"
const map = L.map('map').setView([11.5564, 104.9282], 13); // Phnom Penh mặc định

// Tile từ OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Tạo biến để chứa marker
let marker;

// Nếu trình duyệt hỗ trợ định vị, dùng vị trí thật
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        map.setView([lat, lon], 16);
        marker = L.marker([lat, lon]).addTo(map);

        reverseGeocode(lat, lon);
    });
}

// Click để chọn vị trí trên bản đồ
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    reverseGeocode(lat, lng);
});

// Nút lấy vị trí hiện tại
$('#getLocationBtn').on('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            map.setView([lat, lon], 16);
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }

            reverseGeocode(lat, lon);
        });
    } else {
        alert('Browser does not support geolocation.');
    }
});

// Lấy địa chỉ từ toạ độ (reverse geocode)
function reverseGeocode(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
            const address = data.display_name || '';
            $('#more-address').val(address);
        })
        .catch(err => {
            console.error('Reverse geocoding failed:', err);
        });
}

});