$(document).ready(function () {
    var badgeNumberGL = 0;

    function ProfileSettings() {
        $('#id-profile').on('click', function (e) {
            e.preventDefault();

            window.location.href = '/profile-page';
        });

        $('#id-logout').on('click', function (e) {
            logOut();
        });
    }
    ProfileSettings();

    function clearAndRemove() {
        localStorage.removeItem('username');
        sessionStorage.removeItem("token");
    }

    function logOut() {
        clearAndRemove();
        $.ajax({
            url: '/logout',
            method: 'GET',
            success: function (res) {
                window.location.href = res.redirect_url;
            },
            error: function (res) {
                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    let firstError = Object.values(error)[0][0];
                    showError(firstError);
                } else if (res.status === 402) {
                    showError(res.responseJSON.error);
                } else {
                    showError('An error occurred. Please try again later.');
                }
            }
        });
    }

    $('#id-btn-search').on('click', function () {
        // Get the value from the search input field
        const searchInput = $('.form-control').val().trim();
        const currentPath = window.location.pathname;

        if (!currentPath.includes('/home-page')) {
            window.location.href = `/home-page?search=${searchInput}`;
        }

        window.performSearch(searchInput);
    });


    function getAllCategories() {
        $.ajax({
            url: '/getAllCategory',
            method: 'GET',
            success: function (res) {
                if (res.status == 200 && res.data.length > 0) {
                    let categoryOptions = '<option value="all" selected>All Categories</option>';

                    res.data.forEach(category => {
                        categoryOptions += `<option value="${category.category_id}" data-category-name="${category.category_name}">${category.category_name}</option>`;
                    });

                    $('#categoryDropdown').html(categoryOptions);
                } else {
                    $('#categoryDropdown').html('<option selected>N/A</option>');
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
                    showError('Something went wrong!!');
                }
                // If the request fails, show N/A in the category dropdown
                $('#categoryDropdown').html('<option selected>N/A</option>');
            }
        });
    }

    getAllCategories();

    function showBadgeCartNumber() {
        var badge = document.getElementById('idBadges');
        if (badge) {
            badge.classList.remove('d-none');
        }
    }

    function hideBadgeCartNumber() {
        var badge = document.getElementById('idBadges');
        if (badge) {
            badge.classList.add('d-none');
        }
    }

    function updateBadgeNumber(number) {
        var badge = document.getElementById('idBadges');
        if (badge) {
            badge.innerHTML = number;
        }

        if (number > 0) {
            showBadgeCartNumber();
        } else {
            hideBadgeCartNumber();
        }
    }

    window.getAllCartItems = function getAllCartItems() {
        $.ajax({
            url: '/get-all-cart-items',
            method: 'GET',
            success: function (res) {
                if (res.status == 200) {
                    if (res.data !== null || res.data.length > 0) {
                        badgeNumberGL = res.data.length;
                        updateBadgeNumber(badgeNumberGL);
                    }
                } else {
                    showError('Fails to get Cart Items.');
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
                    showError('Something went wrong!!');
                }
            }
        });
    }

    getAllCartItems();

    function Mycart() {
        $('#id-cart').on('click', function (e) {
            e.preventDefault();

            if (badgeNumberGL == 0) {
                alert('Your cart is empty.');
                return;
            }
            window.location.href = '/cart-page';
        });
    }

    Mycart();

});