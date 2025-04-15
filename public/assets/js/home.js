$(document).ready(function () {
    let productsLsGL = [];
    const itemsPerPage = 30; //show so luong
    let currentItemsCount = 0;
    let isSearchActive = false;
    let currentHeaderTitle = 'All Products';


    function initializeDefaultCategory() {
        const defaultCategoryId = "all";
        const defaultHeaderTitle = "ទំនិញទាំងអស់"; //ở đây là chỉnh

        // Set dropdown to default
        $('#categoryDropdown').val(defaultCategoryId);

        // Set header title to default
        $('#id-title-header').text(defaultHeaderTitle);
    }

    function getAllProducts(callback) {
        showSpinner();

        $.ajax({
            url: '/getAllProducts',
            method: 'GET',
            success: function (res) {
                if (res.status == 200) {
                    productsLsGL = [];

                    res.data.forEach(function (p) {
                        productsLsGL.push({
                            product_id: p.product_id,
                            product_name: p.product_name,
                            product_price: p.product_price,
                            sold: p.sold,
                            category_id: p.category_id,
                            category_name: p.category_name,
                            quantity: p.quantity,
                            images: p.images && Array.isArray(p.images) ? p.images : [],
                            descriptions: p.descriptions || {},
                        });
                    });

                    setTimeout(() => {
                        hideSpinner();
                    }, 200);

                    populateGrid();
                    initializeDefaultCategory();

                    if (callback) callback();
                } else {
                    hideSpinner();
                    $.alert('Failed to get product!');
                }
            },
            error: function (res) {
                hideSpinner();
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

    getAllProducts(ifSearchedProductsFromURl);

    window.performSearch = function performSearch(searchInput) {
        isSearchActive = !!searchInput;
        if (isSearchActive) {

            const filteredProducts = productsLsGL.filter(product =>
                product.product_name.toLowerCase().includes(searchInput.toLowerCase()) ||
                Object.values(product.descriptions).some(desc =>
                    desc.toLowerCase().includes(searchInput.toLowerCase())
                )
            );

            currentHeaderTitle = `ការស្វែងរក: ${filteredProducts.length}`;
            $('#id-title-header').text(currentHeaderTitle);
            currentItemsCount = 0;
            populateGrid(filteredProducts);
        } else {
            resetHeaderAndGrid();
        }
    };

    function ifSearchedProductsFromURl() {
        const searchQuery = new URLSearchParams(window.location.search).get('search');

        if (searchQuery) {
            $('.form-control').val(searchQuery);
            performSearch(searchQuery);
        }
    }


    // Filter products based on the selected category on nav_bar_global.js
    $('#categoryDropdown').on('change', function () {
        const selectedCategoryId = $(this).val();
        const selectedCategoryName = $(this).find('option:selected').data('category-name');
        isSearchActive = false;

        currentHeaderTitle = selectedCategoryId === "all" ? 'All Products' : selectedCategoryName;
        $('#id-title-header').text(currentHeaderTitle);
        currentItemsCount = 0;
        selectedCategoryId === "all" ? populateGrid() : filterProductsByCategory(selectedCategoryId);
    });

    function resetHeaderAndGrid() {
        currentHeaderTitle = 'All Products';
        $('#id-title-header').text(currentHeaderTitle);
        currentItemsCount = 0;
        populateGrid();
    }

    // Function to filter products by category
    function filterProductsByCategory(categoryId) {
        const filteredProducts = productsLsGL.filter(product => product.category_id == categoryId);
        populateGrid(filteredProducts);
    }


    function changeArrowDownAndUp() {
        $('.nav-link.dropdown-toggle').on('click', function () {
            var $icon = $('#dropdown-icon');
            if ($(this).attr('aria-expanded') === 'true') {
                $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            } else {
                $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
        });
    }
    changeArrowDownAndUp();

    function showSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.visibility = 'visible';
        spinner.style.opacity = '1';
        spinner.style.backgroundColor = 'white';
    }

    function hideSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.opacity = '0';
        spinner.style.visibility = 'hidden';
    }

    // Function to populate the grid, accepts filtered products if provided
    function populateGrid(filteredProducts = productsLsGL) {
        const grid = document.getElementById('gridContainer');
        let html = '';
        const dmain = window.location.origin;

        // if (!filteredProducts || filteredProducts.length === 0) {
        //     grid.innerHTML = '<p class="text-center">No products found.</p>';
        //     $('#viewMore').hide();
        //     return;
        // }
        
        // Calculate the end index for pagination
        const end = Math.min(currentItemsCount + itemsPerPage, filteredProducts.length);

        for (let i = currentItemsCount; i < end; i++) {
            const item = filteredProducts[i];
            const image = `
                <a>
                    <img src="${dmain}/uploads/products/${item.images[0]}" alt="${item.product_name}">
                </a>
            `;

            html += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-5-custom">
                    <div class="grid-item" data-product-index="${i}">
                        <div class="image-container">
                            ${image} 
                        </div>
                        <div class="item-description">
                            <div>
                                <div class="product-title">${item.product_name}</div>
                            </div>
                            <div style="display:flex; flex-direction:row;">
                                <div style="display:flex; flex-direction:column;">
                                    <div class="product-price">\$${item.product_price}</div>
                                </div>
                                <div style="display:flex; justify-content: center; align-items: center; margin-left: auto;">
                                    <div class="product-description">${item.descriptions.des_1 || ''}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        grid.innerHTML = html; // Replace the grid with filtered products
        currentItemsCount = end;

        // Show or hide the "View More" button based on the number of products
        // if (filteredProducts.length <= itemsPerPage) {
        //     $('#viewMore').hide();
        // } else {
        //     $('#viewMore').show();
        // }

        // Attach click handler to the grid container
        grid.addEventListener('click', function (e) {
            const gridItem = e.target.closest('.grid-item');
            if (gridItem) {
                const index = gridItem.getAttribute('data-product-index');
                const item = filteredProducts[index];

                const productDetailUrl = `/details-page?item=${JSON.stringify(item)}&img=${item.images.join(',')}`;
                window.location.href = productDetailUrl;
            }
        });

        // if (currentItemsCount >= filteredProducts.length) {
        //     $('#viewMore').hide();
        // }
    }

    // $('#viewMore').on('click', function () {
    //     populateGrid();
    // });

    //banner images
    $.ajax({
        url: 'http://127.0.0.1:8000/banner-images', // Địa chỉ API của bạn
        method: 'GET', // Phương thức GET để lấy dữ liệu
        success: function (res) {
            if (res.status === 200) {
                // Xử lý dữ liệu
                const imagesLsGL = [];

                // Nếu res.data là một mảng ảnh
                res.data.forEach(function (img) {
                    imagesLsGL.push({
                        banner_images_id: img.banner_images_id,
                        image_path: img.image_path,
                        create_at: img.create_at,
                        update_at: img.update_at,
                    });
                });

                setTimeout(() => {
                    hideSpinner();  // Ẩn spinner sau khi load xong dữ liệu
                }, 200);

                populateGallery(imagesLsGL); // Hàm hiển thị gallery
            } else {
                hideSpinner();
                $.alert('Failed to get banner images!');
            }
        },
        error: function (res) {
            hideSpinner();
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

    let currentIndex = 0;
    let imagesList = [];

    function populateGallery(images) {
        const gallery = $('#gallery');
        const dmain = window.location.origin;

        // Reset danh sách ảnh tránh lặp
        imagesList = [];

        // Xóa nội dung cũ
        gallery.empty();

        if (images.length === 0) return;

        // Thêm ảnh đầu tiên vào gallery
        const img = $('<img>', {
            src: `${dmain}/uploads/products/${images[0].image_path}`,
            alt: 'Gallery Image',
            class: 'gallery-image'
        });

        gallery.append(img);

        // Lưu danh sách đường dẫn ảnh
        images.forEach(image => {
            imagesList.push(`${dmain}/uploads/products/${image.image_path}`);
        });

        // Bắt đầu slideshow
        startSlideshow();
    }

    function startSlideshow() {
        if (imagesList.length === 0) return;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % imagesList.length;

            // Chuyển đổi ảnh với hiệu ứng fade
            $('#gallery img').fadeOut(500, function () {
                $(this).attr('src', imagesList[currentIndex]).fadeIn(500);
            });
        }, 3000); // Chuyển ảnh mỗi 3 giây
    }
}); 
