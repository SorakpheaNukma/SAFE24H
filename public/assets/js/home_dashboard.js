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
                console.log('Real-time notification order js: ' + JSON.stringify(data.message.order));
                console.log('Real-time notification users js1: ' + JSON.stringify(data.message.users));

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
                        // console.log(res.responseJSON);
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
                        console.log("Error: " + JSON.stringify(res));
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
                orderContent.style.display = 'block';
                dashboardContent.style.display = "none";
                productContent.style.display = "none";
                proImageContent.style.display = "none";
                proDescription1.style.display = "none";
                proDescription2.style.display = "none";
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
                            // console.log('here datapro');

                            // function from home_dashboard_2 js file 
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

                OrdersLsGL.forEach(order => {
                    numberCount++;
                    const formattedDateTime = formatDate(order.order_date);

                    const row = document.createElement("tr");
                    row.innerHTML = `
                <td>${numberCount}</td>
                <td>${order.users.username}</td>
                <td>$${order.total_amount}</td>
                <td><span class="badge ${order.status === 'processing' ? 'bg-warning' : 'bg-success'}">${order.status}</span></td>
                <td>${formattedDateTime}</td>
                <td>
                    <button class="btn btn-info btn-sm btn-view-order" data-order-id="${order.order_id}">View</button>
                    <button class="btn btn-warning btn-sm btn-edit-order" data-order-id="${order.order_id}" data-order-status="${order.status}">Edit</button>
                    <button class="btn btn-danger btn-sm btn-delete-order" data-order-id="${order.order_id}">Delete</button>
                    
                    <input type="hidden" class="order-data" value='${JSON.stringify(order)}' />
                </td>
            `;
                    ordersTableBody.appendChild(row);
                });

                MyDataTable('#ordersTable', 15);

                $(".btn-edit-order").on('click', function(e) {
                    e.stopPropagation();
                    var order_id = $(this).data("order-id");
                    var order_status = $(this).data("order-status");

                    editOrderDialog(order_id, order_status);
                });

                $(".btn-delete-order").on('click', function(e) {
                    e.stopPropagation();
                    var orderData = $(this).closest("td").find(".order-data").val();
                    orderData = JSON.parse(orderData);

                    deleteOrderDialog(orderData);
                });

                $('.btn-view-order').on('click', function(e) {
                    e.stopPropagation();
                    var orderData = $(this).closest("td").find(".order-data").val();
                    //console.log("orderData: " + orderData);
                    orderData = JSON.parse(orderData);

                    viewOrderDialog(orderData);
                });
            }

            function viewOrderDialog(orderData) {
                console.log("Order Data:", orderData);  // Kiểm tra dữ liệu đã có
            
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
                console.log("open delete dialog");
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
                        console.log("Confirm delete for order:", order_id);
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

            function showDashboard() {
                dashboardContent.style.display = "block";
                orderContent.style.display = 'none';
                productContent.style.display = "none";
                proImageContent.style.display = "none";
                proDescription1.style.display = "none";
                proDescription2.style.display = "none";

                displayContentDashboard();
            }


            function prodcut_Content() {
                displayTbProducts();
                displayProductImages();
                displayProductDescription1();
                displayProductDescription2();
                dashboardContent.style.display = "none";
                orderContent.style.display = 'none';
                productContent.style.display = "block";
                proImageContent.style.display = "block";
                proDescription1.style.display = "block";
                proDescription2.style.display = "block";
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

                    var rHtml = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${product.product_name}</td>
                    <td>${product.category_name}</td>
                    <td>\$${product.product_price}</td>
                    <td>${product.quantity}</td>
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
                        console.log("Error updating product: ", error);
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
        <table class=" " id="product-table1-des">
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
                            ${[1, 2, 3, 4, 5].map(i => `
                                <label>Image ${i} (Optional)</label>
                                <input type="file" id="productImage${i}" accept="image/*" class="form-control" />`
                            ).join('')}
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
    
                            for (let i = 1; i <= 5; i++) {
                                let fileInput = $(`#productImage${i}`)[0].files[0];
                                if (fileInput) {
                                    formData.images.push(fileInput);
                                }
                            }
    
                            addProduct(formData);
                            clearInputs();
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
            console.error("Element with class 'IdTableCategory' not found");
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
    //////////////////////////////////////////////////////
    function displayContentDashboard() {
        const dvContentDashboard = document.getElementById('id-conent-dashboard');

        dvContentDashboard.innerHTML = `
            <div class="row">
                <!-- First Row with Cards -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-top">
                    <div class="dashboard-box p-4 bg-primary text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-shopping-cart fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Today's Sales</h6>
                                <h5>\$ ${todayAmountGl}</h5>
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
                                <h4>\$ ${totalAmountGl}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Additional Stat Cards -->
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
                                <h4>${OrdersLsGL.length}</h4>
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
    
            <!-- Second Row with Charts -->
            <div class="row">
                <div class="col-lg-6 col-md-12 mb-4 slide-in-left">
                    <div class="chart-box p-3">
                        <h5 class="text-center">Top Product Categories</h5>
                        <canvas id="pieChart" style="width: 100%; height: 300px;"></canvas>

                        <!-- Message for no report -->
                        <p id="noReportMessagePieChart" style="display:none; color:red;">No data category available.</p>

                    </div>
                </div>

                <div class="col-lg-6 col-md-12 mb-4 slide-in-right">
                    <div class="chart-box p-3">
                        <h5 class="text-center">Monthly Sales Report</h5>

                        <!-- Dropdown to select Year -->
                        <div class="d-flex justify-content-between mb-3">
                            <label class="form-label"></label>

                            <select id="yearSelect-column-chart" class="form-select" style="width: 150px;">
                                <!-- Add any years here -->
                            </select>
                        </div>

                        <!-- Message for no report -->
                        <p id="noReportMessage" style="display:none; color:red;">No monthly sales report available.</p>

                        <!-- Canvas for the chart -->
                        <canvas id="columnChart" style="width: 100%; height: 300px;"></canvas>
                    </div>
                </div>
            </div>

            <!-- Orders Summary Table -->
            <div class="row">
                <div class="col-12 slide-in-left">
                    <div class="table-responsive mt-4">
                    <!--order summary and export -->
                       <div class="container my-4">
                            <div class="row align-items-center">
                                <!-- Orders Summary Header -->
                                <div class="col-12 col-md-8 text-center text-md-start">
                                    <h4 class="fw-bold mb-3">Orders Summary</h4>
                                </div>
                                <!-- Export to Excel Button -->
                                <div class="col-12 col-md-4 text-center text-md-end">
                                    <button id="export-excel-btn" class="btn btn-success">
                                        <i class="fa fa-file-excel-o" aria-hidden="true"></i> Export to Excel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <table class="table" id="table-show-order-dashboard">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="orders-table-body">
                                <!-- Order rows will be inserted here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>    
        `;

        dataExportToExcelGl.push({
            'today_sale': todayAmountGl,
            'total_sales': totalAmountGl,
            'total_users': countUsersGl,
            'total_orders': OrdersLsGL.length,
            'total_products': productsLsGL.length,
        });

        // Populate Orders Table with "View Details" button and attach event listener
        const ordersTableBody = document.getElementById("orders-table-body");
        OrdersLsGL.forEach((order, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.users.username}</td>
                <td>$${order.total_amount.toFixed(2)}</td>
                <td><span class="badge ${order.status === 'processing' ? 'bg-warning' : 'bg-success'}">${order.status}</span></td>
                <td>${formatDate(order.order_date)}</td>
                <td>
                    <button class="btn btn-sm btn-info view-details-btn" data-index="${index}">View Details</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });

        MyDataTable('#table-show-order-dashboard');

        // Attach event listeners to each "View Details" button
        document.querySelectorAll(".view-details-btn").forEach(button => {
            button.addEventListener("click", function () {
                const orderIndex = this.getAttribute("data-index");
                const orderData = OrdersLsGL[orderIndex];
                const dmain = window.location.origin;

                const orderItemsHTML = orderData.order_items.map(item => `
                    <div class="order-item" style="border-bottom: 1px solid #eee; padding: 10px; display: flex; align-items: center;">
                        <img src="${dmain}/uploads/products/${item.variant.product.product_images[0]?.image_path || 'default.jpg'}"
                             style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 5px;">
                        <div>
                            <h5 style="margin: 0; font-weight: bold; display: flex; align-items: center;">
                                🛒 ${item.variant.product.product_name}
                            </h5>
                            <p style="margin: 0; color: #888;">💲 Price: $${item.price}</p>
                            <p style="margin: 0; color: #888;">📦 Quantity: ${item.quantity}</p>
                            <p style="margin: 0; color: #888;">👕 Size: ${item.variant.size}</p>
                        </div>
                    </div>
                `).join('');

                // Use jConfirm or a similar modal to display order details
                MyJConfirmDialog({
                    title: `Order #${orderData.order_id} Details`,
                    content: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h4 style="color: #333; margin-bottom: 10px;">📃 Order Summary</h4>
                            <p><strong>🆔 Order ID:</strong> ${orderData.order_id}</p>
                            <p><strong>🔄 Status:</strong> ${orderData.status}</p>
                            <p><strong>💰 Total Amount:</strong> $${orderData.total_amount}</p>
                            <p><strong>📅 Order Date:</strong> ${formatDate(orderData.order_date)}</p>
                            
                            <hr style="margin: 10px 0; border-top: 1px solid #ddd;">
                            
                            <h4 style="color: #333; margin-bottom: 10px;">👤 User Info</h4>
                            <p><strong>📛 Name:</strong> ${orderData.users.username}</p>
                            <p><strong>📞 Phone:</strong> ${orderData.users.phone_number}</p>
                            <p><strong>🏠 Address:</strong> ${orderData.users.address}</p>
                            
                            <hr style="margin: 10px 0; border-top: 1px solid #ddd;">
                
                            <h4 style="color: #333; margin-bottom: 10px;">📦 Order Items</h4>
                            <div style="max-height: 200px; overflow-y: auto;">
                                ${orderItemsHTML}
                            </div>
                        </div>`,
                    confirmText: "Close",
                    confirmBtnClass: "btn-info",
                    columnClass: "m",
                    type: "blue",
                    onConfirm: function () { /* Close dialog */ }
                });
            });
        });

        // Initialize Pie Chart for Top 3 Product Categories
        const pieChartCtx = document.getElementById('pieChart').getContext('2d');
        const noDataPieChart = document.getElementById('noReportMessagePieChart');

        // Map to store total sales for each category
        const categorySales = {};

        // Process orders to calculate sales per category
        LsOrderDataGl.forEach(order => {
            order.order_items.forEach(item => {
                const category_name = item.variant.product.category.category_name;
            
                const sold = item.variant?.sold || 0;
                // Add sales to the respective category
                categorySales[category_name] = (categorySales[category_name] || 0) + sold;
            });
        });

        // Sort categories by total sales in descending order and take the top 
        const topCategories = Object.entries(categorySales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        // Extract labels and data for the chart
        const labels = topCategories.map(([name, sales]) => `${name} (Sold: ${sales})`);
        const data = topCategories.map(([, sales]) => sales);

        // console.log("Category Sales Data: ", categorySales);
        // console.log("Top Categories: ", topCategories);

        if (LsOrderDataGl.length > 0) {
            dataExportToExcelGl.push({
                'top_categories': categorySales,
            });

            noDataPieChart.style.display = 'none';

            // Display the Pie Chart and Column Chart
            document.getElementById('pieChart').style.display = 'block';

            // Create the Pie Chart
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
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const label = tooltipItem.label || '';
                                    return `${label}`;
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


        // Initialize Column Chart
        const columnChartCtx = document.getElementById('columnChart').getContext('2d');

        // Create an object to store the monthly data for each year
        // Example structure: { '2024': [100, 200, 150, ...], '2025': [200, 300, 250, ...] }
        const monthlyDataByYear = {};

        // Create a list to store unique years for the dropdown
        const uniqueYears = [];

        // Loop through the data and accumulate the monthly sales data based on year and month
        for (var i = 0; i < LsOrderDataGl.length; i++) {
            const orderDate = new Date(LsOrderDataGl[i].order_date);

            // Get month index (0-11)
            const monthIndex = orderDate.getMonth();

            // Extract year from the date
            const year = orderDate.getFullYear();
            const totalAmount = LsOrderDataGl[i].total_amount || 0;

            // Initialize the data structure for a new year if it doesn't exist
            if (!monthlyDataByYear[year]) {
                monthlyDataByYear[year] = Array(12).fill(0);
                uniqueYears.push(year);
            }

            // Accumulate the amount for the given month and year
            monthlyDataByYear[year][monthIndex] += totalAmount;
            // console.log(`Added ${totalAmount} to year ${year}, month ${monthIndex}`);
        }

        // Populate the year select dropdown
        const selectYear = document.getElementById('yearSelect-column-chart');
        const noReportMessage = document.getElementById('noReportMessage');

        // Clear previous options and reset the "no report" message
        selectYear.innerHTML = '';
        if (noReportMessage) {
            noReportMessage.style.display = 'none';
        }

        if (uniqueYears && uniqueYears.length > 0) {
            // Add options for each unique year
            uniqueYears.forEach(function (year) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                selectYear.appendChild(option);
            });

            selectYear.style.display = 'block';
        } else {
            if (noReportMessage) {
                noReportMessage.style.display = 'block';
            }

            selectYear.style.display = 'none';
        }

        // Function to update the chart based on the selected year
        function updateChart(selectedYear) {
            // Get the monthly data for the selected year
            const filteredData = monthlyDataByYear[selectedYear] || Array(12).fill(0);
            // Default to 0 if no data for the year

            // Update the chart data with filtered data for the selected year
            chart.data.datasets[0].data = filteredData;
            chart.update();
        }

        // Create the initial chart object
        let selectedYear = uniqueYears[0]; // Default to the first year
        const initialData = monthlyDataByYear[selectedYear] || Array(12).fill(0);

        const chart = new Chart(columnChartCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: initialData, // Use the data for the first selected year
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
                            callback: function (value) {
                                return '$' + value; // Add $ symbol to Y-axis labels
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `$${tooltipItem.raw}`; // Add $ symbol in tooltips
                            }
                        }
                    }
                }
            }
        });

        // console.log("monthly dataYear:" + JSON.stringify(monthlyDataByYear));;
        dataExportToExcelGl.push({
            'monthlyDataByYear': monthlyDataByYear,
            'order_data': OrdersLsGL,
        });

        // Add event listener for year change
        selectYear.addEventListener('change', function () {
            selectedYear = selectYear.value;
            console.log('Selected Year:', selectedYear);

            // Update chart with new filtered data for the selected year
            updateChart(selectedYear);
        });


        // btn export data to Excel
        $('#export-excel-btn').on('click', function () {
            //console.log("dataExport:" + JSON.stringify(dataExportToExcelGl));

            if (dataExportToExcelGl.length > 0) {
                exportToExcel2(dataExportToExcelGl);
            } else {
                alert("No data available to export to Excel.");
            }
        });
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    //////////////////////////////////////////////////////
    // end all about in content dashboard

    // btn refresh
    function refresh() {
        $('#btn-refresh').on('click', function () {
            location.reload();
        });
    }
    // end btn refresh
    refresh();

});