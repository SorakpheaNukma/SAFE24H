
let currentIndex = 0;
const itemsPerPage = 10;
var quantityInputGL = 0;
const user_idGL = localStorage.getItem('user_id');
if (user_idGL) {
  console.log('User ID:', user_idGL);
}
const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';


function loadItemsRecommend(items) { //res.data truyền vào đây
    const itemsGrid = document.getElementById('recommend-items-grid');
    itemsGrid.innerHTML = ''; // Clear existing content

    if (!items || items.length === 0) {
        itemsGrid.innerHTML = `<p>មិនមានទំនិញស្រដៀងៗគ្នា.</p>`;
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
                            <div style="display:flex; justify-content: center; align-items: center; margin-left: auto; width: 300px; overflow: hidden;">
                                <div class="product-description">
                                    ${item.descriptions.des_1 || ''}
                                </div>
                            </div>
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
            e.preventDefault();
            const index = link.getAttribute('data-product-index');
            const item = items[index];

            const productDetailUrl = `/details-page?item=${JSON.stringify(item)}&img=${item.images.join(',')}`;
            console.log(productDetailUrl);
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
        let min = parseInt(input.min) || 0;

        if (value > min) {
            input.value = value - 1;
        }

        quantityInputGL = $('#id-quantityInput').val();
    });
}

function btnAddQuantityProduct() {
    document.getElementById('plusBtn').addEventListener('click', function () {
        let input = document.getElementById('id-quantityInput');
        let value = parseInt(input.value);
        let max = parseInt(input.max);

        if (!isNaN(max) && value < max) {
            input.value = value + 1;
        }

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
        if (!isLoggedIn) {
            e.preventDefault();
            alert("សូមបំពេញព័ត៍មានដើម្បីទិញទំនិញនេះ");
            window.location.href = "/login";
            return;
        }
        let quantity = parseInt(quantityInputGL);
        console.log("DEBUG - quantityInputGL:", quantityInputGL, typeof quantityInputGL);
    
        if (isNaN(quantity) || quantity <= 0) {
            alert('សូមធ្វើការបញ្ជូលចំនួនទំនិញមុនការបញ្ជាទិញ!');
            return;
        }

        if (quantityStock === 0) {
            alert('អធ្យាស្រ័យទំនិញអស់ស្តុក');
            return;
        }

        const selectedSize = $('#id-sizeSelect').val();
        if (!selectedSize) {
            alert('សូមធ្វើការជ្រើសរើសទំហំទំនិញមុនការបញ្ជាទិញ!');
            return;
        }
        // First, check if the user has an address
        checkAddress(function (hasAddress) {
            if (hasAddress) {
                // If user has an address, proceed to "Buy Now" page
                var { productData, images } = getItemDataFromUrl();
                var firstImage = images.length > 0 ? images[0] : 'default.jpg';  // default.jpg nếu không có ảnh

                let variantId = null;
                if (productData.variants && Array.isArray(productData.variants)) {
                    const matchedVariant = productData.variants.find(v => v.size === selectedSize);
                    if (matchedVariant) {
                        variantId = matchedVariant.variant_id;
                    }
                }
                var newProduct = {
                    product_id: productData.product_id,
                    product_name: productData.product_name,
                    price: productData.product_price,
                    quantity: quantityInputGL,
                    size: selectedSize,
                    variant_id: variantId
                };
                const productStr = encodeURIComponent(JSON.stringify(newProduct));
                window.location.href = `/buy-now-page?detail=true&items=${productStr}&images=${encodeURIComponent(firstImage)}`;
            } else {
                //
                $.confirm({
                    title: '<strong>Warning!</strong>',
                    content: 'អ្នកមិនទាន់ទីតាំងទទួល. សូមធ្វើការបញ្ជាក់ទីតាំង?',
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

    let productData = {};
    try {
        productData = JSON.parse(decodeURIComponent(itemData)); // 👈 Thêm decode ở đây
    } catch (err) {
        console.error("Lỗi parse JSON:", err);
    }

    const images = imgData ? imgData.split(',') : [];

    return { productData, images };
}


function displayProductDesDetails(descriptions) {
    const desContent = document.getElementById('product-detail-id');
    desContent.innerHTML = '';

    if (descriptions && typeof descriptions === 'object') {
        let descriptionHTML = '<ul class="list-unstyled">';

        Object.keys(descriptions).forEach(function (key) {
            descriptionHTML += `<li>• ${descriptions[key]}</li>`;
        });

        descriptionHTML += '</ul>';
        desContent.innerHTML = descriptionHTML;
    } else {
        desContent.innerHTML = '<p>No descriptions available.</p>';
    }
}


// function displsyImgAbout(Images) {
//     const dvImg = document.getElementById('id-img-about');
//     const dmain = window.location.origin;

//     dvImg.innerHTML += ` <img width="80%" src="${dmain}/uploads/products/${Images}" class="img-fluid">`;
// }

function displayProductImages(ProductsImages) {
    var dvProductImages = document.getElementById('id-product-images');
    var dmain = window.location.origin;
    dvProductImages.innerHTML = '';

    if (ProductsImages.length > 0) {
        ProductsImages.forEach((image, index) => {
            const activeClass = index === 0 ? 'active' : '';  // Set first image as active
            dvProductImages.innerHTML += `
                <div class="carousel-item ${activeClass}" style="width:273px; height:409px;">
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

function fetchProductComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get('item');
    if (!itemParam) return;

    const decodedItem = JSON.parse(decodeURIComponent(itemParam));
    const productId = decodedItem.product_id;

    $.ajax({
        url: `/reviews?product_id=${productId}`,
        type: 'GET',
        dataType: 'json',
        success: function (reviews) {
            const $commentList = $('.comments-list');
            $commentList.empty();

            if (reviews.length === 0) {
                $commentList.append('<p>Chưa có đánh giá nào.</p>');
                return;
            }

            reviews.forEach(review => {
                const commentHTML = `
                    <div class="comment-item" style="margin-bottom: 20px;">
                    <img class="user-avt" src="/${review.user.user_profile || 'uploads/profile/default-avatar.jpg'}" alt="User Image" width="50" height="50">
                        <div style="display:flex; flex-direction:column;width:100%;">
                            <div style="display:flex; flex-direction:row;">
                                <div class="username-rate" style="margin-right: 15px;">
                                    <p><strong>${review.user?.username || 'Anonymous'}</strong></p>
                                    <p>Rated: ${review.rating}/5⭐</p>
                                </div>
                                <div class="user-comment-content" style="flex-grow: 1;">
                                    <p>${review.comment}</p>
                                </div>
                                <p style="font-size: 12px; color: gray; margin-left:auto;">
                                    ${new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                $commentList.append(commentHTML);
            });
        },
        error: function (xhr, status, error) {
            console.error('Lỗi khi tải đánh giá:', error);
        }
    });
}


function btnComment() {
    $('#btn-comment').on('click', function (e) {
        e.preventDefault();

        const comment = $('.big-textarea').val().trim();
        if (!comment) {
            alert('Vui lòng nhập bình luận trước khi gửi!');
            return;
        }

        const rating = 5; // hoặc thêm input để người dùng chọn
        const itemParam = new URLSearchParams(window.location.search).get('item');
        if (!itemParam) return;

        const decodedItem = JSON.parse(decodeURIComponent(itemParam));
        const productId = decodedItem.product_id;

        $.ajax({
            url: '/reviews',
            type: 'POST',
            dataType: 'json',
            data: {
                product_id: productId,
                rating: rating,
                comment: comment
            },
            success: function (res) {
                alert(res.message);
                $('.big-textarea').val('');
                fetchProductComments();
            },
            error: function (xhr) {
                console.error('Lỗi khi gửi bình luận:', xhr.responseJSON);
                alert('Gửi bình luận thất bại!');
            }
        });
    });
}


$(document).ready(function () {
    var { productData, images } = getItemDataFromUrl();

    $('#id-sizeSelect').off('change').on('change', function () {
        const selectedSize = $(this).val();
        if (!selectedSize || !productData.variants) return;

        const variant = productData.variants.find(v => v.size === selectedSize);
        if (variant) {
            $('#id-sold').text(`លក់បានចំនួន ${variant.sold} `);
            $('#id-stock').text(`មានក្នុងស្តុកចំនួន ${variant.quantity} `); // Số lượng trong kho
            $('#id-quantityInput')
                .val(0) // 👈 Reset về 0 mỗi lần chọn size mới
                .attr('max', variant.quantity);
        }
    });

    //bookmark - nút tăng giảm số lượng dựa trên tối đa sản phẩm in stock - sửa thêm trong admin
    getProductRecommend(productData.product_id);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function addItemToCarts(user_id, product_id, quantity, size) {  
        $.ajax({
            url: '/add-to-cart',
            method: 'POST',
            data: {
                'user_id': user_id,
                'product_id': product_id,
                'quantity': quantity,
                'size': size,
            },
            success: function (res) {
                if (res.status == 200) {
                    getAllCartItems();

                    showSuccess('ទំនិញត្រូវបានបញ្ចូលក្នុងកន្ត្រកបានជោគជ័យ 🎉');
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
            if (!isLoggedIn) {
                e.preventDefault();
                alert("សូមបំពេញព័ត៍មានដើម្បីទិញទំនិញនេះ");
                window.location.href = "/login";
                return;
            }
            const selectedSize = $('#id-sizeSelect').val();
            
            if (!selectedSize) {
                alert('សូមជ្រើសរើសទំហំមុនពេលបញ្ចូលទៅក្នុងកន្ត្រក'); // Vui lòng chọn size
                return;
            }
    
            if (quantityStock === 0) {
                alert('អធ្យាស្រ័យទំនិញអស់ស្តុក');
                return;
            }

            if (quantityInputGL > 0) {
            addItemToCarts(user_idGL, productData.product_id, quantityInputGL, selectedSize);
            } else {
                alert('សូមធ្វើការបញ្ជូលចំនួនទំនិញមុនការបញ្ជាទិញ!');
            }
            console.log("user_id:", user_idGL);
            console.log("product_id:", productData.product_id);
            console.log("quantity:", quantityInputGL);
            console.log("size:", selectedSize);

        });
    }

    $('#id-product-name').text(productData.product_name);

    setTimeout(() => {
        const text = document.getElementById('id-product-name');
        const container = text.parentElement;
    
        if (text.scrollWidth > container.clientWidth) {
            let direction = -1;
            let position = 0;
            const maxScroll = text.scrollWidth - container.clientWidth;
    
            setInterval(() => {
                position += direction;
                if (position <= -maxScroll || position >= 0) {
                    direction *= -1;
                }
                text.style.left = `${position}px`;
            }, 30); // điều chỉnh tốc độ tại đây
        }
    }, 100); // delay một chút để DOM tính toán đúng scrollWidth
    
    $('#id-price').text(`$${productData.product_price}`);
    displayProductDesDetails(productData.descriptions);

    // displsyImgAbout(images[0]);
    displayProductImages(images);

    loadItemsRecommend();
    btnAddQuantityProduct();
    btnMinusQuantityProduct();
    fetchProductComments();
    btnComment();

    btnBuyNow(productData.quantity);
    btnAddToCart(productData.quantity);

    if (!images.length > 0) {
        console.log('No images found.');
    }
});
