let allOrders = [];

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
        // console.log('Order:', order); 
        const dmain = window.location.origin;
        let itemListHTML = '';



        order.order_items.forEach(item => {

            const imagePath = item.image_path || 'default.jpg';
            const productName = item.product_name || 'No name';
            const size = item.size || '';
            itemListHTML += `
                <div class="order-item d-flex align-items-center mb-2">
                    <img src="${imagePath}" alt="Product Image" class="order-image-small me-3 rounded" style="width: 70px; height: 70px; object-fit: cover;">
                <div>
                        <p class="mb-1 fw-bold">${productName}</p>
                        <p class="text-muted mb-0">ចំនួន: ${item.quantity}</p>
                        <p class="text-muted mb-0">ទំហំ: ${size || ''}</p>
                    </div>
                </div>
            `;
        });
        //bookmark
        let ratingButtonHTML = '';
        if (order.status === 'delivered') {
            ratingButtonHTML += `
                <div class="text-end mt-3">
                    <button class="btn btn-sm btn-outline-primary rate-btn mt-2" data-order-id="${order.order_id}">
                        Đánh giá
                    </button>
                </div>
            `;
        }

        let actionButtonsHTML = '';
        if (order.status === 'processing') {
            actionButtonsHTML = `
                <div class="d-flex justify-content-end gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-secondary edit-order-btn" data-order-id="${order.order_id}">
                        ✏️ Sửa đơn hàng
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-order-btn" data-order-id="${order.order_id}">
                        🗑️ Xóa đơn hàng
                    </button>
                </div>
            `;
        }



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
                    ${ratingButtonHTML}
                    ${actionButtonsHTML} 
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
                allOrders = res.data;
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
    
    // Khi click nút đánh giá bookmark
    $(document).on('click', '.rate-btn', function () {
        const orderId = $(this).data('order-id');
        const order = allOrders.find(o => o.order_id === orderId);
    
        if (!order) {
            alert("Không tìm thấy đơn hàng.");
            return;
        }
    
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        $('#csrf_token').val(csrfToken);
    
        let formHTML = '';
    
        order.order_items.forEach((item, index) => {
            formHTML += `
            <div class="rating-block border rounded p-3 mb-3">
                <input type="hidden" name="ratings[${index}][product_id]" value="${item.product_id}">
                <label class="fw-bold">${item.product_name}</label>
                <div class="mb-2">
                    <label>Đánh giá:</label>
                    <select class="form-select" name="ratings[${index}][rating]" required>
                        <option value="">Chọn</option>
                        <option value="1">1 - Tệ</option>
                        <option value="2">2 - Trung bình</option>
                        <option value="3">3 - Tốt</option>
                        <option value="4">4 - Rất tốt</option>
                        <option value="5">5 - Tuyệt vời</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label>Nhận xét:</label>
                    <textarea class="form-control" name="ratings[${index}][comment]" rows="2" required></textarea>
                </div>
            </div>
            `;
        });
    
        $('#ratingFormContainer').html(formHTML);
        $('#ratingModal').modal('show');
    });

    // Submit form đánh giá
    $('#ratingForm').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        // Đảm bảo token luôn có trong formData
        if (!formData.has('_token')) {
            formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
        }

        $.ajax({
            url: '/reviews',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                alert('✅ Đánh giá thành công!');
                $('#ratingModal').modal('hide');
                $('#ratingForm')[0].reset();
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                alert('❌ Gửi đánh giá thất bại!');
            }
        });
    });

    //xóa
    $(document).on('click', '.delete-order-btn', function () {
    const orderId = $(this).data('order-id');
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        $.ajax({
            url: `/delete-order/${orderId}`,
            method: 'DELETE',
            success: function () {
                alert('✅ Xóa đơn hàng thành công!');
                getCompletedOrders(); // Reload lại danh sách đơn hàng
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                alert('❌ Không thể xóa đơn hàng!');
            }
        });
    }
});

    
});
