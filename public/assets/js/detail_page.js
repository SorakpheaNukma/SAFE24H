
let currentIndex = 0;
const itemsPerPage = 10;
var quantityInputGL = 0;
const user_idGL = document.querySelector('meta[name="user_id"]').content;

function loadItemsRecommend() {
    const itemsGrid = document.getElementById('recommend-items-grid');
    itemsGrid.innerHTML = 'please wait...., we\'re on development ';

    // // Determine the number of items to load
    // const itemsToLoad = items.slice(currentIndex, currentIndex + itemsPerPage);

    // itemsToLoad.forEach(item => {
    //     const itemDiv = document.createElement('div');
    //     itemDiv.classList.add('col-lg-5-custom', 'col-6', 'p-2');

    //     const link = document.createElement('a');
    //     link.href = '#';
    //     link.classList.add('text-decoration-none');
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         alert(`You clicked on ${item.title}`);
    //         // Simulate navigating to a new page
    //         window.location.href = link.href;
    //     });

    //     // Create the inner HTML content
    //     link.innerHTML = `
    //         <div class="border rounded">
    //             <div id="IdImgGrid" class="mx-2 mt-2">
    //                 <img width="100px" height="100px" src="${item.image}" alt="${item.title}">
    //             </div>
    //             <p class="product-title">${item.title}</p>
    //             <p class="product-description">${item.description}</p>
    //             <div class="product-price-rating">
    //                 <p class="product-price">${item.price}</p>
    //                 <p class="product-rating">${item.rating} <i class="fa-solid fa-star" style="color: yellow;"></i></p>
    //             </div>
    //         </div>
    //     `;

    //     itemDiv.appendChild(link);
    //     itemsGrid.appendChild(itemDiv);
    // });

    // currentIndex += itemsPerPage;

    // // Hide the "View More" button if all items are loaded
    // if (currentIndex >= items.length) {
    //     document.getElementById('view-more-container').style.display = 'none';
    // } else {
    //     document.getElementById('view-more-container').style.display = 'block';
    // }
}

function goBackHome() {
    window.history.back();
}

function getProductRecommend() {
    $.ajax({
        url: '/',
        method: 'GET',
        success: function (res) {
            if (res.status == 200) {

            } else {
                $.alert('Failed to get product recommend!');
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


function btnBuyNow() {
    $('#id-btn-buy-now').on('click', function (e) {
        e.preventDefault(); // Prevent the default behavior of the button click

        if (quantityInputGL === 0) {
            alert('Please add quantity before buying!');
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
                    showSuccess('Added to Cart successfully.🎉');
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

    function btnAddToCart() {
        $('#id-btn-add-to-cart').on('click', function (e) {
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

    btnBuyNow();
    btnAddToCart();

    if (!images.length > 0) {
        console.log('No images found.');
    }
});
