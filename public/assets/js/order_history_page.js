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

    // Group order items by order_id
    const ordersGroupedByOrderId = {};
    objOrderItems.forEach(item => {
        if (!ordersGroupedByOrderId[item.order.order_id]) {
            ordersGroupedByOrderId[item.order.order_id] = {
                order: item.order,
                items: []
            };
        }
        ordersGroupedByOrderId[item.order.order_id].items.push(item);
    });

    // Function to append order items to the appropriate tab
    function appendOrderItems() {
        Object.values(ordersGroupedByOrderId).forEach(orderGroup => {
            const order = orderGroup.order;
            const items = orderGroup.items;

            const dmain = window.location.origin;
            let itemListHTML = '';

            items.forEach(item => {
                const imagePath = item.product.product_image[0].image_path;
                itemListHTML += `
                    <div class="order-item d-flex align-items-center mb-2">
                        <img src="${dmain}/uploads/products/${imagePath}" alt="Product Image" class="order-image-small me-3 rounded" style="width: 70px; height: 70px; object-fit: cover;">
                        <div>
                            <p class="mb-1 fw-bold">${item.product.product_name}</p>
                            <p class="text-muted mb-0">Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                `;
            });

            const orderCard = `
                <div class="card shadow-sm mb-4 border-0">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">Order #${order.order_id}</h5>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <p class="mb-0 text-muted">Total Amount: <span class="fw-bold">$${order.total_amount}</span></p>
                            <p class="mb-0 text-muted">Order Date: ${order.order_date.split('T')[0]}</p>
                        </div>
                        <span class="badge ${order.status === 'processing' ? 'bg-warning text-dark' : 'bg-primary'}">${order.status}</span>
                        <div class="order-items mt-3">
                            ${itemListHTML}
                        </div>
                    </div>
                </div>`;

            // Append to the correct tab based on the order status
            if (order.status === 'processing') {
                $('#processing-orders').append(orderCard);
            } else if (order.status === 'Shipped') {
                $('#shipped-orders').append(orderCard);
            } else {
                $('#received-orders').append(orderCard);
            }
        });
    }

    // Call the function to append order items
    appendOrderItems();
});
