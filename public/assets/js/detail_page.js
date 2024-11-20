
let currentIndex = 0;
const itemsPerPage = 10;
var quantityInputGL = 0;
const user_idGL = document.querySelector('meta[name="user_id"]').content;

function loadItemsRecommend(items) {
    const itemsGrid = document.getElementById('recommend-items-grid');
    itemsGrid.innerHTML = ''; // Clear existing content

    if (!items || items.length === 0) {
        itemsGrid.innerHTML = `<p>No recommendations available at the moment.</p>`;
        return;
    }

    const dmain = window.location.origin;
    const itemsToLoad = items.slice(currentIndex, currentIndex + itemsPerPage);

    itemsToLoad.forEach((item, i) => {
        const image = `
            <a href="javascript:void(0);" class="product-link" data-product-index="${i}">
                <img src="${dmain}/uploads/products/${item.images[0] || 'default-image.jpg'}" alt="${item.product_name}">
            </a>
        `;

        const html = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-5-custom p-2">
                <div class="grid-item" data-product-index="${i}">
                    <div class="image-container">
                        ${image}
                    </div>
                    <div class="product-title">${item.product_name}</div>
                    <div class="product-description">${item.descriptions.des_1 || ''}</div>
                    <div class="product-price-rating d-flex align-items-center">
                        <div class="product-price">\$${item.product_price}</div>
                        <div class="product-rating d-flex align-items-center">
                            <img src="assets/images/Star.png" alt="Star" style="margin-right: 5px;">
                            <span style="color: black; font-weight: bold;">4.5</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        itemsGrid.innerHTML += html;
    });

    currentIndex += itemsPerPage;

    // Handle "View More" button visibility
    const viewMoreContainer = document.getElementById('view-more-container');
    if (currentIndex >= items.length) {
        viewMoreContainer.style.display = 'none';
    } else {
        viewMoreContainer.style.display = 'block';
    }

    // Add click event listener to each product link
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const index = link.getAttribute('data-product-index');
            const item = items[index];

            const productDetailUrl = `/details-page?item=${JSON.stringify(item)}&img=${item.images.join(',')}`;
            window.location.href = productDetailUrl;
        });
    });
}



function getProductRecommend(productId) {
    const itemsGrid = document.getElementById('recommend-items-grid');
    itemsGrid.innerHTML = '<p>Loading recommendations...</p>';

    $.ajax({
        url: '/products-recommendations',
        method: 'GET',
        data: {
            'product_id': productId,
        },
        success: function (res) {
            if (res.status === 200) {
                loadItemsRecommend(res.data);

            } else {
                showError("Failed to get product recommendations!");
                itemsGrid.innerHTML = `<p>Failed to load recommendations.</p>`;
            }
        },
        error: function (res) {
            itemsGrid.innerHTML = `<p>Error loading recommendations. Please try again later.</p>`;
            if (res.status === 422) {
                const error = res.responseJSON.error;
                const firstError = Object.values(error)[0][0];
                showError(firstError);
            } else if (res.status === 500) {
                showError('An error occurred. Please try again later.');
            } else {
                showError('Something went wrong!');
            }
        }
    });
}

function goBackHome() {
    window.location.href = '/home-page';
}

function addMoreItems() {
    loadItemsRecommend();
}

function btnMinusQuantityProduct() {
    document.getElementById('minusBtn').addEventListener('click', function () {
        let input = document.getElementById('id-quantityInput');
        let value = parseInt(input.value);
        if (value >= 1) {
            input.value = value - 1;
        }

        quantityInputGL = $('#id-quantityInput').val();
    });
}

function btnAddQuantityProduct() {
    document.getElementById('plusBtn').addEventListener('click', function () {
        let input = document.getElementById('id-quantityInput');
        let value = parseInt(input.value);
        input.value = value + 1;

        quantityInputGL = $('#id-quantityInput').val();
    });
}

function checkAddress(callback) {
    $.ajax({
        url: '/me-info',
        method: 'GET',
        success: function (res) {
            if (res.status === 200 && res.data) {
                const user = res.data;

                // Check if the address field is null or empty
                if (user.address === null || user.address === '') {
                    console.log('User does not have an address.');
                    callback(false);
                } else {
                    callback(true);
                }
            } else {
                showError('Failed to retrieve user address information!');
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


function btnBuyNow(quantityStock) {
    $('#id-btn-buy-now').on('click', function (e) {
        e.preventDefault();

        if (quantityInputGL === 0) {
            alert('Please add quantity before buying!');
            return;
        }

        if (quantityStock === 0) {
            alert('This product is out of stock');
            return;
        }

        // First, check if the user has an address
        checkAddress(function (hasAddress) {
            if (hasAddress) {
                // If user has an address, proceed to "Buy Now" page
                var { productData, images } = getItemDataFromUrl();
                var newProduct = {
                    product_id: productData.product_id,
                    product_name: productData.product_name,
                    product_price: productData.product_price,
                    quantity: quantityInputGL
                };

                window.location.href = `/buy-now-page?detail=true&items=${JSON.stringify(newProduct)}&images=${images}`;
            } else {
                //
                $.confirm({
                    title: '<strong>Warning!</strong>',
                    content: 'You don\'t have an address yet. Would you like to go to set up an address?',
                    draggable: true,
                    columnClass: 'm',
                    typeAnimated: true,
                    type: 'blue',
                    buttons: {
                        yes: function () {
                            window.location.href = '/address-page';
                        },
                        no: function () {
                        }
                    }
                });
            }
        });
    });
}


function getItemDataFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const itemData = params.get('item');
    const imgData = params.get('img');

    const productData = JSON.parse(itemData);

    // Split the images if there are multiple images passed as a comma-separated string
    const images = imgData ? imgData.split(',') : [];

    return { productData, images };
}

function displayProductDesDetails(descriptions) {
    const desContent = document.getElementById('product-detail-id');

    desContent.innerHTML = '';

    if (descriptions && typeof descriptions === 'object') {
        let descriptionHTML = '<ul>';

        Object.keys(descriptions).forEach(function (key) {
            descriptionHTML += `<li>${descriptions[key]}</li>`;
        });

        descriptionHTML += '</ul>';

        desContent.innerHTML = descriptionHTML;
    } else {
        desContent.innerHTML = '<p>No descriptions available.</p>';
    }
}

function displsyImgAbout(Images) {
    const dvImg = document.getElementById('id-img-about');
    const dmain = window.location.origin;

    dvImg.innerHTML += ` <img width="80%" src="${dmain}/uploads/products/${Images}" class="img-fluid">`;
}

function displayProductImages(ProductsImages) {
    var dvProductImages = document.getElementById('id-product-images');
    var dmain = window.location.origin;
    dvProductImages.innerHTML = '';

    if (ProductsImages.length > 0) {
        ProductsImages.forEach((image, index) => {
            const activeClass = index === 0 ? 'active' : '';  // Set first image as active
            dvProductImages.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <div class="my-image-container">
                        <img src="${dmain}/uploads/products/${image}" class="d-block" alt="Product Image">
                    </div>
                </div>
            `;
        });
    } else {
        console.log('No images found.');
        dvProductImages.innerHTML += `
            <div>
                <p>No images found.</p>
            </div>
        `;
    }
}



$(document).ready(function () {

    var { productData, images } = getItemDataFromUrl();

    $('#id-sold').text(productData.sold + " Sold");

    getProductRecommend(productData.product_id);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function addItemToCarts(user_id, product_id, quantity) {
        $.ajax({
            url: '/add-to-cart',
            method: 'POST',
            data: {
                'user_id': user_id,
                'product_id': product_id,
                'quantity': quantity,
            },
            success: function (res) {
                if (res.status == 200) {
                    getAllCartItems();

                    showSuccess(res.message);
                } else {
                    showError('Fails to add to Cart.');
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

    function btnAddToCart(quantityStock) {
        $('#id-btn-add-to-cart').on('click', function (e) {
            e.preventDefault();

            if (quantityStock === 0) {
                alert('This product is out of stock');
                return;
            }

            if (quantityInputGL > 0) {
                addItemToCarts(user_idGL, productData.product_id, quantityInputGL);
            } else {
                alert('Please add items for add to cart');
                return;
            }
        });
    }


    $('#id-product-name').text(productData.product_name);
    $('#id-price').text(`$${productData.product_price}`);
    displayProductDesDetails(productData.descriptions);

    displsyImgAbout(images[0]);
    displayProductImages(images);

    loadItemsRecommend();
    btnAddQuantityProduct();
    btnMinusQuantityProduct();

    btnBuyNow(productData.quantity);
    btnAddToCart(productData.quantity);

    if (!images.length > 0) {
        console.log('No images found.');
    }
});
