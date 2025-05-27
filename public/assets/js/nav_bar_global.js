$(document).ready(function () {
    var badgeNumberGL = 0;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (username) {
    $('#id-username').text(username); // hoặc chỗ nào bạn hiển thị tên người dùng
}
    const profileImage = localStorage.getItem('profileImage');
            if (profileImage) {
            const avatar = document.getElementById('profile_nav_bar');
            if (avatar) {
                avatar.src = profileImage;
            }
        }

    if (token && username) {
        // Đăng nhập => Hiện profile
        $('#profile').removeClass('d-none');
        $('#auth-buttons').addClass('d-none');
        $('#id-username').text(username);
        $('#id-cart').removeClass("d-none");
        if (profileImage) {
            let profileImageUrl = profileImage ? `/uploads/profile/${profileImage}` : '/assets/images/default-avatar.png';
            $('#avatar-img').attr('src', profileImageUrl);

        }
    } else {
        // Chưa đăng nhập => Hiện login/register
        $('#auth-buttons').removeClass('d-none');
        $('#profile').addClass('d-none');
        $('#id-cart').addClass("d-none");
    }


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
    $('#id_location').click(function() {
        // Chuyển hướng đến trang '/address-page'
        window.location.href = '/address-page'; // Thay '/address-page' bằng URL trang bạn muốn chuyển đến
    });


    function getAllCategories() {
        $.ajax({
            url: '/getAllCategory',
            method: 'GET',
            success: function (res) {
                if (res.status == 200 && res.data.length > 0) {
                    let categoryOptions = '<option value="all" selected>ទំនិញគ្រប់ប្រភេទ</option>';

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

    function updateBadgeNumber(number) {
        var badge = document.getElementById('idBadges');
        if (badge) {
            badge.innerHTML = number;
        }

        showBadgeCartNumber();
    }

    window.getAllCartItems = function getAllCartItems() {
        
        $.ajax({
            url: '/get-all-cart-items',
            method: 'GET',
            success: function (res) {
                // console.log("Success Response:", res); // Thêm dòng này
                // Nếu có dữ liệu trong giỏ hàng
                if (Array.isArray(res.data) && res.data.length > 0) {
                    badgeNumberGL = res.data.length;
                    updateBadgeNumber(badgeNumberGL);
                } else {
                    // Giỏ hàng trống - cập nhật badge = 0, không báo lỗi
                    badgeNumberGL = 0;
                    updateBadgeNumber(badgeNumberGL);
                    // Không hiển thị lỗi vì đây là trường hợp hợp lệ
                }
            },
            error: function (res) {
                console.log("Error Response:", res); // Thêm dòng này
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