$(document).ready(function () {
    const usernameGL = document.querySelector('meta[name="username"]').content;
    const phoneNumberGL = document.querySelector('meta[name="phone_number"]').content;
    const emailGL = document.querySelector('meta[name="email"]').content;

    const orderIds = [];
    let processCountGL = 0;
    let toShipCountGL = 0;


    $('#id-edit-info').on('click', function () {
        $.confirm({
            title: '<strong>Edit Information</strong>',
            content: `
                <form id="editInfoForm" class="formName">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" placeholder="Enter your name" class="form-control" required />
                    </div>
                    <div class="form-group mt-3">
                        <label for="phone">Phone Number</label>
                        <input type="text" id="phone" placeholder="Enter your phone number" class="form-control" required />
                    </div>
                    <div class="form-group mt-3">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" class="form-control" required />
                    </div>
                    <div class="form-group mt-3">
                        <label for="profile-image">Profile Image</label>
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
                    text: 'Submit',
                    action: function () {
                        alert('we\'re in development !!');
                        var name = this.$content.find('#name').val();
                        var phone = this.$content.find('#phone').val();
                        var email = this.$content.find('#email').val();
                        var profileImage = this.$content.find('#profile-image')[0].files[0];

                        if (!name || !phone || !email) {
                            $.alert('Please fill all the fields.');
                            return false;
                        }

                        // Handle submission logic here
                        console.log("Name:", name);
                        console.log("Phone:", phone);
                        console.log("Email:", email);

                        // Handle profile image upload if necessary
                        if (profileImage) {
                            console.log("Profile Image:", profileImage.name);
                            // Optionally, create a FormData object for AJAX submission
                            const formData = new FormData();
                            formData.append('name', name);
                            formData.append('phone', phone);
                            formData.append('email', email);
                            formData.append('profile-image', profileImage);

                            // Example AJAX submission
                            /*
                            $.ajax({
                                url: '/update-info',
                                type: 'POST',
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function(response) {
                                    // Handle response
                                }
                            });
                            */
                        }
                    }
                },
                no: {
                    text: 'Cancel',
                    action: function () { }
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
                    $('#id-link-to-order-history').on('click', function (e) {
                        e.preventDefault();

                        alert('we don\'t have Items, please order some items');
                    });
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
