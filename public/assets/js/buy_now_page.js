$(document).ready(function () {
    let totalPrice = 0;
    let itemCount = 0;
    const shippingFee = 2.00;
    var ProductsLsGL = [];

    const user_idGL = document.querySelector('meta[name="user_id"]').content;

    var UserDataGL = [];

    $('#id-change-address').on('click', function () {
        window.location.href = '/address-page';
    });

    $('#shipping-total').text(shippingFee.toFixed(2) + "$");

    function getItemDataFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const itemData = params.get('items');
        const detailParam = params.get('detail');
        const images = params.get('images');

        const productData = JSON.parse(itemData);
        return { productData, detailParam, images };
    }

    var { productData, detailParam, images } = getItemDataFromUrl();

    if (detailParam === 'true') {
        ProductsLsGL.push({
            product_id: productData.product_id,
            product_name: productData.product_name,
            product_price: productData.product_price,
            image_path: images,
            quantity: productData.quantity
        });
    } else {
        ProductsLsGL = productData;
    }

    // Function to dynamically add a single product when detailParam is true
    function addSingleProductItem(product) {
        const productName = product.product_name;
        const quantity = product.quantity;
        const price = product.product_price;
        const dmain = window.location.origin;
        const imagePath = product.image_path ? product.image_path : 'default.jpg';

        totalPrice += price * quantity;
        itemCount++;

        const productHTML = `
    <div class="container m-2 product-item">
        <div class="row d-flex align-items-center flex-column flex-md-row">
            <div class="col-12 col-md-2 mb-3 mb-md-0">
                <img width="100%" height="auto" src="${dmain}/uploads/products/${imagePath}" alt="Product Image" />
            </div>
            <div class="col-12 col-md-8 d-flex flex-column">
                <h6 class="fw-semibold">Product Name: ${productName}</h6>
                <p class="mb-0">Quantity: ${quantity}</p>
            </div>
           
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <h6>Price</h6>
            </div>
            <div class="col-6 text-end">
                <h6 class="fw-bold">$${price}</h6>
            </div>
        </div>
    </div>`;

        // Insert the new product item before the "Order Total" section
        const productList = document.getElementById('product-list');
        productList.insertAdjacentHTML('beforeend', productHTML);

        // Update the order total display
        updateOrderTotal();
    }

    // Function to dynamically add product items
    function addProductItem(product) {
        const productName = product.product.product_name;
        const quantity = product.quantity;
        const price = product.product.product_price;
        const dmain = window.location.origin;
        const imagePath = product.product.product_image.length > 0 ? product.product.product_image[0].image_path : 'default.jpg';

        totalPrice += price * quantity;
        itemCount++;

        const productId = `product-${product.product.product_id}`;

        const productHTML = `
    <div id="${productId}" class="container m-2 product-item">
        <div class="row d-flex align-items-center flex-column flex-md-row">
            <div class="col-12 col-md-2 mb-3 mb-md-0">
                <img width="100%" height="auto" src="${dmain}/uploads/products/${imagePath}" alt="Product Image" />
            </div>
            <div class="col-12 col-md-8 d-flex flex-column">
                <h6 class="fw-semibold">Product Name: ${productName}</h6>
                <p class="mb-0">Quantity: ${quantity}</p>
            </div>
            <div class="col-12 col-md-2 text-md-end mt-3 mt-md-0">
                <h6 class="text-primary remove-item" data-product-id="${productId}" data-price="${price * quantity}" data-quantity="${quantity}">Remove</h6>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <h6>Price</h6>
            </div>
            <div class="col-6 text-end">
                <h6 class="fw-bold">$${price.toFixed(2)}</h6>
            </div>
        </div>
    </div>`;

        const productList = document.getElementById('product-list');
        productList.insertAdjacentHTML('beforeend', productHTML);

        updateOrderTotal();
    }

    // Function to update the order total display
    function updateOrderTotal() {
        const orderTotalElement = document.getElementById('order-total');
        const merchandiseTotal = totalPrice;
        const totalPayment = merchandiseTotal + shippingFee;

        document.getElementById('merchandise-total').textContent = `$${merchandiseTotal.toFixed(2)}`;
        document.getElementById('total-payment').textContent = `$${totalPayment.toFixed(2)}`;
        document.getElementById('final-total').textContent = `$${totalPayment.toFixed(2)}`;

        orderTotalElement.innerHTML = `
    <h6 class="fw-bold mb-2 mb-md-0">Order Total (${itemCount} Item${itemCount > 1 ? 's' : ''}):</h6>
    <h6 class="fw-bold text-md-end">$${merchandiseTotal.toFixed(2)}</h6>`;
    }

    // Event listener for removing items
    $(document).on('click', '.remove-item', function () {
        const productId = $(this).data('product-id');
        const productPrice = parseFloat($(this).data('price'));
        const productQuantity = parseInt($(this).data('quantity'));

        // Remove the item from the DOM
        $(`#${productId}`).remove();

        // Update the total price and item count
        totalPrice -= productPrice;
        itemCount -= productQuantity;

        // Update the order total display
        updateOrderTotal();
    });

    function initializeData() {
        ProductsLsGL.forEach(product => {
            if (detailParam === 'true') {
                addSingleProductItem(product);
            } else {
                addProductItem(product);
            }
        });
    }

    initializeData();

    function showSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.visibility = 'visible';
        spinner.style.opacity = '1';
        spinner.style.backgroundColor = 'white';

        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'none';
    }

    function hideSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.opacity = '0';
        spinner.style.visibility = 'hidden';

        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block';
    }

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    function saveOrder(callback) {
        const orderDate = getCurrentDateTime();

        const orderData = {
            user_id: user_idGL,
            total_amount: totalPrice.toFixed(2),
            status: 'processing',
            order_date: orderDate,
        };

        $.ajax({
            url: '/save-order',
            method: 'POST',
            data: orderData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    UserDataGL.push(res.users);

                    callback(res.data.order_id);
                } else {
                    alert('Failed to place the order.');
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
            }
        });
    }

    // send notification to browser that already has subscription 
    function sendNotification(title, body, url) {
        $.ajax({
            url: '/send-push-notification',
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                title: title,
                body: body,
                url: url,
            },
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log("Error send Notification:" + error);
                showError("Error send Notification: " + error);
            }
        });
    }


    function saveOrderItems(orderId) {
        var orderItems = [];

        if (detailParam === 'true') {
            orderItems = ProductsLsGL.map(item => ({
                order_id: orderId,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product_price
            }));
        } else {
            orderItems = ProductsLsGL.map(item => ({
                order_id: orderId,
                product_id: item.product.product_id,
                quantity: item.quantity,
                price: item.product.product_price
            }));
        }

        $.ajax({
            url: '/save-order-items',
            method: 'POST',
            data: JSON.stringify({ items: orderItems }),
            contentType: 'application/json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    const dmain = window.location.origin;

                    var title = "🛒 New Order Received!";
                    var url = `${dmain}/home-dashboard`;
                    var body = `👤 Client: `;

                    UserDataGL.forEach(u => {
                        body += `${u.username}\n`;
                    });

                    body += "🛍️ Ordered Items:\n";

                    res.data.forEach(item => {
                        // console.log('item: ' + JSON.stringify(item.order_item.quantity));
                        body += `• ${item.product_name} -- Quantity:${item.order_item.quantity}\n`;
                    });

                    sendNotification(title, body, url);

                    window.location.href = `/order-success?Total_Price=${totalPrice.toFixed(2)}&Order_Id=${orderId}`;
                } else {
                    alert('Failed to place the order items.');
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
            }
        });
    }


    $('#id-btn-order').on('click', function (e) {
        e.preventDefault();
        showSpinner();

        // Check if the payment method checkbox is checked
        if (!$('#id-payment-method').is(':checked')) {
            hideSpinner();
            alert('Please select a payment method.');
            return false;
        }

        if (totalPrice === 0) {
            hideSpinner();
            alert('We don\'t have an order now. Total Price is zero.');
            return false;
        }

        // Save the order and then save order items using the callback
        saveOrder(function (orderId) {
            saveOrderItems(orderId);
            hideSpinner();
        });
    });

});
