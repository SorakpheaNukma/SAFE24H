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
                        វាយតម្លៃ
                    </button>
                </div>
            `;
        }

        let actionButtonsHTML = '';
        if (order.status === 'processing') {
            actionButtonsHTML = `
                <div class="d-flex justify-content-end gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-primary edit-order-btn" data-order-id="${order.order_id}">
                        ✏️ កែសម្រួល
                    </button>
                    <button class="btn btn-sm btn-outline-danger cancel-order-btn" data-order-id="${order.order_id}">
                        ❌ ផ្អាកការបញ្ជារទិញ
                    </button>
                </div>
            `;
        }

        // Build the order card

        const grandTotal = order.total_amount + (order.shipping_fee ?? 0);
        return `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-body">
                    <h5 class="card-title fw-bold">ល.រ #${order.order_id}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <p class="mb-0 text-muted">
                            តម្លៃសរុប: 
                            <span class="fw-bold">$${grandTotal.toFixed(2)}</span>
                            <small class="text-muted d-block">(${order.total_amount.toFixed(2)} + ${order.shipping_fee === 0 ? 'Free' : `$${order.shipping_fee.toFixed(2)}`})</small>
                        </p>
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
    
    // Submit form đánh giá
    $(document).on('click', '.rate-btn', function () {
        const orderId = $(this).data('order-id');
        const order = allOrders.find(o => o.order_id === orderId);

        if (!order) {
            alert("រកមិនឃើញការបញ្ជាទិញទេ។");
            return;
        }

        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        $('#csrf_token').val(csrfToken);

        let formHTML = '';

        order.order_items.forEach((item, index) => {
        
            const imagePath = item.image_path || '/uploads/products/default.jpg';


    const productName = item.product_name || 'No name';
    formHTML += `
    <div class="rating-block border rounded p-3 mb-3">
        <input type="hidden" name="ratings[${index}][product_id]" value="${item.product_id}">
        <div class="d-flex">
            <div class="me-3">
                <img src="${imagePath}" alt="${productName}" class="img-thumbnail" style="width: 120px; height: 200px; object-fit: cover;">
            </div>
            <div class="flex-grow-1">
                <label class="fw-bold">${item.product_name}</label>
                <div class="mb-2">
                    <label>វាយតម្លៃ:</label>
                    <select class="form-select" name="ratings[${index}][rating]" required>
                        <option value="">ជ្រើសរើស</option>
                        <option value="1">1 - អន់</option>
                        <option value="2">2 - មធ្យម</option>
                        <option value="3">3 - ល្អ</option>
                        <option value="4">4 - ល្អបំផុត</option>
                        <option value="5">5 - ល្អឥតខ្ចោះ</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label>មតិ:</label>
                    <textarea class="form-control" name="ratings[${index}][comment]" rows="2" required></textarea>
                </div>
            </div>
        </div>
    </div>
    `;
});

        $('#ratingFormContainer').html(formHTML);
        $('#ratingModal').modal('show');

    // 🟢 GÁN LẠI SUBMIT NGAY SAU KHI FORM RENDER
    $('#ratingForm').off('submit').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        if (!formData.has('_token')) {
            formData.append('_token', csrfToken);
        }

        $.ajax({
            url: '/reviews',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: '✅ ការវាយតម្លៃបានជោគជ័យ!',
                    text: 'អរគុណសម្រាប់ការវាយតម្លៃរបស់អ្នក។',
                    confirmButtonText: 'យល់ព្រម',
                    confirmButtonColor: '#28a745'
                });
                $('#ratingModal').modal('hide');
                $('#ratingForm')[0].reset();
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: '❌ បរាជ័យ!',
                    text: 'បញ្ចូនការវាយតម្លៃបានបរាជ័យ។ សូមសាកល្បងម្តងទៀត។',
                    confirmButtonText: 'យល់ព្រម',
                    confirmButtonColor: '#dc3545'
                });
            }
        });
    });
    });

    //xóa
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
    });

    $(document).on('click', '.cancel-order-btn', function () {
        const orderId = $(this).data('order-id');

        Swal.fire({
            title: 'បោះបង់ការបញ្ជាទិញ?',
            text: 'តើអ្នកប្រាកដថាចង់បោះបង់ការបញ្ជាទិញនេះមែនទេ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'យល់ព្រម',
            cancelButtonText: 'បោះបង់',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/orders/${orderId}/cancel`,
                    method: 'POST',
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'បានបោះបង់ជោគជ័យ!',
                            text: 'ការបញ្ជាទិញត្រូវបានលុបចោល។'
                        });

                        // Gọi lại API để cập nhật đơn hàng
                        $.get('/get-all-orders', function (res) {
                            if (res.status === 200) {
                                OrdersLsGL = res.data;
                                displayContentOrders();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'បរាជ័យ!',
                                    text: 'មិនអាចទាញយកបញ្ជីការបញ្ជាទិញបានទេ។'
                                });
                            }
                        });
                    },
                    error: function (xhr) {
                        console.error(xhr.responseText);
                        Swal.fire({
                            icon: 'error',
                            title: 'បរាជ័យ!',
                            text: 'មិនអាចបោះបង់ការបញ្ជាទិញបានទេ។'
                        });
                    }
                });
            }
        });
    });

    $(document).on('click', '.edit-order-btn', function () {
        const orderId = $(this).data('order-id');
        const order = allOrders.find(o => o.order_id == orderId);
        console.log("Order:", order);
        if (!order) return;

        // Reset form
        $('#editOrderForm input[name="order_id"]').remove();
        $('#editFormContainer').empty();
        $('#editOrderForm').prepend(`<input type="hidden" name="order_id" value="${orderId}">`);

        // Render UI
        let html = '';
        order.order_items.forEach((item, index) => {
            console.log(`Item ${index}:`, item);
            html += `
            <div class="edit-block border rounded p-3 mb-3">
                <input type="hidden" name="items[${index}][order_item_id]" value="${item.order_item_id}">
                <label>ផលិតផល: ${item.product_name}</label>
                <div class="mb-2">
                    <label>ទំហំ:</label>
                    <select name="items[${index}][variant_id]" class="form-select variant-select" 
                            data-product-id="${item.product_id}" 
                            data-current="${item.variant_id}" required>
                        <option value="">កំពុងផ្ទុក...</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label>ចំនួន:</label>
                    <input type="number" name="items[${index}][quantity]" class="form-control" value="${item.quantity}" min="1" required>
                </div>
            </div>`;
        });

        $('#editFormContainer').html(html);
        $('#editModal').modal('show');

        // Load variants
        const loadVariantPromises = [];
        $('.variant-select').each(function () {
            const select = $(this);
            const productId = select.data('product-id');
            const currentId = select.data('current');

            const p = $.get(`/api/product/${productId}/variants`, function (variants) {
                select.empty();
                variants.forEach(variant => {
                    const selected = (variant.variant_id == currentId) ? 'selected' : '';
                    select.append(`<option value="${variant.variant_id}" ${selected}>${variant.size}</option>`);
                });
            });

            loadVariantPromises.push(p);
        });

        // Chỉ bind submit sau khi load variants xong
        Promise.all(loadVariantPromises).then(() => {
        $('#editOrderForm').off('submit').on('submit', function (e) {
            e.preventDefault();

            // Lấy order_id
            const order_id = $('input[name="order_id"]').val();

            // Lấy từng item trong form
            const items = [];
            $('#editFormContainer .edit-block').each(function () {
                const order_item_id = $(this).find('input[name$="[order_item_id]"]').val();
                const variant_id = $(this).find('select[name$="[variant_id]"]').val();
                const quantityStr = $(this).find('input[name$="[quantity]"]').val();

                // Chuyển quantity thành số nguyên, mặc định 1 nếu không đúng
                const quantity = parseInt(quantityStr);
                
                items.push({
                    order_item_id: (order_item_id && order_item_id !== 'null' && order_item_id !== 'undefined') ? order_item_id : null,
                    variant_id: (variant_id && variant_id !== 'null' && variant_id !== 'undefined') ? variant_id : null,
                    quantity: (quantity > 0) ? quantity : 1,
                });
            });

            const postData = {
                order_id: order_id,
                items: items,
            };

            console.log("Dữ liệu gửi đi:", postData);

            $.ajax({
                url: '/orders/user-update',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function () {
                    Swal.fire('ជោគជ័យ', 'បានធ្វើបច្ចុប្បន្នភាព', 'success');
                    $('#editModal').modal('hide');
                    getCompletedOrders();
                },
                error: function (xhr) {
                    console.error("Lỗi:", xhr.responseText);
                    Swal.fire('បរាជ័យ', 'មិនអាចធ្វើបច្ចុប្បន្នភាពបានទេ', 'error');
                }
            });
        });
    });

    });


});
