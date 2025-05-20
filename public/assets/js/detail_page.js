
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
    const itemsToLoad = items; // Hiển thị toàn bộ luôn

    itemsToLoad.forEach((item, i) => {
        const image = `
            <a href="javascript:void(0);" class="product-link" data-product-index="${i}">
                <img src="${dmain}/uploads/products/${item.images[0] || 'default-image.jpg'}" alt="${item.product_name}">
            </a>
        `;

const html = `  
    <div class="col-12 col-sm-6 col-md-4 col-lg-5-custom">
        <div class="card" data-product-index="${i}" style="border-radius: 16px; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: relative; overflow: hidden; max-height: 420px;">

            ${item.discount_percent > 0 ? `
                <div class="badge bg-light text-danger fw-bold" style="position: absolute; top: 12px; left: 12px; font-size: 12px;">
                    ${item.discount_percent}% OFF
                </div>` : ''
            }

            <a href="javascript:void(0);" class="product-link" data-product-index="${i}">
                <img src="${dmain}/uploads/products/${item.images[0] || 'default-image.jpg'}" class="card-img-top" alt="${item.product_name}" style="max-height: 240px; object-fit: cover;">
            </a>

            <div class="card-body" style="padding: 12px;">
                <h5 class="card-title text-primary fw-semibold mb-1" style="font-family: 'Khmer OS', sans-serif;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;">${item.product_name}</h5>

                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        ${item.discount_percent > 0
                            ? `
                                <div class="text-danger fw-bold fs-3">\$${item.discounted_price}</div>
                                <div style="text-decoration: line-through; color: #aaa; font-size: 16px;">\$${item.product_price}</div>
                            `
                            : `<div class="text-danger fw-bold fs-3">\$${item.product_price}</div>`
                        }
                    </div>
                    <div style="font-family: 'Khmer OS', sans-serif; 
                        white-space: nowrap; 
                        overflow: hidden; 
                        text-overflow: ellipsis; 
                        margin-top: 8px; 
                        margin-left: 12px;">
                        ${item.descriptions.des_1 || ''}
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
        itemsGrid.innerHTML += html;
    });

    // currentIndex += itemsPerPage;
    // Ẩn nút View More luôn
    const viewMoreContainer = document.getElementById('view-more-container');
    if (viewMoreContainer) viewMoreContainer.style.display = 'none';

    // Add click event listener to each product link
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = link.getAttribute('data-product-index');
            const item = items[index];

            const productDetailUrl = `/details-page?item=${encodeURIComponent(JSON.stringify(item))}&img=${encodeURIComponent(item.images.join(','))}`;
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
            Swal.fire({
                icon: 'warning',
                title: 'សូមចូលគណនី',
                text: 'សូមបំពេញព័ត៍មានដើម្បីទិញទំនិញនេះ',
                confirmButtonText: 'ទៅកាន់ការចូល',
            }).then(() => {
                window.location.href = "/login";
            });
            return;
        }

        let quantity = parseInt(quantityInputGL);
        console.log("DEBUG - quantityInputGL:", quantityInputGL, typeof quantityInputGL);

        if (isNaN(quantity) || quantity <= 0) {
            Swal.fire({
                icon: 'info',
                title: 'ចំនួនមិនត្រឹមត្រូវ',
                text: 'សូមបញ្ចូលចំនួនទំនិញមុនពេលទិញ!',
            });
            return;
        }

        if (quantityStock === 0) {
            Swal.fire({
                icon: 'error',
                title: 'អស់ស្តុក',
                text: 'អធ្យាស្រ័យ! ទំនិញនេះអស់ស្តុក។',
            });
            return;
        }

        const selectedSize = $('#id-sizeSelect').val();
        if (!selectedSize) {
            Swal.fire({
                icon: 'warning',
                title: 'មិនបានជ្រើសទំហំ',
                text: 'សូមជ្រើសរើសទំហំមុនពេលទិញ!',
            });
            return;
        }

        // Kiểm tra địa chỉ
        checkAddress(function (hasAddress) {
            if (hasAddress) {
                // Nếu có địa chỉ, tiếp tục
                var { productData, images } = getItemDataFromUrl();
                var firstImage = images.length > 0 ? images[0] : 'default.jpg';

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
                    discounted_price: productData.discounted_price,
                    quantity: quantityInputGL,
                    size: selectedSize,
                    variant_id: variantId
                };

                const productStr = encodeURIComponent(JSON.stringify(newProduct));
                window.location.href = `/buy-now-page?detail=true&items=${productStr}&images=${encodeURIComponent(firstImage)}`;
            } else {
                // Hiển thị SweetAlert2 confirm box thay vì jQuery Confirm
                Swal.fire({
                    title: 'មិនមានទីតាំងទទួល',
                    text: 'អ្នកមិនទាន់បានបញ្ចាក់ទីតាំងទទួលទេ។ ចង់បញ្ជាក់ឥឡូវនេះទេ?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'បាទ/ចាស ចង់បញ្ជាក់',
                    cancelButtonText: 'មិនចាំបាច់',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/address-page';
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

function displayProductImages(ProductsImages) {
    const container = document.getElementById('id-product-images');
    const dmain = window.location.origin;
    container.innerHTML = '';

    if (!ProductsImages || ProductsImages.length === 0) {
        container.innerHTML = `<div><p>No images found.</p></div>`;
        return;
    }

    ProductsImages.forEach(image => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="my-image-container" style="height: 409px; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <div class="swiper-zoom-container">
                <img src="${dmain}/uploads/products/${image}" alt="Product Image" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px;">
                </div>
            </div>
            `;

        container.appendChild(slide);
    });

    // Khởi tạo Swiper sau khi load ảnh
    if(window.swiperInstance) {
      window.swiperInstance.destroy(true, true);
    }

    window.swiperInstance = new Swiper(".mySwiper", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        speed: 600,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        effect: "slide", 
        zoom: {
            maxRatio: 3, // mức độ zoom tối đa
            } // bạn có thể thử "fade" hoặc "cube"
    });
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
                $commentList.append('<p>មិនទាន់មានការបញ្ចេញមតិយោបល់.</p>');
                $(".rating-stars").html(renderStars(0)); // Gán 0 sao
                return;
            }
                // ✅ Tính trung bình rating
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = totalRating / reviews.length;

                // ✅ Gán phần sao trung bình vào giao diện
                $(".rating-stars").html(renderStars(avgRating));
                $(".avg-rating-text").text(`${avgRating.toFixed(1)} ពី  ${reviews.length} វាយតម្លៃ`);


            reviews.forEach(review => {
                const commentHTML = `
                    <div class="comment-item" style="margin-bottom: 20px;">
                    <img class="user-avt" src="/${review.user.user_profile || 'uploads/profile/default-avatar.jpg'}" alt="User Image" width="50" height="50">
                        <div style="display:flex; flex-direction:column;width:100%;">
                            <div style="display:flex; flex-direction:row;">
                                <div class="username-rate" style="margin-right: 15px;">
                                    <p><strong>${review.user?.username || 'Anonymous'}</strong></p>
                                    <p>អត្រាវាយតម្លៃ: ${review.rating}/5⭐</p>
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
            console.error('Error rate:', error);
        }
    });
}

function renderStars(rating) {
    let fullStars = Math.floor(rating);
    let halfStar = rating - fullStars >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i> ';
    }

    if (halfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i> ';
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i> ';
    }

    return starsHTML;
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

    getProductRecommend(productData.product_id);

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

function addItemToCarts(payload) {
    $.ajax({
        url: '/add-to-cart',
        method: 'POST',
        data: payload,          // gửi toàn bộ object
        success: function (res) {
            if (res.status == 200) {
                getAllCartItems();

                Swal.fire({
                    icon: 'success',
                    title: 'បានបញ្ចូលជោគជ័យ!',
                    text: 'ទំនិញត្រូវបានបញ្ចូលក្នុងកន្ត្រករបស់អ្នក 🎉',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'បរាជ័យ!',
                    text: 'មិនអាចបន្ថែមបានទេ។',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        },
        error: function (res) {
            let errorMessage = 'មានបញ្ហាអ្វីមួយកើតឡើង!!';

            if (res.status === 422) {
                const error = res.responseJSON.error;
                errorMessage = Object.values(error)[0][0];
            } else if (res.status === 500) {
                errorMessage = 'កំហុសនៅម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀត។';
            }

            Swal.fire({
                icon: 'error',
                title: 'បរាជ័យ!',
                text: errorMessage,
                timer: 2500,
                showConfirmButton: false
            });
        }
    });
}

function btnAddToCart(quantityStock) {
    $('#id-btn-add-to-cart').on('click', function (e) {
        e.preventDefault();

        // 1) Kiểm tra đăng nhập
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'warning',
                title: 'សូមចូលគណនី',
                text: 'សូមបំពេញព័ត៍មានដើម្បីទិញទំនិញនេះ',
                confirmButtonText: 'ចូលគណនី'
            }).then(() => {
                window.location.href = "/login";
            });
            return;
        }

        // 2) Kiểm tra size
        const selectedSize = $('#id-sizeSelect').val();
        if (!selectedSize) {
            Swal.fire({
                icon: 'info',
                title: 'មិនបានជ្រើសទំហំ',
                text: 'សូមជ្រើសរើសទំហំមុនពេលបញ្ចូលទៅក្នុងកន្ត្រក',
            });
            return;
        }

        // 3) Kiểm tra tồn kho
        if (quantityStock === 0) {
            Swal.fire({
                icon: 'error',
                title: 'អស់ស្តុក',
                text: 'អធ្យាស្រ័យទំនិញអស់ស្តុក',
            });
            return;
        }

        // 4) Kiểm tra số lượng
        if (quantityInputGL <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'ចំនួនមិនត្រឹមត្រូវ',
                text: 'សូមធ្វើការបញ្ជូលចំនួនទំនិញមុនការបញ្ជាទិញ!',
            });
            return;
        }

        /* -------------------------------------------------
           5) Chuẩn bị dữ liệu giống nút Buy Now
        ---------------------------------------------------*/
        const { productData } = getItemDataFromUrl();   // hàm bạn đã có
        const size = selectedSize;

        // Tìm variant_id tương ứng size
        let variantId = null;
        if (productData.variants && Array.isArray(productData.variants)) {
            const matched = productData.variants.find(v => v.size === size);
            if (matched) variantId = matched.variant_id;
        }

        // Tính giá sau giảm nếu có `discount_percent`
        let originalPrice = parseFloat(productData.product_price.toString().replace(/,/g, ''));
        let discountedPrice = originalPrice;

        if (productData.discount_percent && productData.discount_percent > 0) {
            discountedPrice = (originalPrice * (1 - productData.discount_percent / 100)).toFixed(2);
        } else if (productData.discounted_price) {
            // Trường hợp trang chi tiết đã có sẵn discounted_price
            discountedPrice = parseFloat(productData.discounted_price);
        }

        // 6) Gọi AJAX thêm vào giỏ
        addItemToCarts({
            user_id:   user_idGL,
            product_id: productData.product_id,
            quantity:   quantityInputGL,
            size:       size,
            price:      originalPrice,
            discounted_price: discountedPrice,
            variant_id: variantId
        });

        // 7) Thông báo đã thêm thành công
        Swal.fire({
            icon: 'success',
            title: 'បានបញ្ចូលក្នុងកន្ត្រក',
            text: 'ទំនិញបានបញ្ចូលទៅក្នុងកន្ត្រករួចរាល់',
            showConfirmButton: false,
            timer: 1500
        });

        // DEBUG (tuỳ chọn)
        console.log({
            user_id: user_idGL,
            product_id: productData.product_id,
            quantity: quantityInputGL,
            size,
            variant_id: variantId,
            discounted_price: discountedPrice
        });
    });
}


$('#id-product-name').text(productData.product_name);

setTimeout(() => {
    const text = document.getElementById('id-product-name');
    const container = text.parentElement;

    const containerWidth = container.clientWidth;
    const textWidth = text.scrollWidth;

    if (textWidth <= containerWidth) return; // Không cần cuộn nếu chữ không dài hơn khung

    let position = 0;
    const speed = 1; // px per frame

    function animate() {
        position -= speed;

        // Khi chữ đi khuất hoàn toàn bên trái
        if (position <= -textWidth) {
            // Reset về ngoài khung bên phải
            position = containerWidth;
        }

        text.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
    }

    // Khởi tạo
    text.style.transform = 'translateX(0px)';
    animate();
}, 500);





    
    // $('#id-price').text(`$${productData.product_price}`);
    const originalPrice = parseFloat(productData.product_price);
    const discountedPrice = parseFloat(productData.discounted_price);

    if (!isNaN(discountedPrice) && discountedPrice < originalPrice) {
        $('#id-price').html(`
            <span class="price-new">$${discountedPrice}</span>
            <span class="price-old">$${originalPrice}</span> 
        `);
    } else {
        $('#id-price').html(`<span class="price-new">$${originalPrice}</span>`);
    }

    
    displayProductDesDetails(productData.descriptions);

    // displsyImgAbout(images[0]);
    displayProductImages(images);

    loadItemsRecommend();
    btnAddQuantityProduct();
    btnMinusQuantityProduct();
    fetchProductComments();
    // btnComment();

    btnBuyNow(productData.quantity);
    btnAddToCart(productData.quantity);

    if (!images.length > 0) {
        console.log('No images found.');
    }
});
