$(document).ready(function () {
    // Show/hide loading spinner
    function showLoading(show) {
        if (show) {
            $('#loading-spinner').removeClass('d-none');
        } else {
            $('#loading-spinner').addClass('d-none');
        }
    }

    // Display message for empty sections
    function displayEmptyMessage(sectionId, message) {
        $(`#${sectionId}`).html(`<p class="text-muted text-center">${message}</p>`);
    }

    // Build order card HTML
    function buildOrderCard(order) {
        // console.log("size:", item.size); 
        const dmain = window.location.origin;
        let itemListHTML = '';

        order.order_items.forEach(item => {
            const imagePath = item.product.product_image[0]?.image_path || 'default.jpg';
            itemListHTML += `
                <div class="order-item d-flex align-items-center mb-2">
                    <img src="${dmain}/uploads/products/${imagePath}" alt="Product Image" class="order-image-small me-3 rounded" style="width: 70px; height: 70px; object-fit: cover;">
                    <div>
                        <p class="mb-1 fw-bold">${item.product.product_name}</p>
                        <p class="text-muted mb-0">ចំនួន: ${item.quantity}</p>
                        <p class="text-muted mb-0">ទំហំ: ${item.size}</p>
                    </div>
                </div>
            `;
        });

        // Build the order card
        return `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-body">
                    <h5 class="card-title fw-bold">ល.រ #${order.order_id}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <p class="mb-0 text-muted">តម្លៃសរុប: <span class="fw-bold">$${order.total_amount}</span></p>
                        <p class="mb-0 text-muted">កាលបរិច្ឆេទ: ${order.order_date.split('T')[0]}</p>
                    </div>
                    <span class="badge ${order.status === 'processing' ? 'bg-warning text-dark' : 'bg-primary'}">${order.status}</span>
                    <div class="order-items mt-3">
                        ${itemListHTML}
                    </div>
                </div>
            </div>`;
    }

    // Fetch completed orders and append them
    function getCompletedOrders() {
        showLoading(true);

        $('#processing-orders, #shipped-orders, #received-orders').html('<p class="text-center text-muted">Loading orders...</p>');

        $.ajax({
            url: '/get-order-current-login',
            method: 'GET',
            success: function (res) {
                showLoading(false);

                $('#processing-orders, #shipped-orders, #received-orders').empty();

                if (res.status === 200 && res.data.length > 0) {
                    // Process and append orders to the correct sections
                    let hasProcessing = false, hasShipped = false, hasDelivered = false;

                    processingCount = 0;
                    toShipCount = 0;

                    res.data.forEach(order => {
                        const orderCard = buildOrderCard(order);

                        if (order.status === 'processing') {
                            processingCount++;
                            hasProcessing = true;
                            $('#processing-orders').append(orderCard);
                        } else if (order.status === 'shipped') {
                            toShipCount++;

                            hasShipped = true;
                            $('#shipped-orders').append(orderCard);
                        } else if (order.status === 'delivered') {
                            hasDelivered = true;
                            $('#received-orders').append(orderCard);
                        }

                        // Update badges for processing and shipped counts
                        if (processingCount > 0) {
                            $('#badge-processing').text(processingCount).removeClass('d-none');
                        }
                        if (toShipCount > 0) {
                            $('#badge-shipped').text(toShipCount).removeClass('d-none');
                        }
                    });

                    // Display messages for empty sections
                    if (!hasProcessing) displayEmptyMessage('processing-orders', 'គ្មានទំនិញរៀបចំ.');
                    if (!hasShipped) displayEmptyMessage('shipped-orders', 'គ្មានទំនិញដឹកជញ្ជូន.');
                    if (!hasDelivered) displayEmptyMessage('received-orders', 'គ្មានមុខទំនិញ.');
                } else {
                    // Handle empty data case
                    displayEmptyMessage('processing-orders', 'No processing orders.');
                    displayEmptyMessage('shipped-orders', 'No shipped orders.');
                    displayEmptyMessage('received-orders', 'No delivered orders.');
                }
            },
            error: function (res) {
                showLoading(false);
                $('#processing-orders, #shipped-orders, #received-orders').empty();
                displayEmptyMessage('processing-orders', 'Error loading processing orders.');
                displayEmptyMessage('shipped-orders', 'Error loading shipped orders.');
                displayEmptyMessage('received-orders', 'Error loading delivered orders.');
            }
        });
    }

    // Initialize spinner and fetch orders
    $('#loading-spinner').addClass('d-none');
    getCompletedOrders();
});
