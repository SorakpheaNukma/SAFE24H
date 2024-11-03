$(document).ready(function () {
    // Function to get query parameter values
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const processingCount = getQueryParam('processCount');
    const toShipCount = getQueryParam('toShipCount');
    const orderItems = getQueryParam('orderItems');

    const objOrderItems = JSON.parse(orderItems || '[]');

    if (processingCount > 0) {
        $('#badge-processing').text(processingCount).removeClass('d-none');
    }
    if (toShipCount > 0) {
        $('#badge-shipped').text(toShipCount).removeClass('d-none');
    }

    // Function to append order items to the appropriate tab
    function appendOrderItems() {
        objOrderItems.forEach(item => {
            // console.log('item: ', item.product.product_image[0].image_path);

            const dmain = window.location.origin;
            const imagePath = item.product.product_image[0].image_path;
            const orderCard = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="order-details">
                            <img src="${dmain}/uploads/products/${imagePath}" alt="Product Image" class="order-image">
                            <div>
                                <h5 class="card-title">Order #${item.order.order_id}</h5>
                                <p class="card-text">Product: ${item.product.product_name}</p>
                                <p class="card-text">Quantity: ${item.quantity}</p>
                                <p class="card-text">Total Amount: $${item.order.total_amount}</p>
                                <p class="card-text">Order Date: ${item.order.order_date}</p>
                                <span class="badge ${item.order.status === 'processing' ? 'badge-warning' : 'badge-primary'}">${item.order.status}</span>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Append to the correct tab based on the order status
            if (item.order.status === 'processing') {
                $('#processing-orders').append(orderCard);
            } else if (item.order.status === 'Shipped') {
                $('#shipped-orders').append(orderCard);
            } else {
                // Handle completed orders if needed
                $('#received-orders').append(orderCard);
            }
        });
    }

    // Call the function to append order items
    appendOrderItems();
});
