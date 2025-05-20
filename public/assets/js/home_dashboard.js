import { exportToExcel1, exportToExcel2 } from "./fun_export_file.js";

$(document).ready(function() {
            $('.sidebar-toggler').click(function() {
                $('.sidebar, .content').toggleClass("open");
                return false;
            });


            // here pusher
            const pusherKey = document.querySelector('meta[name="pusher-key"]').content;
            const pusherCluster = document.querySelector('meta[name="pusher-cluster"]').content;

            const usernameGL = document.querySelector('meta[name="username"]').content;
            var LsOrdersForCountBadgeNumber = [];

            if (usernameGL) {
                $('#id-username').text(usernameGL);
            }

            // here for pusher 
            const pusher = new Pusher(pusherKey, {
                cluster: pusherCluster,
            });


            const channel = pusher.subscribe('send_notify_skincare');
            channel.bind('my-message', function(data) {
                if (data.message.order.status === 'processing') {
                    getAllOrders();
                }

            });
            // end of pusher


            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            let categoriesLsGL = [];
            let productsLsGL = [];
            let OrdersLsGL = [];

            let countUsersGl = 0;
            let totalAmountGl = 0;
            let todayAmountGl = 0;
            let LsOrderDataGl = [];
            let dataExportToExcelGl = [];

            const dashboardContent = document.getElementById("dashboard-content");
            const productContent = document.getElementById("product-content");
            const proImageContent = document.getElementById('product-images-content');
            const orderContent = document.getElementById('id-content-order');
            const dashboardActionLink = document.getElementById("id_dashBoard");
            const productActionLink = document.getElementById("id_product");
            const bannerImagesEdit = document.getElementById("banner-images-edit");
            var proDescription1 = document.getElementById('product-description1-tb');
            var proDescription2 = document.getElementById('product-description2-tb');

            // const UserActionLink = document.getElementById('id_user');
            // const PaymentActionLink = document.getElementById('id_payment');
            const OrderActionLink = document.getElementById('id_order');

            function Loading() {
                $('#IDSpinner').removeClass('my-hidden');
            }

            function hideLoading() {
                $('#IDSpinner').addClass('my-hidden');
            }

            function getAllCategories(callback) {
                $.ajax({
                    url: '/getAllCategory',
                    method: 'GET',
                    success: function(res) {
                        if (res.status == 200) {
                            categoriesLsGL = [];

                            res.data.forEach(function(category) {
                                categoriesLsGL.push({
                                    category_id: category.category_id,
                                    category_name: category.category_name
                                });
                            });

                            if (typeof callback === 'function') {
                                callback();
                            }
                        } else {
                            $.alert('Failed to get categories');
                        }
                    },
                    error: function(res) {
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

            getAllCategories();

            function addCategory(formData, callback) {
                $.ajax({
                    url: '/add-category',
                    method: 'POST',
                    data: formData,
                    success: function(res) {
                        if (res.status == 200) {
                            getAllCategories(displayCategoriesTable);

                            callback(true);
                        } else {
                            callback(false);
                        }
                    },
                    error: function(res) {
                        callback(false);
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError('An error occurred. Please try again later.');
                        } else {
                            showError('Something went wrong. Please try again later!');
                        }
                    }
                });
            }

            function updateCategory(formData) {
                $.ajax({
                    url: '/edit-category',
                    method: 'PUT',
                    data: formData,
                    success: function(res) {
                        if (res.status == 200) {
                            getAllCategories(displayCategoriesTable);

                            showSuccess('updated successfully🎉');
                        } else {
                            $.alert('Failed to update category');
                        }
                    },
                    error: function(res) {
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError('An error occurred. Please try again later.');
                        } else {
                            showError('Something went wrong. Please try again later.');
                        }
                    }
                });
            }

            function deleteCategory(formdata) {
                $.ajax({
                    url: '/delete-category',
                    method: 'DELETE',
                    data: formdata,
                    success: function(res) {
                        if (res.status == 200) {
                            getAllCategories(displayCategoriesTable);
                            showSuccess('deleted successfully🎉');
                        } else {
                            $.alert('Failed to delete category');
                        }
                    },
                    error: function(res) {
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError('An error occurred. Please try again later.');
                        } else if (res.status === 404) {
                            showError(res.responseJSON.error);
                        } else {
                            showError('Something went wrong. Please try again later.');
                        }
                    }
                });
            }

            function getAllProdut(callbacks = [], callbackdata = null) {
                if (callbacks.length === 0) {
                    Loading();
                }

                $.ajax({
                    url: '/getAllProducts',
                    method: 'GET',
                    success: function(res) {
                        if (res.status == 200) {
                            productsLsGL = [];

                            res.data.forEach(function(p) {
                                productsLsGL.push({
                                    product_id: p.product_id || 0,
                                    product_name: p.product_name || 'Unknown',
                                    product_price: p.product_price || 0,
                                    category_id: p.category_id || 0,
                                    category_name: p.category_name || 'N/A',
                                    quantity: p.quantity || 'Out of stock', //đã fix
                                    images: p.images && Array.isArray(p.images) ? p.images : [],
                                    descriptions: p.descriptions || {},
                                    variants: p.variants || [],
                                });
                            });

                            // ✅ TÍNH SỐ SIZE HẾT HÀNG
                            let outOfStockCount = 0;
                            productsLsGL.forEach(product => {
                                product.variants.forEach(variant => {
                                    if (parseInt(variant.quantity) === 0) {
                                        outOfStockCount++;
                                    }
                                });
                            });

                            // ✅ HIỂN THỊ BADGE
                            const badgeProduct = document.getElementById("id-badge-product");
                            if (badgeProduct) {
                                if (outOfStockCount > 0) {
                                    badgeProduct.classList.remove("d-none");
                                    badgeProduct.innerText = outOfStockCount;
                                } else {
                                    badgeProduct.classList.add("d-none");
                                    badgeProduct.innerText = '';
                                }
                            }


                            if (callbackdata && typeof callbackdata === 'function') {
                                callbackdata(res.data);
                            }

                            if (callbacks.length === 0) {
                                hideLoading();
                            }

                            callbacks.forEach(function(callback) {
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            });
                        } else {
                            if (callbacks.length === 0) {
                                hideLoading();
                            }

                            $.alert('Failed to get product!');
                        }
                    },
                    error: function(res) {
                        if (callbacks.length === 0) {
                            hideLoading();
                        }

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

            function updateProduct(formData, callback) {
                $.ajax({
                    url: '/edit-product',
                    method: 'PUT',
                    data: formData,
                    success: function(res) {
                        if (res.status === 200) {
                            if (typeof callback === 'function') {
                                callback(null, res);
                            }
                        } else {
                            $.alert('Failed to update product');

                            if (typeof callback === 'function') {
                                callback('Failed to update product', null);
                            }
                        }
                    },
                    error: function(res) {
                        let errorMessage = 'An error occurred. Please try again later.';
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            errorMessage = Object.values(error)[0][0];
                        } else if (res.status === 500) {
                            errorMessage = 'A server error occurred.';
                        }

                        showError(errorMessage);

                        if (typeof callback === 'function') {
                            callback(errorMessage, null);
                        }
                    }
                });
            }


            function deleteProduct(formData, callback) {
                $.ajax({
                    url: '/delete-product',
                    method: 'DELETE',
                    data: formData,
                    success: function(res) {
                        if (res.status === 200) {
                            if (typeof callback === 'function') {
                                callback(null, res);
                            }
                        } else {
                            $.alert('Failed to delete product');

                            if (typeof callback === 'function') {
                                callback('Failed to delete product', null);
                            }
                        }
                    },
                    error: function(res) {
                        let errorMessage = 'An error occurred. Please try again later.';
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            errorMessage = Object.values(error)[0][0];
                        } else if (res.status === 404) {
                            errorMessage = 'Product not found. Please try again later.';
                        } else if (res.status === 500) {
                            errorMessage = 'A server error occurred.';
                        }

                        showError(errorMessage);

                        if (typeof callback === 'function') {
                            callback(errorMessage, null);
                        }
                    }
                });
            }


            function addProduct(formData) {
                let fd = new FormData();
                fd.append('product_name', formData.product_name);
                fd.append('product_price', formData.product_price);
                fd.append('category_id', formData.category_id);
                fd.append('quantity', formData.quantity);

                for (let i = 1; i <= 11; i++) {
                    fd.append(`des_${i}`, formData[`des_${i}`] ?? '');
                }

                for (let i = 0; i < formData.images.length; i++) {
                    fd.append(`images[]`, formData.images[i]);
                }

                // Thêm các size (S, M, L, XL, 2XL)
                fd.append('size_s_quantity', formData.size_s_quantity || 0);
                fd.append('size_m_quantity', formData.size_m_quantity || 0);
                fd.append('size_l_quantity', formData.size_l_quantity || 0);
                fd.append('size_xl_quantity', formData.size_xl_quantity || 0);
                fd.append('size_2xl_quantity', formData.size_2xl_quantity || 0);

                $.ajax({
                    url: '/add-product',
                    method: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status === 200) {
                            let fdData = {
                                "product_id": res.data.product_id,
                                "quantity": formData.quantity
                            };

                            addProductImg(res.data.product_id, formData.images);
                        } else {
                            $.alert('Failed to add Product');
                        }
                    },
                    error: function(res) {
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError(res.responseJSON.error);
                        } else {
                            showError('Something went wrong. Please try again later!');
                        }
                    }
                });
            }


            function addProductImg(productId, images) {
                let fd = new FormData();
                fd.append('product_id', productId);
                for (let i = 0; i < images.length; i++) {
                    fd.append(`images[]`, images[i]);
                }

                $.ajax({
                    url: '/add-product-img',
                    method: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status == 200) {
                            getAllProdut([
                                displayTbProducts,
                                displayProductImages,
                                displayProductDescription1,
                                displayProductDescription2
                            ]);

                            showSuccess('product added successfully🎉');
                        } else {
                            $.alert('Failed to add Product image');
                        }
                    },
                    error: function(res) {
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError(res.responseJSON.error);
                        } else {
                            showError('Something went wrong. Please try again later!');
                        }
                    }
                });
            }

            function updateProductImg(productId, images) {
                let fd = new FormData();
                fd.append('product_id', productId);
                for (let i = 0; i < images.length; i++) {
                    fd.append(`images[]`, images[i]);
                }

                $.ajax({
                    url: '/edit-product-img',
                    method: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status == 200) {
                            getAllProdut([
                                displayTbProducts,
                                displayProductImages,
                                displayProductDescription1,
                                displayProductDescription2
                            ]);

                            showSuccess(res.message);
                        } else {
                            $.alert('Failed to add Product image');
                        }
                    },
                    error: function(res) {
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            let firstError = Object.values(error)[0][0];
                            showError(firstError);
                        } else if (res.status === 500) {
                            showError(res.responseJSON.error);
                        } else {
                            showError('Something went wrong. Please try again later!');
                        }
                    }
                });
            }

            function deleteProductImg(id) {
                $.ajax({
                    url: '/delete-product-img',
                    method: 'DELETE',
                    data: {
                        product_id: id
                    },
                    success: function(res) {
                        if (res.status === 200) {
                            getAllProdut([
                                displayTbProducts,
                                displayProductImages,
                                displayProductDescription1,
                                displayProductDescription2
                            ]);

                            showSuccess1('Product deleted successfully🎉');
                        } else {
                            $.alert('Failed to delete product');
                        }
                    },
                    error: function(res) {
                        let errorMessage = 'An error occurred. Please try again later.';
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            errorMessage = Object.values(error)[0][0];
                        } else if (res.status === 404) {
                            errorMessage = res.responseJSON.error;
                        } else if (res.status === 500) {
                            errorMessage = 'A server error occurred.';
                        }

                        showError(errorMessage);
                    }
                });
            }

            function removeActiveClass() {
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
            }

            dashboardActionLink.addEventListener("click", function(event) {
                event.preventDefault();
                removeActiveClass();
                this.classList.add('active');
                showDashboard();
            });


            OrderActionLink.addEventListener("click", function(e) {
                e.preventDefault();
                removeActiveClass();
                this.classList.add('active');

                ShowOrderContent();
            });

    function ShowOrderContent() {
        hideAllTabsContent(); // Ẩn toàn bộ các tab

        orderContent.style.display = 'block'; // Hiện tab Order
    }



            // fun getAllOrders
    function getAllOrders(callback = null) {
                $.ajax({
                    url: '/getall-order',
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(res) {
                        if (res.status === 200) {
                            LsOrdersForCountBadgeNumber = [];
                            OrdersLsGL = [];

                            res.data.forEach(item => {
                                OrdersLsGL.push(item);

                                if (item.status === 'processing') {
                                    LsOrdersForCountBadgeNumber.push(item);
                                }
                            });


                            $('#id-badge-order').text(LsOrdersForCountBadgeNumber.length).removeClass('d-none');

                            displayContentOrders();

                            if (callback && typeof callback === 'function') {
                                callback(res.data);
                            }
                        } else {
                            alert('Failed get orders.!!');
                        }
                    },
                    error: function(res) {
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

            getAllOrders(function(data) {

                data.forEach(item => {
                    totalAmountGl += item.total_amount;

                    LsOrderDataGl.push(item);

                    const today = new Date().toISOString().slice(0, 10);

                    // Get today amount 
                    if (item.order_date.slice(0, 10) === today) {
                        todayAmountGl += item.total_amount;
                    }
                });

                if (data) {
                    getAllProdut([], function(dataPro) {
                        if (dataPro) {
                            getAllUsers(function(usersData) {
                                if (usersData) {
                                    countUsersGl = usersData.length;
                                    // Trigger click on dashboardActionLink to load the dashboard on page load
                                    dashboardActionLink.click();
                                }
                            });

                        }
                    });
                }
            });

            // formate date
    function formatDate(inputDate) {
                const date = new Date(inputDate);

                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = date.getUTCFullYear();

                let hours = date.getUTCHours();
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const seconds = String(date.getUTCSeconds()).padStart(2, '0');

                // Determine AM or PM and convert hours to 12-hour format
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    }

            //Content Orders
    function displayContentOrders() {
    const dvContentOrder = document.getElementById("id-content-order");

    dvContentOrder.innerHTML = `
        <div class="container mt-3">
            <h2 class="mb-2">Orders Management</h2>
            <div class="table-responsive">
                <table class="table" id="ordersTable">
                    <thead class="table-dark">
                        <tr>
                            <th>Nº</th>
                            <th>Customer</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Order Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const ordersTableBody = document.getElementById("ordersTableBody");
    let numberCount = 0;

    OrdersLsGL.sort((a, b) => {
        const statusPriority = {
            'processing': 1,
            'shipped': 2,
            'delivered': 3,
            'cancelled': 4, // ✅ lowercase để so sánh đúng
        };

        return statusPriority[a.status.toLowerCase()] - statusPriority[b.status.toLowerCase()];
    });

    OrdersLsGL.forEach(order => {
        numberCount++;
        const formattedDateTime = formatDate(order.order_date);

        const status = order.status.toLowerCase(); // ✅ lowercase để xử lý thống nhất

        // ✅ Gán màu theo trạng thái
        let badgeClass = '';
        switch (status) {
            case 'processing':
                badgeClass = 'bg-warning';
                break;
            case 'shipped':
                badgeClass = 'bg-primary';
                break;
            case 'delivered':
                badgeClass = 'bg-success';
                break;
            case 'cancelled':
                badgeClass = 'bg-danger'; // ✅ đỏ cho cancelled
                break;
            default:
                badgeClass = 'bg-secondary';
        }

        // ✅ Chỉ hiển thị nút Edit nếu trạng thái KHÔNG PHẢI là 'cancelled' hoặc 'delivered'
        let editButton = '';
        if (status !== 'cancelled' && status !== 'delivered') {
            editButton = `
                <button class="btn btn-warning btn-sm btn-edit-order"
                    data-order-id="${order.order_id}"
                    data-order-status="${order.status}">
                    Edit
                </button>
            `;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${numberCount}</td>
            <td>${order.users.username}</td>
            <td>$${order.total_amount}</td>
            <td><span class="badge ${badgeClass}">${order.status}</span></td>
            <td>${formattedDateTime}</td>
            <td>
                <button class="btn btn-info btn-sm btn-view-order" data-order-id="${order.order_id}">View</button>
                ${editButton}
                <button class="btn btn-danger btn-sm btn-delete-order" data-order-id="${order.order_id}">Delete</button>
                <input type="hidden" class="order-data" value='${JSON.stringify(order)}' />
            </td>
        `;

        ordersTableBody.appendChild(row);
    });

    MyDataTable('#ordersTable', 30);

    $("#ordersTableBody").on('click', '.btn-edit-order', function (e) {
        e.stopPropagation();
        var order_id = $(this).data("order-id");
        var order_status = $(this).data("order-status");
        editOrderDialog(order_id, order_status);
    });

    $("#ordersTableBody").on('click', '.btn-delete-order', function (e) {
        e.stopPropagation();
        var orderData = $(this).closest("td").find(".order-data").val();
        orderData = JSON.parse(orderData);
        deleteOrderDialog(orderData);
    });

    $("#ordersTableBody").on('click', '.btn-view-order', function (e) {
        e.stopPropagation();
        var orderData = $(this).closest("td").find(".order-data").val();
        orderData = JSON.parse(orderData);
        viewOrderDialog(orderData);
    });
    }


    function viewOrderDialog(orderData) {
            
                const orderItemsHTML = orderData.order_items.map(item => {
                    const variant = item.variant || {};
                    const product = variant.product || {};
                    const productName = product.product_name || 'No name';
                    const size = variant.size || 'N/A';
                    const price = item.price ?? '0.00';
                    const quantity = item.quantity ?? 0;
                    const dmain = window.location.origin;
            
                    const imagePath = (product.product_images && product.product_images.length > 0)
                        ? `${dmain}/uploads/products/${product.product_images[0].image_path}`
                        : `https://via.placeholder.com/50x50?text=No+Image`;
                        return `
                            <div class="order-item" style="border-bottom: 1px solid #eee; padding: 10px; display: flex; align-items: center;">
                                <img src="${imagePath}" 
                                    style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
                                <div>
                                    <h5 style="margin: 0; font-weight: bold; display: flex; align-items: center;">
                                        🛒 ${productName}
                                    </h5>
                                    <p style="margin: 0; color: #888;">💲 Price: $${price}</p>
                                    <p style="margin: 0; color: #888;">📦 Quantity: ${quantity}</p>
                                    <p style="margin: 0; color: #888;">📏 Size: ${size}</p>
                                </div>
                            </div>
                        `;
                }).join('');

                const user = orderData.users || {};
                const username = user.username || 'Unknown';
                const email = user.email || 'N/A';
                const phone = user.phone_number || 'N/A';
                const address = user.address || 'N/A';
                const country = user.country || '';
                const status = orderData.status || 'Pending';
                const totalAmount = orderData.total_amount ?? '0.00';
                const orderDate = orderData.order_date ? formatDate(orderData.order_date) : 'N/A';

                MyJConfirmDialog({
                    title: `<strong>👁️ View Order #${orderData.order_id}</strong>`,
                    content: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h4 style="color: #333; margin-bottom: 10px;">📃 Order Summary</h4>
                            <p><strong>🆔 Order ID:</strong> ${orderData.order_id}</p>
                            <p><strong>🔄 Status:</strong> ${status}</p>
                            <p><strong>💰 Total Amount:</strong> $${totalAmount}</p>
                            <p><strong>📅 Order Date:</strong> ${orderDate}</p>
            
                            <hr style="margin: 10px 0; border-top: 1px solid #ddd;">
            
                            <h4 style="color: #333; margin-bottom: 10px;">👤 Customer Info</h4>
                            <p><strong>📛 Name:</strong> ${username}</p>
                            <p><strong>📞 Phone:</strong> ${phone}</p>
                            <p><strong>🏠 Address:</strong> ${address}${country ? ', ' + country : ''}</p>
            
                            <hr style="margin: 10px 0; border-top: 1px solid #ddd;">
            
                            <h4 style="color: #333; margin-bottom: 10px;">📦 Order Items</h4>
                            <div style="max-height: 200px; overflow-y: auto;">
                                ${orderItemsHTML}
                            </div>
                        </div>
                    `,
                    confirmText: "Close",
                    confirmBtnClass: "btn-info",
                    columnClass: "m",
                    type: "blue",
                    onConfirm: function () { /* Đóng dialog */ }
                });
    }
            
    function editOrderDialog(orderId, status) {
                MyJConfirmDialog({
                    title: '<strong><i class="fas fa-sync-alt" style="color: orange; margin-right: 5px;"></i> Update Order</strong>',
                    confirmText: 'Update',
                    content: `
                <div style="margin-top: 10px;">
                    <label for="orderStatus" style="font-weight: bold;">Order Status:</label>
                    <select id="orderStatus" class="form-control mt-2">
                        <option value="processing" >Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
            `,
                    confirmBtnClass: 'btn-warning',
                    columnClass: 'm',
                    type: 'orange',
                    onConfirm: function() {
                        const selectedStatus = document.getElementById("orderStatus").value;

                        updateOrder(orderId, selectedStatus);
                    },
                    cancelText: 'Cancel',
                    onCancel: function() {

                    },
                    onOpenBefore: function() {

                    },
                });
    }

    function updateOrder(order_id, status) {
                $.ajax({
                    url: '/edit-order',
                    method: 'PUT',
                    data: {
                        "order_id": order_id,
                        "status": status,
                    },
                    success: function(res) {
                        if (res.status === 200) {
                            getAllOrders();

                            showSuccess("Order updated successfully🎉");
                        } else {
                            $.alert('Failed to update order');
                        }
                    },
                    error: function(res) {
                        let errorMessage = 'An error occurred. Please try again later.';
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            errorMessage = Object.values(error)[0][0];
                        } else if (res.status === 500) {
                            errorMessage = 'A server error occurred.';
                        }

                        showError(errorMessage);
                    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                });
    }

    function deleteOrderDialog(orderData) {
                const { order_id, total_amount, status, order_date, order_items, users } = orderData;
                const { username, email, phone_number, address, country } = users;

                // Create HTML for order items (products with their images, names, and quantities)
                const orderItemsHTML = order_items.map(item => `
                    <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 8px 0;">
                        <img src="${window.location.origin}/uploads/products/${item.variant.product.product_images[0]?.image_path}" 
                            style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
                        <div>
                            <h5 style="margin: 0; font-weight: bold;">🛒 ${item.variant.product.product_name}</h5>
                            <p style="margin: 0; color: #888;">📦 Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                `).join('');

                // Confirm Dialog for Deleting Order
                MyJConfirmDialog({
                    title: '<strong><i class="fas fa-trash-alt" style="color: red; margin-right: 5px;"></i> Delete Order</strong>',
                    confirmText: 'Delete Order',
                    content: `
                <div style="text-align: center; padding: 10px;">
                    <p style="font-size: 16px; color: #555;">
                        Are you sure you want to delete this order for customer: <strong>${username}</strong>?
                    </p>
                    <div style="margin: 10px 0; font-size: 14px; color: #333;">
                        <strong>Order ID:</strong> ${order_id}<br>
                        <strong>Status:</strong> ${status}<br>
                        <strong>Total Amount:</strong> $${total_amount}<br>
                        <strong>Order Date:</strong> ${formatDate(order_date)}
                    </div>
                    <hr style="margin: 15px 0;">
                    
                    <h4 style="font-size: 16px; color: #333; margin-bottom: 10px;">Order Items</h4>
                    <div style="max-height: 200px; overflow-y: auto; font-size: 14px; color: #555;">
                        ${orderItemsHTML}
                    </div>
                    
                    <hr style="margin: 15px 0;">
                    
                    <div style="font-size: 14px; color: #555;">
                        <p><i class="fas fa-user-circle" style="color: #007bff; margin-right: 5px;"></i> <strong>Customer:</strong> ${username}</p>
                        <p><i class="fas fa-envelope" style="color: #007bff; margin-right: 5px;"></i> <strong>Email:</strong> ${email}</p>
                        <p><i class="fas fa-phone" style="color: #007bff; margin-right: 5px;"></i> <strong>Phone:</strong> ${phone_number}</p>
                        <p><i class="fas fa-map-marker-alt" style="color: #007bff; margin-right: 5px;"></i> <strong>Address:</strong> ${address ? address : 'N/A'}, ${country}</p>
                    </div>
                    
                    <hr style="margin: 15px 0;">
                    <p style="font-size: 14px; color: #888;">
                        This action cannot be undone. Please confirm if you want to proceed.
                    </p>
                    <i class="fas fa-exclamation-triangle" style="color: orange; font-size: 40px; margin-top: 15px;"></i>
                </div>
            `,
                    confirmBtnClass: 'btn-danger',
                    cancelBtnClass: 'btn-secondary',
                    autoClose: 'Cancel|50000',
                    columnClass: 'm',
                    type: 'red',
                    onConfirm: function() {
                        deleteOrder(order_id); // Function to delete the order
                    },
                    cancelText: 'Cancel',
                    onCancel: function() {
                        // Handle cancel action
                    },
                    onOpenBefore: function() {
                        // Optional: Action to take before the dialog opens
                    },
                });
    }

    function deleteOrder(order_id) {
                $.ajax({
                    url: '/delete-order',
                    method: 'DELETE',
                    data: {
                        "order_id": order_id
                    },
                    success: function(res) {
                        if (res.status === 200) {
                            getAllOrders();

                            showSuccess("Order deleted successfully🎉");
                        } else {
                            $.alert('Failed to delete order');
                        }
                    },
                    error: function(res) {
                        let errorMessage = 'An error occurred. Please try again later.';
                        if (res.status === 422) {
                            let error = res.responseJSON.error;
                            errorMessage = Object.values(error)[0][0];
                        } else if (res.status === 500) {
                            errorMessage = 'A server error occurred.';
                        }

                        showError(errorMessage);
                    }
                });
    }


            productActionLink.addEventListener("click", function(event) {
                event.preventDefault();
                removeActiveClass();
                this.classList.add('active');
                prodcut_Content();
            });


function hideAllTabsContent() {
    dashboardContent.style.display = "none";
    orderContent.style.display = "none";
    productContent.style.display = "none";
    proImageContent.style.display = "none";
    proDescription1.style.display = "none";
    proDescription2.style.display = "none";
    document.getElementById("id-banner-content").style.display = "none";
    document.getElementById("event-content").style.display = "none";
}


function showDashboard() {
    hideAllTabsContent(); // Ẩn tất cả tab nội dung trước

    dashboardContent.style.display = "block"; // Hiện dashboard
    displayContentDashboard(); // Gọi hàm xử lý nội dung dashboard nếu có
}


    function prodcut_Content() {
    hideAllTabsContent(); // Ẩn tất cả trước
    productContent.style.display = "block";
    proImageContent.style.display = "block";
    proDescription1.style.display = "block";
    proDescription2.style.display = "block";
    displayTbProducts();
    displayProductImages();
    displayProductDescription1();
    displayProductDescription2();
}

    function displayTbProducts() {
                var tableContainer = document.getElementById("table_product");
                tableContainer.innerHTML = "";

                var tableHtml = `
            <table class="table table-hover" id="product-table">
                <thead>
                    <tr class="table-info fw-bold thead-danger">
                        <th>Nº</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="product-table-body">
                </tbody>
            </table>
        `;

                tableContainer.innerHTML = tableHtml;
                var tbody = document.getElementById("product-table-body");

                for (var i = 0; i < productsLsGL.length; i++) {
                    var product = productsLsGL[i];

                    // Hiển thị tồn kho theo từng size (variant)
                    var stockText = '';
                    if (product.variants.length > 0) {
                        var stockArr = product.variants.map(function(variant) {
                            var size = variant.size || 'N/A';
                            var qty = variant.quantity;
                            var color = qty == 0 ? 'text-danger' : 'text-success';
                            return `<span class="${color}">${size}=${qty}</span>`;
                        });
                        stockText = stockArr.join(', ');
                    } else {
                        stockText = '<span class="text-danger">No variants</span>';
                    }


                    var rHtml = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${product.product_name}</td>
                    <td>${product.category_name}</td>
                    <td>$${product.product_price}</td>
                    <td>${stockText}</td>
                   <td>
                        <div class="d-flex">
                            <button class="btn btn-warning me-1 btn-edit-product" data-product-id="${product.product_id}" data-product-name="${product.product_name}" data-product-price="${product.product_price}" data-product-stock="${product.stock}">
                                <i class="fas fa-edit"></i> 
                            </button>
                            <button class="btn btn-danger btn-delete-product" data-product-id="${product.product_id}" data-product-name="${product.product_name}" data-product-price="${product.product_price}" data-product-stock="${product.stock}">
                                <i class="fas fa-trash-alt"></i> 
                            </button>
                        </div>
                    </td>
                </tr>
            `;

                    tbody.innerHTML += rHtml;
                }

                MyDataTable('#product-table');

                //$(document).on('click', '.btn-edit-product', function (e) {
                //$(".btn-edit-product").off('click').on('click', function (e) {
                $(document).off('click', '.btn-edit-product').on('click', '.btn-edit-product', function(e) {
                    e.stopPropagation();
                    var product_id = $(this).data("product-id");
                    updateProductDialog(product_id, productsLsGL);
                });

                $(document).off('click', '.btn-delete-product').on('click', '.btn-delete-product', function(e) {
                    //$(document).on('click', '.btn-delete-product', function (e) {
                    //$(".btn-delete-product").on('click', function (e) {
                    e.stopPropagation();
                    var product_id = $(this).data("product-id");
                    var product_name = $(this).data("product-name");
                    deleteProductDialog(product_id, product_name);
                });
    }

    function updateProductDialog(product_id, productsLsGL) {
                let categoryOptions = categoriesLsGL.map(ct =>
                    `<option value="${ct.category_id}">${ct.category_name}</option>`
                ).join('');

                MyJConfirmDialog({
                            title: '<strong>Update Product</strong>',
                            confirmText: 'Update',
                            content: ` 
                    <form action = "" class="formName" > 
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="productName" placeholder="Enter product name" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Product Price</label>
                            <input type="number" min="0" id="productPrice" placeholder="Enter product price" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Product Stock (auto-calculated)</label>
                            <input type="number" id="productStock" class="form-control" readonly />
                        </div>
                        <div class="form-group">
                            <label>Size Options</label>
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <label>Size S Quantity</label>
                                    <input type="number" min="0" id="sizeSQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size M Quantity</label>
                                    <input type="number" min="0" id="sizeMQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size L Quantity</label>
                                    <input type="number" min="0" id="sizeLQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size XL Quantity</label>
                                    <input type="number" min="0" id="sizeXLQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size 2XL Quantity</label>
                                    <input type="number" min="0" id="size2XLQty" class="form-control size-input" />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="category" class="form-control" required>
                                <option value="">Select a category</option>
                                ${categoryOptions} 
                            </select>
                        </div>
                        ${[...Array(11).keys()].map(i =>
                            `<div class="form-group">
                                <label>Description ${i + 1} (Optional)</label>
                                <textarea id="des${i + 1}" placeholder="Enter description ${i + 1}" class="form-control"></textarea>
                            </div>`
                        ).join('')}
                        <div class="form-group">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <label>Image ${i} (Optional)</label>
                                <input type="file" id="productImage${i}" accept="image/*" class="form-control" />`
                            ).join('')}
                        </div>
                    </form >
                `,
            confirmBtnClass: 'btn-warning',
            columnClass: 'm',
            type: 'orange',
            onConfirm: function () {
                const formData = {
                    product_id: product_id,
                    product_name: $('#productName').val(),
                    product_price: $('#productPrice').val(),
                    category_id: $('#category').val(),
                    variants: [],
                };

                for (let i = 1; i <= 11; i++) {
                    let desValue = $(`#des${i}`).val();
                    if (desValue) {
                        formData[`des_${i}`] = desValue;
                    }
                }

                const sizes = ['S', 'M', 'L', 'XL', '2XL'];
                sizes.forEach(size => {
                    const qty = parseInt($(`#size${size}Qty`).val());
                    if (!isNaN(qty) && qty >= 0) {
                        formData.variants.push({
                            size: size,
                            quantity: qty
                        });
                    }
                });
            
                // Lấy ảnh nếu có
                const imageFiles = [];
                for (let i = 1; i <= 5; i++) {
                    let fileInput = $(`#productImage${i}`)[0].files[0];
                    if (fileInput) {
                        imageFiles.push(fileInput);
                    }
                }

                updateProduct(formData, function (error, res) {
                    if (error) {
                    } else {
                        updateProductImg(product_id, imageFiles);
                    }
                });
            },
            cancelText: 'Cancel',
            onCancel: function () {

            },
            onOpenBefore: function () {
                const product = productsLsGL.find(p => p.product_id === product_id);
            
                $('#productName').val(product.product_name);
                $('#productPrice').val(product.product_price);
                $('#productStock').val(product.quantity || 0);
                $('#category').val(product.category_id);
            
                if (product.descriptions) {
                    for (let i = 1; i <= 11; i++) {
                        const desKey = `des_${i}`;
                        $(`#des${i}`).val(product.descriptions[desKey] || '');
                    }
                }
            
                if (product.variants) {
                    product.variants.forEach(variant => {
                        const size = variant.size;
                        const fieldId = `size${size}Qty`;
                        $(`#${fieldId}`).val(variant.quantity);
                    });
                }
            
                // Tính tổng số lượng từ size
                const updateTotalStock = () => {
                    let total = 0;
                    $('.size-input').each(function () {
                        let val = parseInt($(this).val());
                        if (!isNaN(val) && val >= 0) {
                            total += val;
                        }
                    });
                    $('#productStock').val(total);
                };
            
                $('.size-input').on('input', function () {
                    if (this.value < 0) this.value = 0;
                    updateTotalStock();
                });
            
                $('#productPrice').on('input', function () {
                    if (this.value < 0) this.value = 0;
                });
            
                // Gọi để hiển thị tổng đúng ngay khi mở
                updateTotalStock();
            }
        });
    }

    function deleteProductDialog(id, product_name) {
        let fd = {
            product_id: id
        }
        MyJConfirmDialog({
            title: 'Delete Product',
            content: `Are you sure you want to delete product name 👉${product_name} ?`,
            confirmText: 'Delete',
            confirmBtnClass: 'btn-warning',
            columnClass: 'm',
            autoClose: 'Cancel|30000',
            onConfirm: function () {
                deleteProduct(
                    fd, function (error, res) {
                        if (res) {
                            deleteProductImg(id);
                        }
                    },
                );
            },
            cancelText: 'Cancel',
            onCancel: function () {
            }
        });
    }

    function displayProductImages() {
        var proImageTb = document.getElementById('table_product_imgs');
        proImageTb.innerHTML = "";

        var tbImgHtml = `
            <table class="table table-hover" id="product-images-table">
                <thead>
                    <tr class="table-info fw-bold thead-danger">
                        <th>Nº</th>
                        <th>Product Name</th>
                        <th>Images</th>
                    </tr>
                </thead>
                <tbody id="product-images-table-body">
                </tbody>
            </table>
        `;
        proImageTb.innerHTML = tbImgHtml;
        var tbody = document.getElementById("product-images-table-body");

        productsLsGL.forEach((product, index) => {
            const dmain = window.location.origin;

            const imageList = product.images.map(image => `
                <a>
                    <img src="${dmain}/uploads/products/${image}" alt="${product.product_name}" style="width: 50px; height: 50px; margin-right: 5px;">
                </a>
            `).join('');

            const r = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.product_name}</td>
                    <td>${imageList}</td>
                
                    </tr>
            `;
            tbody.innerHTML += r;
        });

        MyDataTable('#product-images-table');


    }

    function displayProductDescription1() {
        proDescription1.innerHTML = "";

        var tableHtml = `
        <table class="table table-hover" id="product-table1-des">
            <thead>
                <tr class="table-info fw-bold thead-danger">
                    <th class="text-nowrap">Nº</th>
                    <th class="text-nowrap">Product Name</th>
                    <th class="text-nowrap">Description 1</th>
                    <th class="text-nowrap">Description 2</th>
                    <th class="text-nowrap">Description 3</th>
                    <th class="text-nowrap">Description 4</th>
                    <th class="text-nowrap">Description 5</th>
                    <th class="text-nowrap">Description 6</th>
                </tr>
            </thead>
            <tbody id="product-table-body-des1">
            </tbody>
        </table>
    `;

        proDescription1.innerHTML = tableHtml;
        var tbody = document.getElementById("product-table-body-des1");

        for (var i = 0; i < productsLsGL.length; i++) {
            var product = productsLsGL[i];
            var descriptions = product.descriptions || {};

            var descriptionHtml = '';
            for (var j = 1; j < 7; j++) {
                var desKey = 'des_' + j;
                descriptionHtml += `<td class="description-cell">${descriptions[desKey] || 'N/A'}</td>`;
            }

            var rHtml = `
            <tr>
                <td>${i + 1}</td> 
                <td>${product.product_name}</td> 
                ${descriptionHtml}
            </tr>
        `;

            tbody.innerHTML += rHtml;
        }

        if ($.fn.DataTable.isDataTable('#product-table1-des')) {
            $('#product-table1-des').DataTable().clear().destroy();
        }
        MyDataTable('#product-table1-des');
    }

    function displayProductDescription2() {
        proDescription2.innerHTML = "";

        var tableHtml = `
            <table class="table table-hover" id="product-table2-des">
                <thead>
                    <tr class="table-info fw-bold thead-danger">
                        <th class="text-nowrap">Nº</th>
                        <th class="text-nowrap">Product Name</th>
                        <th class="text-nowrap">Description 7</th>
                        <th class="text-nowrap">Description 8</th>
                        <th class="text-nowrap">Description 9</th>
                        <th class="text-nowrap">Description 10</th>
                        <th class="text-nowrap">Description 11</th>
                    </tr>
                </thead>
                <tbody id="product-table-body2-des">
                </tbody>
            </table>
        `;

        proDescription2.innerHTML = tableHtml;
        var tbody = document.getElementById("product-table-body2-des");

        for (var i = 0; i < productsLsGL.length; i++) {
            var product = productsLsGL[i];
            var descriptions = product.descriptions || {};

            var descriptionHtml = '';
            for (var j = 7; j <= 11; j++) {
                var desKey = 'des_' + j;
                descriptionHtml += `<td class="description-cell">${descriptions[desKey] || 'N/A'}</td>`;
            }

            var rHtml = `
                <tr>
                    <td>${i + 1}</td> 
                    <td>${product.product_name}</td> 
                    ${descriptionHtml}
                </tr>
            `;

            tbody.innerHTML += rHtml;
        }

        if ($.fn.DataTable.isDataTable('#product-table2-des')) {
            $('#product-table2-des').DataTable().clear().destroy();
        }
        MyDataTable('#product-table2-des');
    }

    function btnAddProduct() {
        $('#addProductButton').click(function () {
            if (categoriesLsGL.length == 0) {
                $.alert({
                    title: 'Warning!',
                    content: 'No categories found. Please add categories first.',
                });
                return;
            }
            let categoryOptions = categoriesLsGL.map(ct =>
                `<option value="${ct.category_id}">${ct.category_name}</option>`
            ).join('');
    
            $.confirm({
                title: '<strong>Add New Product</strong>',
                closeIcon: true,
                columnClass: 'm',
                draggable: true,
                typeAnimated: true,
                type: 'blue',
                content: `
                    <form class="formName"> 
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="productName" placeholder="Enter product name" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Product Price</label>
                            <input type="number" min="0" id="productPrice" placeholder="Enter product price" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Product Stock (auto-calculated)</label>
                            <input type="number" id="productStock" class="form-control" readonly />
                        </div>
                        <div class="form-group">
                            <label>Size Options</label>
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <label>Size S Quantity</label>
                                    <input type="number" min="0" id="sizeSQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size M Quantity</label>
                                    <input type="number" min="0" id="sizeMQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size L Quantity</label>
                                    <input type="number" min="0" id="sizeLQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size XL Quantity</label>
                                    <input type="number" min="0" id="sizeXLQty" class="form-control size-input" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label>Size 2XL Quantity</label>
                                    <input type="number" min="0" id="size2XLQty" class="form-control size-input" />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="category" class="form-control" required>
                                <option value="">Select a category</option>
                                ${categoryOptions} 
                            </select>
                        </div>
                        ${[...Array(11).keys()].map(i =>
                            `<div class="form-group">
                                <label>Description ${i + 1} (Optional)</label>
                                <textarea id="des${i + 1}" placeholder="Enter description ${i + 1}" class="form-control"></textarea>
                            </div>`
                        ).join('')}
                        <div class="form-group">
                            <div class="form-group">
                                <label>Product Images (You can select multiple)</label>
                                <input type="file" id="productImages" accept="image/*" multiple class="form-control" />
                            </div>
                        </div>
                    </form>
                `,
                buttons: {
                    formSubmit: {
                        text: 'Add Product',
                        btnClass: 'btn-blue',
                        action: function () {
                            var productName = $('#productName').val();
                            var productPrice = $('#productPrice').val();
                            var category = $('#category').val();
    
                            if (!productName || !productPrice || !category) {
                                $.alert('Please fill out the product name, product price, and category!');
                                return false;
                            }
    
                            var formData = {
                                quantity: $('#productStock').val(),
                                product_name: productName,
                                product_price: productPrice,
                                category_id: category,
                                images: []
                            };
                            formData.size_s_quantity = $('#sizeSQty').val() || 0;
                            formData.size_m_quantity = $('#sizeMQty').val() || 0;
                            formData.size_l_quantity = $('#sizeLQty').val() || 0;
                            formData.size_xl_quantity = $('#sizeXLQty').val() || 0;
                            formData.size_2xl_quantity = $('#size2XLQty').val() || 0;
    
                            for (let i = 1; i <= 11; i++) {
                                let desValue = $(`#des${i}`).val();
                                if (desValue) {
                                    formData[`des_${i}`] = desValue;
                                }
                            }
    
                            let files = $('#productImages')[0].files;
                            for (let i = 0; i < files.length; i++) {
                                formData.images.push(files[i]);
                            }
                            addProduct(formData);
                            clearInputs();
                            Swal.fire({
                            icon: 'success',
                            title: 'បានបន្ថែមផលិតផល',
                            text: 'ផលិតផលត្រូវបានបន្ថែមដោយជោគជ័យ!',
                            timer: 1000,
                            showConfirmButton: false
                        });
                            return false;
                        }
                    },
                    cancel: function () { }
                },
                onOpenBefore: function () {
                    const contentArea = this.$content;
                    contentArea.css({
                        'max-height': '70vh',
                        'overflow-y': 'auto',
                    });
    
                    const updateTotalStock = () => {
                        let total = 0;
                        $('.size-input').each(function () {
                            let val = parseInt($(this).val());
                            if (!isNaN(val) && val >= 0) {
                                total += val;
                            }
                        });
                        $('#productStock').val(total);
                    };
    
                    $('.size-input').on('input', function () {
                        if (this.value < 0) this.value = 0;
                        updateTotalStock();
                    });
    
                    $('#productPrice').on('input', function () {
                        if (this.value < 0) this.value = 0;
                    });
                }
            });
        });
    }
    
    btnAddProduct();    

    function clearInputs() {
        $('#productName').val('');
        $('#productPrice').val('');
        $('#productStock').val('');
        $('#category').val('');

        for (let i = 1; i <= 11; i++) {
            $(`#des${i}`).val('');
        }

        for (let i = 1; i <= 5; i++) {
            $(`#productImage${i}`).val('');
        }
    }
    function btnAddCategory() {
        $('#addCategory').click(function () {
            $.confirm({
                title: '<strong>Add Category</strong>',
                closeIcon: true,
                columnClass: 'm',
                draggable: true,
                typeAnimated: true,
                type: 'blue',
                content: `
               <div>
                    <form  class="formName" >
                        <div class="form-group">
                            <label>Category Name</label>
                            <input type="text" id="categoryName" placeholder="Enter category name" class="form-control" required />
                        </div>
                    </form >
               </div>

                <div class="mt-3">
                    <div class="IdTableCategory">
                    </div>
                </div>
            `,

                buttons: {
                    formSubmit: {
                        text: 'Add Category',
                        btnClass: 'btn-blue',
                        action: function () {
                            var categoryName = $('#categoryName').val();

                            if (!categoryName) {
                                $.alert('Please enter a category name!');
                                return false;
                            }

                            const formData = {
                                'category_name': categoryName
                            }

                            addCategory(formData, function (success) {
                                if (success) {
                                    $('#categoryName').val('');
                                    showSuccess('category added successfully🎉');
                                } else {
                                    $.alert('Error adding category!');
                                }
                            });

                            return false; // Prevent close confirm dialog
                        }
                    },
                    cancel: function () { }
                },
                onOpenBefore: function () {
                    displayCategoriesTable();
                }
            });
        });
    }

    btnAddCategory();

    function displayCategoriesTable() {
        const categoryTableHtml = `
            <table id="category-table" class="table table-hover">
                <thead>
                    <tr class="table-info fw-bold thead-danger">
                        <th>Nº</th>
                        <th>Category Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="categoryTableBody"></tbody>
            </table>
        `;

        const tableContainer = document.querySelector('.IdTableCategory');
        if (!tableContainer) {
            return;
        }

        tableContainer.innerHTML = categoryTableHtml;

        const categoryTableBody = document.getElementById('categoryTableBody');
        categoryTableBody.innerHTML = '';

        categoriesLsGL.forEach((ct, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${ct.category_name}</td>
                    <td>
                        <button class="btn-edit-category btn btn-warning btn-sm me-2" data-category-id="${ct.category_id}" data-category-name="${ct.category_name}">Edit</button>
                        <button class="btn-delete-category btn btn-danger btn-sm" data-category-id="${ct.category_id}" data-category-name="${ct.category_name}">Delete</button>
                    </td>
                </tr>
            `;
            categoryTableBody.innerHTML += row;
        });

        MyDataTable('#category-table');

        $(".btn-edit-category").on('click', function (e) {
            e.stopPropagation();
            var category_id = $(this).data("category-id");
            var category_name = $(this).data("category-name");
            updateCategoryDailog(category_id, category_name);
        });

        $(".btn-delete-category").on('click', function (e) {
            e.stopPropagation();
            var category_id = $(this).data("category-id");
            var category_name = $(this).data("category-name");
            deleteCategoryDialog(category_id, category_name);
        });
    }


    function updateCategoryDailog(id, category_name) {
        $.confirm({
            title: '<strong>Edit Category</strong>',
            content: `
               <div>
                    <form id = "editCategoryForm" class="formName">
                        <div class="form-group">
                            <label>Category Name</label>
                            <input type="text" id="idcategoryName" value="${category_name}" class="form-control" required />
                        </div>
                    </form >
               </div>
                `,
            autoClose: 'cancel|80000',
            typeAnimated: true,
            type: 'orange',
            columnClass: 'm',
            draggable: true,
            buttons: {
                update: {
                    text: 'Update',
                    btnClass: 'btn-warning',
                    action: function () {
                        var updatedCategoryName = $('#idcategoryName').val();

                        if (!updatedCategoryName) {
                            $.alert('Please enter a category name!');
                            return false;
                        }

                        const formData = {
                            'category_id': id,
                            'category_name': updatedCategoryName
                        };

                        updateCategory(formData);
                    },
                },
                cancel: function () {

                }
            }
        });
    }

    function deleteCategoryDialog(id, category_name) {
        const formData = {
            'category_id': id,
            'category_name': category_name
        };
        MyJConfirmDialog({
            title: '<strong>Delete Category</strong>',
            content: 'Do you want to delete category name 👉 ' + category_name + '?',
            confirmText: 'Delete',
            confirmBtnClass: 'btn-red',
            autoClose: 'Cancel|30000',
            type: 'red',
            onConfirm: function () {
                deleteCategory(formData);
            },
            cancelText: 'Cancel',
            onCancel: function () {
            }
        });
    }

    function MyJConfirmDialog(options) {
        let config = {
            title: options.title || 'Confirm',
            content: options.content || 'Are you sure?',
            columnClass: options.columnClass || 'm',
            draggable: true,
            typeAnimated: true,
            type: options.type || 'blue',
            buttons: {}
        };

        // Add Confirm button if confirmText is not null
        if (options.confirmText != null) {
            config.buttons.Confirm = {
                text: options.confirmText || 'Confirm',
                btnClass: options.confirmBtnClass || 'btn-blue',
                action: options.onConfirm || function () { }
            };
        }

        // Always add Cancel button
        config.buttons.Cancel = {
            text: options.cancelText || 'Cancel',
            action: options.onCancel || function () { }
        };

        config.onOpenBefore = function () {
            if (options.onOpenBefore) {
                options.onOpenBefore();
            }
        };

        config.onContentReady = function () {
            if (options.onContentReady) {
                options.onContentReady();
            }

            const contentArea = this.$content;
            contentArea.css({
                'max-height': '70vh', // Make the content scrollable if it's too long
                'overflow-y': 'auto',  // Add vertical scroll
            });
        };

        // Auto-close option
        if (options.autoClose != null) {
            config.autoClose = options.autoClose;
        }

        // Show the confirm dialog
        $.confirm(config);
    }



    function MyDataTable(tableId, pageLength = 10) {
        if ($.fn.dataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        $(tableId).DataTable({
            "info": false,                  // Disable table information display
            "lengthChange": false,           // Allow users to change the number of rows per page
            "pageLength": pageLength,       // Set the initial page length (default 10)
            "paging": true,                 // Enable pagination
            "searching": true,              // Enable search functionality
            "ordering": true,               // Enable sorting functionality
            "language": {
                "paginate": {
                    "previous": "<i class='fas fa-arrow-left'></i>",  // Previous button icon
                    "next": "<i class='fas fa-arrow-right'></i>"      // Next button icon
                }
            },
        });
    }

    function clearAndRemove() {
        localStorage.removeItem('username');
        sessionStorage.removeItem("token");
    }

    function logout() {
        clearAndRemove();
        $('#id-logout').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                url: '/logout',
                method: 'GET',
                success: function (res) {
                    hideLoading();
                    localStorage.removeItem('is_logged_in');
                    window.location.href = res.redirect_url;
                },
                error: function (res) {
                    //hideLoading();
                    if (res.status === 422) {
                        let error = res.responseJSON.error;
                        let firstError = Object.values(error)[0][0];
                        showError(firstError);
                    } else if (res.status === 402) {
                        showError(res.responseJSON.error);
                    } else {
                        showError('An error occurred. Please try again later.');
                    }
                }
            });
        });
    }
    logout();


    // all about in content dashboard
    function displayContentDashboard() {
    const dvContentDashboard = document.getElementById('id-conent-dashboard');

    // Lọc đơn hàng hợp lệ (không bị huỷ)
    const validOrders = OrdersLsGL.filter(order => order.status !== 'cancelled');
    const validOrdersData = LsOrderDataGl.filter(order => order.status !== 'cancelled');

    // Tính toán doanh thu
    const today = new Date().toDateString();
    const todayAmountGl = validOrders
        .filter(order => new Date(order.order_date).toDateString() === today)
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

    const totalAmountGl = validOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    dvContentDashboard.innerHTML = `

        <div class="row">
            <!-- First Row with Cards -->
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-top">
                <div class="dashboard-box p-4 bg-primary text-white rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <i class="fa fa-shopping-cart fa-3x me-3" aria-hidden="true"></i>
                        <div class="text-end">
                            <h6>Today's Sales</h6>
                            <h5>\$ ${todayAmountGl.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-top">
                <div class="dashboard-box p-4 bg-success text-white rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <i class="fa fa-line-chart fa-3x me-3" aria-hidden="true"></i>
                        <div class="text-end">
                            <h6>Total Sales</h6>
                            <h4>\$ ${totalAmountGl.toFixed(2)}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                <div class="dashboard-box p-4 bg-warning text-white rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <i class="fa fa-users fa-3x me-3" aria-hidden="true"></i>
                        <div class="text-end">
                            <h6>Total Users</h6>
                            <h4>${countUsersGl}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                <div class="dashboard-box p-4 bg-danger text-white rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <i class="fa fa-cart-arrow-down fa-3x me-3" aria-hidden="true"></i>
                        <div class="text-end">
                            <h6>Total Orders</h6>
                            <h4>${validOrders.length}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                <div class="dashboard-box p-4 bg-info text-white rounded">
                    <div class="d-flex align-items-center justify-content-around">
                        <i class="fa fa-cube fa-3x me-3" aria-hidden="true"></i>
                        <div class="text-end">
                            <h6>Total Products</h6>
                            <h4>${productsLsGL.length}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="row">
            <div class="col-lg-6 col-md-12 mb-4 slide-in-left">
                <div class="chart-box p-3">
                    <h5 class="text-center">Top Product Categories</h5>
                            <div style="width: 350px; height: 350px; margin: 0 auto;">
                                <canvas id="pieChart"></canvas>
                            </div>
                    <p id="noReportMessagePieChart" style="display:none; color:red;">No data category available.</p>
                </div>
            </div>

            <div class="col-lg-6 col-md-12 mb-4 slide-in-right">
                <div class="chart-box p-3">
                    <h5 class="text-center">Monthly Sales Report</h5>
                    <div class="d-flex justify-content-between mb-3">
                        <label class="form-label"></label>
                        <select id="yearSelect-column-chart" class="form-select" style="width: 150px;"></select>
                    </div>
                    <p id="noReportMessage" style="display:none; color:red;">No monthly sales report available.</p>
                    <canvas id="columnChart" style="width: 100%; height: 300px;"></canvas>
                </div>
            </div>
        </div>

        <div class="container mt-4">
  <!-- Orders Summary Table -->
  <div class="row">
    <div class="col-12 slide-in-left">
      <div class="table-responsive">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold mb-0">Orders Summary</h4>
        </div>
        <table class="table table-bordered" id="table-show-order-dashboard" style="width: 100%;">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Total Orders</th>
              <th>Total Products</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody id="orders-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Sold Products Summary Table -->
  <div class="row mt-5">
    <div class="col-12">
      <h4 class="fw-bold mb-3">Sold Products Summary</h4>
      <div class="table-responsive">
        <table class="table table-bordered" id="table-sold-products" style="width: 100%;">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Sold Quantity</th>
            </tr>
          </thead>
          <tbody id="sold-products-body">
            <!-- Rows will be inserted dynamically -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

    `;

    // Orders Summary by Customer
    const customerSummaryMap = {};
    validOrders.forEach(order => {
        const username = order.users.username;
        if (!customerSummaryMap[username]) {
            customerSummaryMap[username] = {
                totalOrders: 0,
                totalProducts: 0,
                totalAmount: 0
            };
        }

        customerSummaryMap[username].totalOrders += 1;
        customerSummaryMap[username].totalProducts += order.order_items?.length || 0;
        customerSummaryMap[username].totalAmount += order.total_amount || 0;
    });

    const ordersTableBody = document.getElementById("orders-table-body");
    ordersTableBody.innerHTML = '';
    let index = 1;
    for (const customerName in customerSummaryMap) {
        const summary = customerSummaryMap[customerName];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index}</td>
            <td>${customerName}</td>
            <td>${summary.totalOrders}</td>
            <td>${summary.totalProducts}</td>
            <td>$${summary.totalAmount.toFixed(2)}</td>
        `;
        ordersTableBody.appendChild(row);
        index++;
    }

    // Pie Chart for Top Product Categories
    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    const noDataPieChart = document.getElementById('noReportMessagePieChart');

    const categorySales = {};
    validOrdersData.forEach(order => {
        order.order_items.forEach(item => {
            const category_name = item.variant.product.category.category_name;
            const sold = item.variant?.sold || 0;
            categorySales[category_name] = (categorySales[category_name] || 0) + sold;
        });
    });

    const topCategories = Object.entries(categorySales).sort(([, a], [, b]) => b - a).slice(0, 3);
    const labels = topCategories.map(([name, sales]) => `${name} (Sold: ${sales})`);
    const data = topCategories.map(([, sales]) => sales);

    if (validOrdersData.length > 0) {
        dataExportToExcelGl.push({ 'top_categories': categorySales });

        noDataPieChart.style.display = 'none';
        document.getElementById('pieChart').style.display = 'block';

        new Chart(pieChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.label || '';
                            }
                        }
                    }
                }
            }
        });
    } else {
        document.getElementById('pieChart').style.display = 'none';
        noDataPieChart.style.display = 'block';
    }

    // Column Chart - Monthly Sales
    const columnChartCtx = document.getElementById('columnChart').getContext('2d');
    const monthlyDataByYear = {};
    const uniqueYears = [];

    validOrdersData.forEach(order => {
        const date = new Date(order.order_date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const amount = order.total_amount || 0;

        if (!monthlyDataByYear[year]) {
            monthlyDataByYear[year] = Array(12).fill(0);
            uniqueYears.push(year);
        }

        monthlyDataByYear[year][month] += amount;
    });

    const selectYear = document.getElementById('yearSelect-column-chart');
    const noReportMessage = document.getElementById('noReportMessage');
    selectYear.innerHTML = '';

    if (uniqueYears.length > 0) {
        uniqueYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectYear.appendChild(option);
        });
        selectYear.style.display = 'block';
        noReportMessage.style.display = 'none';
    } else {
        selectYear.style.display = 'none';
        noReportMessage.style.display = 'block';
    }

    function updateChart(selectedYear) {
        const filteredData = monthlyDataByYear[selectedYear] || Array(12).fill(0);
        chart.data.datasets[0].data = filteredData;
        chart.update();
    }

    const selectedYear = uniqueYears[0];
    const initialData = monthlyDataByYear[selectedYear] || Array(12).fill(0);

    const chart = new Chart(columnChartCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales',
                data: initialData,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: tooltipItem => `$${tooltipItem.raw}`
                    }
                }
            }
        }
    });

// Tính toán tổng số lượng bán cho từng sản phẩm
const productSalesMap = {};
validOrdersData.forEach(order => {
    order.order_items.forEach(item => {
        const product = item.variant.product;
        const productName = product.product_name;
        const soldQty = item.quantity || 0;
        const imageUrl = (product.product_images && product.product_images.length > 0)
            ? `/uploads/products/${product.product_images[0].image_path}`  // Lấy đường dẫn ảnh đầu tiên từ mảng product_images
            : `https://via.placeholder.com/50x50?text=No+Image`; 
        
            if (!productSalesMap[productName]) {
            productSalesMap[productName] = {
                sold: 0,
                image: imageUrl  
            };
        }

        productSalesMap[productName].sold += soldQty;
    });
});

// Render bảng
const soldProductsBody = document.getElementById('sold-products-body');
soldProductsBody.innerHTML = ''; // Clear cũ nếu có

let productIndex = 1;
Object.entries(productSalesMap)
    .sort((a, b) => b[1].sold - a[1].sold)
    .forEach(([name, data]) => {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${productIndex++}</td>
        <td><img src="${data.image}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
        <td>${name}</td>
        <td>${data.sold}</td>
    `;
    soldProductsBody.appendChild(row);
});

    selectYear.addEventListener('change', () => {
        updateChart(selectYear.value);
    });
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function refresh() {
        $('#btn-refresh').on('click', function () {
            location.reload();
        });
    }
    // end btn refresh
    refresh();

    bannerImagesEdit.addEventListener("click", function(event) {
        event.preventDefault();
        removeActiveClass();
        this.classList.add('active');
        prodcut_Content_table();
    });


function prodcut_Content_table() {
    hideAllTabsContent(); // Ẩn tất cả trước
    document.getElementById("id-banner-content").style.display = "block";
    displayEditBanner();
}



    function displayEditBanner() {
    
        var tableContainer = document.getElementById("id-banner-content");
    
        var tableHtml = `
            <div class="d-flex justify-content-start mb-3">
                <button id="addBannerButton" class="btn btn-primary">
                    Add Banner
                    <i class="ms-2 fa fa-plus"></i>
                </button>
            </div>
    
            <table class="table table-hover">
                <thead>
                    <tr class="table-info fw-bold">
                        <th>STT</th>
                        <th>Banner Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Dữ liệu sẽ thêm vào đây sau -->
                    <tbody id="bannerTableBody"> <!-- ✅ Đây là phần quan trọng -->
                </tbody>
            </table>
    `;
    tableContainer.innerHTML = tableHtml;
            $.ajax({
            url: '/banner-images', // đúng với route bạn đã khai báo
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status === 200) {
                    const data = response.data;
                    const tbody = $('#bannerTableBody');
                    tbody.empty();

                    data.forEach((banner, index) => {
                        const row = `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <img src="/uploads/products/${banner.image_path}" alt="Banner" style="height: 80px;">
                                </td>
                                <td>
                <button class="btn btn-danger btn-sm btn-delete-banner" data-id="${banner.banner_images_id}">
                    Delete
                </button>
                                 </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                    // Sau khi render xong, gán sự kiện cho nút Xóa
                btnDeleteBanner(); // Gọi luôn ở đây để gán sự kiện cho các nút Delete
                } 
            },
            error: function (xhr, status, error) {
            }
        });


        btnAddBanner();
    }
    // Hàm xóa banner
    function btnDeleteBanner() {
        $('.btn-delete-banner').off('click').on('click', function () {
            const bannerId = $(this).data('id'); // Get banner ID from data-id

            if (!bannerId) {
                return;
            }

            Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to delete this banner?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteBanner(bannerId);
                }
            });
        });
    }

    
    // Hàm AJAX xóa banner
    function deleteBanner(bannerId) {
        $.ajax({
            url: '/delete-banner/' + bannerId,
            method: 'POST',
            data: {
                _method: 'DELETE',
                _token: $('meta[name="csrf-token"]').attr('content') // Laravel bắt buộc có CSRF token
            },
            success: function (response) {
                if (response.status === 200) {
                    showSuccess(response.message);
                    displayEditBanner();
                } else {
                    $.alert(response.message);
                }
            },
            error: function (xhr, status, error) {
                $.alert('Có lỗi xảy ra khi xoá banner!');
            }
        });    
    }
    
    
    function btnAddBanner() {
        $('#addBannerButton').off('click').on('click', function () {
            $.confirm({
                title: '<strong>Add Banner</strong>',
                closeIcon: true,
                columnClass: 'm',
                draggable: true,
                typeAnimated: true,
                type: 'blue',
                content: `
                    <form class="formName">
                        <div class="form-group">
                            <label>Banner Image</label>
                            <input type="file" id="bannerImage" accept="image/*" class="form-control" required />
                        </div>
                    </form>
                `,
                buttons: {
                    formSubmit: {
                        text: 'Save Banner',
                        btnClass: 'btn-blue',
                        action: function () {
                            const fileInput = this.$content.find('#bannerImage')[0];
                            const file = fileInput.files[0];
    
                            if (!file) {
                                $.alert('Please choose an image!');
                                return false;
                            }
    
                            // Gửi form bằng AJAX (tuỳ bạn muốn làm gì)
                            const formData = new FormData();
                            formData.append('bannerImage', file);
                            
                            $.ajax({
                                url: '/add-banner-images',
                                method: 'POST',
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function (response) {
                                    showSuccess('Banner uploaded successfully 🎉');
                                    displayEditBanner(); // reload lại banner list
                                    // Optional: reload list, close popup, etc.
                                },
                                error: function (xhr, status, error) {
                                    $.alert('Upload failed: ' + (xhr.responseText || error));
                                }
                            });
                    
                            return false; // Ngăn đóng popup nếu muốn giữ lại

                        }
                    },
                }
            });
        });
    }
    btnAddBanner();   
    
//event
function event_Content() {
    hideAllTabsContent(); // Ẩn tất cả trước
    document.getElementById("event-content").style.display = "block";
    displayEventTable();
    fetchAndDisplayEvents();
}



function displayEventTable() {

    const tableEventContainer = document.getElementById("table_event");
    tableEventContainer.innerHTML = '';

    let html = `
            <button id="btn-show-event-form" class="btn btn-success mt-3 mb-3">
                <i class="fa fa-plus-circle me-2"></i> Add Event
            </button>

        <h5 class="mb-3 mt-2">Select products to create an Event</h5>
        <table class="table table-bordered" id="event-product-table">
        <thead class="table-secondary">
                    <tr>
                        <th>#</th>
                        <th>
                            <input type="checkbox" id="check-all-products" class="form-check-input">
                            Select
                        </th>
                        <th>Product Name</th>
                        <th>Price (USD)</th>    
                        <th>Price (Riel)</th>    
                    </tr>
                </thead>

            <tbody id="event-product-tbody">
    `;
    const exchangeRate = 4100;
    for (let i = 0; i < productsLsGL.length; i++) {
        const p = productsLsGL[i];
        const usd = parseFloat(p.product_price) || 0;
        const khr = usd * 4100;
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>
                <input type="checkbox" class="form-check-input product-checkbox" 
                    data-product-id="${p.product_id}" 
                    data-product-name="${p.product_name}">
                </td>
                <td>${p.product_name}</td>
                <td>${formatCurrencyUSD(usd)}</td>
                <td>${formatCurrencyKHR(khr)}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>

        <div id="event-form" class="mt-4" style="display:none;">
            <div class="card card-body border border-info">
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" id="event-title">
                </div>
                <div class="mb-3">
                    <label class="form-label">From Date</label>
                    <input type="date" class="form-control" id="event-from-date">
                </div>
                <div class="mb-3">
                    <label class="form-label">To Date</label>
                    <input type="date" class="form-control" id="event-to-date">
                </div>
                <div class="mb-3">
                    <label class="form-label">Discount (%)</label>
                    <input type="number" class="form-control" id="event-discount" min="1" max="100">
                </div>
                <div class="mb-3">
                    <label class="form-label">Total Selected Products</label>
                    <input type="text" class="form-control" id="event-total-products" readonly>
                </div>
                <div class="d-flex justify-content-end">
                    <button id="btn-add-event" class="btn btn-primary me-2">Add</button>
                    <button id="btn-cancel-event" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;

    tableEventContainer.innerHTML = html;

    // Select All
    $('#check-all-products').off('change').on('change', function () {
        const isChecked = $(this).is(':checked');
        $('.product-checkbox').prop('checked', isChecked);
        $('#event-total-products').val($('.product-checkbox:checked').length);
    });


    // Individual Checkbox
    $(document).off('change', '.product-checkbox').on('change', '.product-checkbox', function () {
            const checkedCount = $('.product-checkbox:checked').length;
            const totalCheckboxes = $('.product-checkbox').length;
            $('#event-total-products').val(checkedCount);
            $('#check-all-products').prop('checked', checkedCount === totalCheckboxes);
        });


    // 👉 Show event form using SweetAlert2 dialog
    $('#btn-show-event-form').off('click').on('click', function () {
        const selectedProducts = $('.product-checkbox:checked').map(function () {
            return {
                id: $(this).data('product-id'),
                name: $(this).data('product-name')
            };
        }).get();

        const selectedListHtml = selectedProducts.length
            ? `<ul id="swal-selected-products" style="text-align:left; padding-left: 0;">${selectedProducts.map(p =>
                `<li style="list-style:none; display:flex; justify-content:space-between; align-items:center; padding: 4px 0; border-bottom: 1px solid #eee;">
                    <span>${p.name}</span>
                    <button class="btn btn-sm btn-danger btn-remove-product" data-product-id="${p.id}">❌</button>
                </li>`).join('')}
            </ul>`
            : '<p class="text-danger">No products selected</p>';


        Swal.fire({
            title: '<span style="color:#007bff;">🎉 Create New Event</span>',
            html: `
                <div class="text-start swal2-input-group">
                    <label class="form-label text-primary">Title</label>
                    <input id="swal-event-title" class="form-control border border-primary" placeholder="Enter event title">
                </div>
                <div class="text-start swal2-input-group">
                    <label class="form-label text-primary">From Date</label>
                    <input type="date" id="swal-event-from" class="form-control border border-primary">
                </div>
                <div class="text-start swal2-input-group">
                    <label class="form-label text-primary">To Date</label>
                    <input type="date" id="swal-event-to" class="form-control border border-primary">
                </div>
                <div class="text-start swal2-input-group">
                    <label class="form-label text-primary">Discount (%)</label>
                    <input type="number" id="swal-event-discount" class="form-control border border-primary" min="1" max="100">
                </div>
                <div class="text-start swal2-input-group">
                    <label class="form-label text-primary">Selected Products</label>
                    <div style="max-height:150px; overflow-y:auto; border:1px solid #17a2b8; padding:6px; border-radius:6px; background-color:#f8f9fa;">
                        ${selectedListHtml}
                    </div>
                </div>
            `,
            confirmButtonText: '<i class="fa fa-check-circle me-1"></i> Create Event',
            cancelButtonText: '<i class="fa fa-times-circle me-1"></i> Cancel',
            showCancelButton: true,
            customClass: {
                popup: 'swal2-rounded swal2-shadow',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false,
            didOpen: () => {
                $('.btn-remove-product').on('click', function () {
                    const productId = $(this).data('product-id');
                    $(`.product-checkbox[data-product-id="${productId}"]`).prop('checked', false).trigger('change');
                    $(this).closest('li').remove();
                    if ($('#swal-selected-products li').length === 0) {
                        $('#swal-selected-products').replaceWith('<p class="text-danger">No products selected</p>');
                    }
                });
            },
            preConfirm: () => {
                const title = $('#swal-event-title').val().trim();
                const from = $('#swal-event-from').val();
                const to = $('#swal-event-to').val();
                const discount = parseFloat($('#swal-event-discount').val());

                const remainingIds = $('#swal-selected-products .btn-remove-product').map(function () {
                    return $(this).data('product-id');
                }).get();

                if (!title || !from || !to || isNaN(discount) || remainingIds.length === 0) {
                    Swal.showValidationMessage('Please fill in all fields and select at least one product.');
                    return false;
                }

                if (discount <= 0 || discount > 100) {
                    Swal.showValidationMessage('Discount must be between 1 and 100.');
                    return false;
                }

                return {
                    title, from_date: from, to_date: to, discount, product_ids: remainingIds
                };
            }
        }).then(result => {
            if (result.isConfirmed && result.value) {
                const data = result.value;
                $.ajax({
                    url: '/admin/event',
                    method: 'POST',
                    data: {
                        ...data,
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: res.message || 'Event created successfully!'
                        });
                        fetchAndDisplayEvents();
                    },
                    error: function (xhr) {
                        const res = xhr.responseJSON;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.message || 'Something went wrong.'
                        });
                    }
                });
            }
        });

    });


    // 👉 Cancel button
    $('#btn-cancel-event').off('click').on('click', function () {
        $('#event-form').slideUp();
    });

    // 👉 Add Event button
$('#btn-add-event').off('click').on('click', function () {
    const title = $('#event-title').val().trim();
    const from = $('#event-from-date').val();
    const to = $('#event-to-date').val();
    const discount = parseFloat($('#event-discount').val());
    const productIds = $('.product-checkbox:checked').map(function () {
        return $(this).data('product-id');
    }).get();

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = to ? to : from;

    // --- VALIDATION ---
    if (!title || !from || !to || isNaN(discount) || productIds.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please fill in all fields and select at least one product.'
        });
        return;
    }

    if (from < today) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'Start date cannot be in the past.'
        });
        return;
    }

    if (to < from) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'End date must be after the start date.'
        });
        return;
    }
    

    if (discount <= 0 || discount > 100) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Discount',
            text: 'Discount must be between 1 and 100.'
        });
        return;
    }

    // --- AJAX REQUEST ---
    $.ajax({
        url: '/admin/event',
        method: 'POST',
        data: {
            title: title,
            from_date: from,
            to_date: to,
            discount: discount,
            product_ids: productIds,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function (res) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: res.message || 'Event added successfully!'
            });
            $('#event-form').slideUp();
            fetchAndDisplayEvents();
        },
        error: function (xhr) {
            const res = xhr.responseJSON;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.message || 'Something went wrong.'
            });
        }
    });
});

MyDataTable('#event-product-table',30);

}

$('#id_event').on('click', function () {
    event_Content();
    $('.nav-item').removeClass('active');
    $(this).addClass('active');
});

function fetchAndDisplayEvents() {
    
    $.get('/admin/events', function(res) {
        if (!res.status) return alert('Failed to load events');

        const events = res.events;
        let html = `
            <h5 class="mb-3">List of Events</h5>
            <table class="table table-bordered">
                <thead class="table-secondary">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Discount (%)</th>
                        <th>Total Products</th>
                        <th>Status</th>
                        <th>Action</th> 
                    </tr>
                </thead>
                <tbody>
        `;
        const now = new Date();
        events.forEach((event, index) => {
            
            const from = new Date(event.from_date);
            const to = new Date(event.to_date);
            to.setHours(23, 59, 59, 999);
            let status = 'Upcoming';
            if (now >= from && now <= to) {
                status = 'Ongoing';
            } else if (now > to) {
                status = 'Ended';
            }

            const badgeClass = status === 'Ongoing' ? 'bg-success'
                            : status === 'Upcoming' ? 'bg-primary'
                            : 'bg-secondary';
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${event.title}</td>
                    <td>${event.from_date ? new Date(event.from_date).toLocaleDateString() : 'N/A'}</td>
                    <td>${event.to_date ? new Date(event.to_date).toLocaleDateString() : 'N/A'}</td>
                    <td>${event.discount}</td>
                    <td>${event.products_count}</td>
                    <td>
                        <span class="badge ${badgeClass}">${status}</span>
                    </td>
                    <td>
                        <!-- ✅ Action buttons -->
                        <button class="btn btn-sm btn-info me-1 btn-view-event" data-id="${event.id}">View</button>
                        <button class="btn btn-sm btn-warning me-1 btn-edit-event" data-id="${event.id}">Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete-event" data-id="${event.id}">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';

        $('#event-list-container').html(html)[0].scrollIntoView({ behavior: 'smooth' });

        $('.btn-view-event').on('click', function () {
            const id = $(this).data('id');
            $.get(`/admin/event/${id}`, function (res) {
                if (!res.status) {
                    alert('Failed to load event details');
                    return;
                }

                const event = res.event;
                const from = new Date(event.from_date);
                const to = new Date(event.to_date);
                to.setHours(23, 59, 59, 999);
                const today = new Date();

                let status = 'Upcoming';
                if (today >= from && today <= to) status = 'Ongoing';
                else if (today > to) status = 'Ended';

                const badgeClass = status === 'Ongoing' ? 'bg-success'
                    : status === 'Upcoming' ? 'bg-primary'
                    : 'bg-secondary';

                $('#view-event-title').text(event.title);
                $('#view-event-discount').text(event.discount);
                $('#view-event-date-range').text(`${event.from_date} → ${event.to_date}`);
                $('#view-event-status').html(`<span class="badge ${badgeClass}">${status}</span>`);
                $('#view-event-products').empty();

                event.products.forEach(p => {
                    const usd = parseFloat(p.product_price) || 0;
                    const discountPercent = parseFloat(event.discount || 0)

                    const discountedUsd = usd * (1 - discountPercent / 100);
                    const usdStr = formatCurrencyUSD(usd);
                    const discountedUsdStr = formatCurrencyUSD(discountedUsd);

                    const khr = usd * 4100;
                    const discountedKhr = discountedUsd * 4100;
                    const khrStr = formatCurrencyKHR(khr);
                    const discountedKhrStr = formatCurrencyKHR(discountedKhr);

                    let priceHtml = '';
                    if (discountPercent > 0) {
                        priceHtml = `
                            <small>
                                <s>${usdStr} | ${khrStr}</s><br>
                                <span class="text-danger">${discountedUsdStr} | ${discountedKhrStr}</span>
                            </small>`;
                    } else {
                        priceHtml = `<small>${usdStr} | ${khrStr}</small>`;
                    }
                    const imageUrl = (p.images && p.images.length > 0)
                        ? `/uploads/products/${p.images[0]}`
                        : `https://via.placeholder.com/50x50?text=No+Image`;

                    const html = `
                        <li class="list-group-item d-flex align-items-center">
                            <div style="min-width: 80px;">
                                <img src="${imageUrl}" alt="${p.product_name}" 
                                    style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div class="ms-3">
                                <strong>${p.product_name}</strong><br>
                                ${priceHtml}
                            </div>
                        </li>
                    `;

                    $('#view-event-products').append(html);
                });
                const modal = new bootstrap.Modal(document.getElementById('eventViewModal'));
                modal.show();
            });
        });


        $('.btn-edit-event').on('click', function () {
            const id = $(this).data('id');
            alert(`Edit Event ID: ${id}`);
            // 👉 Call edit form function if available
        });

        $('.btn-delete-event').on('click', function () {
            const id = $(this).data('id');

            Swal.fire({
                title: 'Are you sure?',
                text: "This event will be permanently deleted!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `/admin/event/${id}`,
                        method: 'DELETE',
                        data: {
                            _token: $('meta[name="csrf-token"]').attr('content')
                        },
                        success: function (res) {
                            Swal.fire(
                                'Deleted!',
                                res.message || 'The event has been deleted.',
                                'success'
                            );
                            fetchAndDisplayEvents();
                        },
                        error: function (xhr) {
                            Swal.fire(
                                'Error!',
                                xhr.responseJSON?.message || 'Failed to delete the event.',
                                'error'
                            );
                        }
                    });
                }
            });
        });
        bindEditEventButtons(); 
        handleSaveEditedEvent();

    });
}
function bindEditEventButtons() {
    $('.btn-edit-event').off('click').on('click', function () {
        const id = $(this).data('id');
        openEditEventModal(id);
    });
}
function openEditEventModal(id) {
    $.get(`/admin/event/${id}`, function (res) {
        if (!res.status) return Swal.fire('Error', 'Unable to load event data', 'error');

        const event = res.event;

        $('#edit-event-title').val(event.title);
        $('#edit-event-from-date').val(event.from_date);
        $('#edit-event-to-date').val(event.to_date);
        $('#edit-event-discount').val(event.discount);

        const productHtml = event.products.map(p => `
            <span class="badge bg-info text-dark p-2">${p.product_name}</span>
        `).join('');
        $('#edit-event-products').html(productHtml);

        $('#btn-save-event-edit').data('id', id);

        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
            modal.show();
        }, 10);
    });
}
function handleSaveEditedEvent() {
    $('#btn-save-event-edit').on('click', function () {
        const id = $(this).data('id');
        const title = $('#edit-event-title').val().trim();
        const from = $('#edit-event-from-date').val();
        const to = $('#edit-event-to-date').val();
        const discount = parseFloat($('#edit-event-discount').val());

        if (!title || !from || !to || isNaN(discount)) {
            return Swal.fire('Validation Error', 'Please fill in all required fields', 'warning');
        }

        $.ajax({
            url: `/admin/event/${id}`,
            method: 'PUT',
            data: {
                title,
                from_date: from,
                to_date: to,
                discount,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                Swal.fire('Updated', res.message || 'The event has been updated', 'success');
                $('#editEventModal').modal('hide');
                fetchAndDisplayEvents();
            },
            error: function (xhr) {
                Swal.fire('Error', xhr.responseJSON?.message || 'An error occurred', 'error');
            }
        });
    });
}

function formatCurrencyUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatCurrencyKHR(amount) {
    return new Intl.NumberFormat('km-KH', {
        style: 'currency',
        currency: 'KHR',
        minimumFractionDigits: 0
    }).format(amount);
}




    
});