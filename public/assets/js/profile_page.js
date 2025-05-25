$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    const usernameGL = document.querySelector('meta[name="username"]').content;
    const phoneNumberGL = document.querySelector('meta[name="phone_number"]').content;
    const emailGL = document.querySelector('meta[name="email"]').content;

    const orderIds = [];
    let processCountGL = 0;
    let toShipCountGL = 0;


    $('#id-edit-info').on('click', function () {
    $.confirm({
        title: '<strong>ព័ត៌មានរបស់អ្នក</strong>',
        content: `
            <form id="editInfoForm" class="formName">
                <div class="form-group">
                    <label for="name">ឈ្មោះ</label>
                    <input type="text" id="name" placeholder="សូមបំពេញឈ្មោះ" class="form-control" required />
                </div>
                <div class="form-group mt-3">
                    <label for="phone">លេខទូរស័ព្ទ</label>
                    <input type="text" id="phone" placeholder="សូមបំពេញលេខទូរស័ព្ទ" class="form-control" required />
                </div>
                <div class="form-group mt-3">
                    <label for="email">អ៊ីម៉ែល</label>
                    <input type="email" id="email" placeholder="សូមបំពេញអ៊ីម៉ែល" class="form-control" required />
                </div>
                <div class="form-group mt-3">
                    <label for="profile-image">រូបភាព</label>
                    <input type="file" id="profile-image" class="form-control" accept="image/*" />
                </div>
            </form>
        `,
        draggable: true,
        columnClass: 'm',
        typeAnimated: true,
        type: 'blue',
        buttons: {
            yes: {
                text: 'យល់ព្រម',
                btnClass: 'btn-blue',
                action: function () {
                    const name = this.$content.find('#name').val();
                    const phone = this.$content.find('#phone').val();
                    const email = this.$content.find('#email').val();
                    const profileImage = this.$content.find('#profile-image')[0].files[0];

                    if (!name || !phone || !email) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'សូមបំពេញព័ត៌មាន!',
                            text: 'សូមបំពេញឈ្មោះ, លេខទូរស័ព្ទ និងអ៊ីម៉ែល',
                            confirmButtonText: 'យល់ព្រម'
                        });
                        return false;
                    }

                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('phone', phone);
                    formData.append('email', email);
                    if (profileImage) {
                        formData.append('user_profile', profileImage);
                    }

                    Swal.fire({
                        title: 'កំពុងរក្សាទុក...',
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading()
                    });

                    $.ajax({
                        url: '/update-info',
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: (response) => {
                            Swal.close();

                            $('#profile_name').text(response.username);
                            $('#profile_phone').text(response.phone_number);
                            $('#profile_email').text(response.email);

                            localStorage.setItem("username", response.username);
                            localStorage.setItem("profileImage", response.profile_image);

                            if (profileImage) {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    $('img[src*="profile.png"], img[src*="uploads/profile"]').attr('src', e.target.result);
                                    $('#profile_nav_bar').attr('src', e.target.result);
                                };
                                reader.readAsDataURL(profileImage);
                            }

                            Swal.fire({
                                icon: 'success',
                                title: 'ជោគជ័យ!',
                                text: 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!',
                                confirmButtonText: 'យល់ព្រម'
                            });
                        },
                        error: () => {
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'បរាជ័យ!',
                                text: 'មានបញ្ហា ខណៈពេលកំពុងរក្សាទុកព័ត៌មាន!',
                                confirmButtonText: 'បិទ'
                            });
                        }
                    });
                }
            },
            no: {
                text: 'បោះបង់',
                action: function () { /* nothing */ }
            },
        },
        onOpenBefore: function () {
            this.$content.find('#name').val(usernameGL);
            this.$content.find('#phone').val(phoneNumberGL);
            this.$content.find('#email').val(emailGL);
        },
    });
    });

    function getOrdersCurrentLogin(callback) {
        $.ajax({
            url: '/get-order-current-login',
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    res.data.forEach(order => {
                        orderIds.push(order.order_id);

                        if (order.status === 'processing') {
                            processCountGL++;
                        } else if (order.status === 'shipped') {
                            toShipCountGL++;
                        }
                    });

                    if (processCountGL > 0) {
                        $('#idBadges-processing').text(processCountGL).removeClass('d-none');
                    }
                    if (toShipCountGL > 0) {
                        $('#idBadges-Ship').text(toShipCountGL).removeClass('d-none');
                    }

                    // Call the callback function with `true` to indicate success
                    if (callback) callback(true);
                } else {
                    alert('Failed to retrieve orders');
                    if (callback) callback(false);
                }
            },
            error: function (res) {
                let errorMsg = res.status === 500 ? 'An error occurred. Please try again later.' : 'Something went wrong!';
                showError(errorMsg);
                if (callback) callback(false);
            }
        });
    }

    getOrdersCurrentLogin(function (success) {
        if (success) {
            // ok get more orders items
            getOrderItems(function (orderItems) {

                // Handle the orderItems here
                if (orderItems.length > 0) {
                    goToViewOrderHistoryPage();

                } else {
                    NotifyWhenClick();
                }
            });
        }
    });


    function goToViewOrderHistoryPage() {
        $('#id-link-to-order-history-toShip, #id-link-to-order-history-completed, #id-link-to-order-history-processing').on('click', function (e) {
            e.preventDefault();

            window.location.href = '/order-history-page';
        });
    }

    function NotifyWhenClick() {
        $('#id-link-to-order-history-toShip, #id-link-to-order-history-completed, #id-link-to-order-history-processing').on('click', function (e) {
            e.preventDefault();

            alert('we don\'t have Items, please order some items');
        });
    }

    function getOrderItems(callback) {
        $.ajax({
            url: '/getall-order-items',
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {

                    const filteredItems = res.data.filter(item => orderIds.includes(item.order_id));

                    callback(filteredItems);
                } else {
                    alert('Failed');
                    callback([]);
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
                callback([]);
            }
        });
    }

});
