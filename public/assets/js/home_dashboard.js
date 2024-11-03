$(document).ready(function () {
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });

    // function getOrderItems() {
    //     $.ajax({
    //         url: '/getall-order-items',
    //         method: 'GET',
    //         headers: {
    //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //         },
    //         success: function (res) {
    //             if (res.status === 200) {
    //                 console.log('data getOrderItems is:' + JSON.stringify(res.data));
    //             } else {
    //                 alert('Failed ');
    //             }
    //         },
    //         error: function (res) {
    //             if (res.status === 422) {
    //                 let error = res.responseJSON.error;
    //                 let firstError = Object.values(error)[0][0];
    //                 showError(firstError);
    //             } else if (res.status === 500) {
    //                 showError('An error occurred. Please try again later.');
    //             } else {
    //                 showError('Something went wrong!');
    //             }
    //         }
    //     });
    // }

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
    channel.bind('my-message', function (data) {
        console.log('Real-time notification order js: ' + JSON.stringify(data.message.order));
        console.log('Real-time notification users js1: ' + JSON.stringify(data.message.users));

        if (data.message.order.status === 'processing') {
            getOrders();
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
            success: function (res) {
                if (res.status == 200) {
                    categoriesLsGL = [];

                    res.data.forEach(function (category) {
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

    getAllCategories();

    function addCategory(formData, callback) {
        $.ajax({
            url: '/add-category',
            method: 'POST',
            data: formData,
            success: function (res) {
                if (res.status == 200) {
                    getAllCategories(displayCategoriesTable);

                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function (res) {
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
            success: function (res) {
                if (res.status == 200) {
                    getAllCategories(displayCategoriesTable);

                    showSuccess('updated successfully🎉');
                } else {
                    $.alert('Failed to update category');
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
            success: function (res) {
                if (res.status == 200) {
                    getAllCategories(displayCategoriesTable);
                    showSuccess('deleted successfully🎉');
                } else {
                    $.alert('Failed to delete category');
                }
            },
            error: function (res) {
                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    let firstError = Object.values(error)[0][0];
                    showError(firstError);
                } else if (res.status === 500) {
                    showError('An error occurred. Please try again later.');
                } else if (res.status === 404) {
                    showError(res.responseJSON.error);
                }
                else {
                    showError('Something went wrong. Please try again later.');
                }
            }
        });
    }

    function getAllProdut(callbacks = []) {
        if (callbacks.length === 0) {
            Loading();
        }

        $.ajax({
            url: '/getAllProducts',
            method: 'GET',
            success: function (res) {
                if (res.status == 200) {
                    productsLsGL = [];

                    res.data.forEach(function (p) {
                        productsLsGL.push({
                            product_id: p.product_id || 0,
                            product_name: p.product_name || 'Unknown',
                            product_price: p.product_price || 0,
                            category_id: p.category_id || 0,
                            category_name: p.category_name || 'N/A',
                            quantity: p.quantity || 'Out of stock',
                            images: p.images && Array.isArray(p.images) ? p.images : [],
                            descriptions: p.descriptions || {},
                        });
                    });

                    if (callbacks.length === 0) {
                        hideLoading();
                    }

                    callbacks.forEach(function (callback) {
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
            error: function (res) {
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

    getAllProdut();

    function updateProduct(formData, callback) {
        $.ajax({
            url: '/edit-product',
            method: 'PUT',
            data: formData,
            success: function (res) {
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
            error: function (res) {
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
            success: function (res) {
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
            error: function (res) {
                let errorMessage = 'An error occurred. Please try again later.';
                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    errorMessage = Object.values(error)[0][0];
                } else if (res.status === 404) {
                    errorMessage = 'Product not found. Please try again later.';
                }
                else if (res.status === 500) {
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
            fd.append(`des_${i}`, formData[`des_${i} `] ?? '');
        }

        for (let i = 0; i < formData.images.length; i++) {
            fd.append(`images[]`, formData.images[i]);
        }

        $.ajax({
            url: '/add-product',
            method: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
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
            error: function (res) {
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
            success: function (res) {
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
            error: function (res) {
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
            success: function (res) {
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
            error: function (res) {
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
            success: function (res) {
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
            error: function (res) {
                let errorMessage = 'An error occurred. Please try again later.';
                if (res.status === 422) {
                    let error = res.responseJSON.error;
                    errorMessage = Object.values(error)[0][0];
                } else if (res.status === 404) {
                    errorMessage = res.responseJSON.error;
                }
                else if (res.status === 500) {
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

    dashboardActionLink.addEventListener("click", function (event) {
        event.preventDefault();
        removeActiveClass();
        this.classList.add('active');
        showDashboard();
    });


    OrderActionLink.addEventListener("click", function (e) {
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
        displayContentOrders();
    }

    function getOrders() {
        $.ajax({
            url: '/getall-order',
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    LsOrdersForCountBadgeNumber = [];

                    res.data.forEach(item => {
                        //console.log('orders on getorders 1: ' + JSON.stringify(item.users));
                        //console.log('orders on getorders 2: ' + JSON.stringify(item));

                        if (item.status === 'processing') {
                            LsOrdersForCountBadgeNumber.push(item);
                        }
                    });

                    $('#id-badge-order').text(LsOrdersForCountBadgeNumber.length).removeClass('d-none');
                } else {
                    alert('Failed');
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

    getOrders();

    //Content Orders
    function displayContentOrders() {
        var dvContentOrder = document.getElementById("id-content-order");
        dvContentOrder.innerHTML = "";

        var orderCt = `
            <div class="container mt-3">
                <h2 class="mb-2">Orders Management</h2>
    
                <!-- Orders Table -->
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example row, replace with backend-generated rows -->
                            <tr>
                                <td>1234</td>
                                <td>John Doe</td>
                                <td>$250.00</td>
                                <td><span class="badge bg-warning">Processing</span></td>
                                <td>2024-10-25</td>
                                <td>
                                    <a href="#" class="btn btn-info btn-sm">View</a>
                                    <a href="#" class="btn btn-warning btn-sm">Edit</a>
                                    <button type="button" class="btn btn-danger btn-sm" onclick="confirm('Are you sure you want to delete this order?')">Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>1235</td>
                                <td>Jane Smith</td>
                                <td>$150.00</td>
                                <td><span class="badge bg-primary">Shipped</span></td>
                                <td>2024-10-24</td>
                                <td>
                                    <a href="#" class="btn btn-info btn-sm">View</a>
                                    <a href="#" class="btn btn-warning btn-sm">Edit</a>
                                    <button type="button" class="btn btn-danger btn-sm" onclick="confirm('Are you sure you want to delete this order?')">Delete</button>
                                </td>
                            </tr>
                            <!-- Additional rows can be added dynamically here -->
                        </tbody>
                    </table>
                </div>
    
            </div>
        `;

        dvContentOrder.innerHTML += orderCt;
    }


    productActionLink.addEventListener("click", function (event) {
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

        $(".btn-edit-product").on('click', function (e) {
            e.stopPropagation();
            var product_id = $(this).data("product-id");
            updateProductDialog(product_id, productsLsGL);
        });

        $(".btn-delete-product").on('click', function (e) {
            e.stopPropagation();
            var product_id = $(this).data("product-id");
            var product_name = $(this).data("product-name");
            deleteProductDialog(product_id, product_name);
        });
    }

    function updateProductDialog(product_id, productsLsGL) {
        let categoryOptions = categoriesLsGL.map(ct =>
            `<option value = "${ct.category_id}" > ${ct.category_name}</option > `
        ).join('');

        MyJConfirmDialog({
            title: '<strong>Update Product</strong',
            confirmText: 'Update',
            content:
                `
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
                            <label>Product Stock</label>
                            <input type="number" min="0" id="productStock" placeholder="Enter Stock" class="form-control" required />
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="category" class="form-control" required>
                                <option value="">Select a category</option>
                                ${categoryOptions} 
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description 1 (Optional)</label>
                            <textarea id="des1" placeholder="Enter description 1" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 2 (Optional)</label>
                            <textarea id="des2" placeholder="Enter description 2" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 3 (Optional)</label>
                            <textarea id="des3" placeholder="Enter description 3" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 4 (Optional)</label>
                            <textarea id="des4" placeholder="Enter description 4" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 5 (Optional)</label>
                            <textarea id="des5" placeholder="Enter description 5" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 6 (Optional)</label>
                            <textarea id="des6" placeholder="Enter description 6" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 7 (Optional)</label>
                            <textarea id="des7" placeholder="Enter description 7" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 8 (Optional)</label>
                            <textarea id="des8" placeholder="Enter description 8" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 9 (Optional)</label>
                            <textarea id="des9" placeholder="Enter description 9" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 10 (Optional)</label>
                            <textarea id="des10" placeholder="Enter description 10" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Description 11 (Optional)</label>
                            <textarea id="des11" placeholder="Enter description 11" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Image 1 (Optional)</label>
                            <input type="file" id="productImage1" accept="image/*" class="form-control" />
                            <label>Image 2 (Optional)</label>
                            <input type="file" id="productImage2" accept="image/*" class="form-control" />
                            <label>Image 3 (Optional)</label>
                            <input type="file" id="productImage3" accept="image/*" class="form-control" />
                            <label>Image 4 (Optional)</label>
                            <input type="file" id="productImage4" accept="image/*" class="form-control" />
                            <label>Image 5 (Optional)</label>
                            <input type="file" id="productImage5" accept="image/*" class="form-control" />
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
                    quantity: $('#productStock').val() ?? 0,
                };

                for (let i = 1; i <= 11; i++) {
                    let desValue = $(`#des${i}`).val();
                    if (desValue) {
                        formData[`des_${i}`] = desValue;
                    }
                }

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
                productsLsGL.forEach(function (p, index) {
                    $('#productName').val(p.product_name);
                    $('#productPrice').val(p.product_price);
                    $('#productStock').val(p.quantity || 0);
                    $('#category').val(p.category_id);

                    if (p.descriptions) {
                        for (let i = 1; i <= 11; i++) {
                            const desKey = `des_${i}`;

                            $(`#des${i}`).val(p.descriptions[desKey] || '');
                        }
                    }
                });
            },
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
                `<option value = "${ct.category_id}" > ${ct.category_name}</option > `
            ).join('');

            $.confirm({
                title: '<strong>Add New Product</strong>',
                closeIcon: true,
                columnClass: 'm',
                draggable: true,
                typeAnimated: true,
                type: 'blue',
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
                        <label>Product Stock</label>
                        <input type="number" min="0" id="productStock" placeholder="Enter Stock" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="category" class="form-control" required>
                            <option value="">Select a category</option>
                            ${categoryOptions} 
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description 1 (Optional)</label>
                        <textarea id="des1" placeholder="Enter description 1" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 2 (Optional)</label>
                        <textarea id="des2" placeholder="Enter description 2" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 3 (Optional)</label>
                        <textarea id="des3" placeholder="Enter description 3" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 4 (Optional)</label>
                        <textarea id="des4" placeholder="Enter description 4" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 5 (Optional)</label>
                        <textarea id="des5" placeholder="Enter description 5" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 6 (Optional)</label>
                        <textarea id="des6" placeholder="Enter description 6" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 7 (Optional)</label>
                        <textarea id="des7" placeholder="Enter description 7" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 8 (Optional)</label>
                        <textarea id="des8" placeholder="Enter description 8" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 9 (Optional)</label>
                        <textarea id="des9" placeholder="Enter description 9" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 10 (Optional)</label>
                        <textarea id="des10" placeholder="Enter description 10" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description 11 (Optional)</label>
                        <textarea id="des11" placeholder="Enter description 11" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Image 1 (Optional)</label>
                        <input type="file" id="productImage1" accept="image/*" class="form-control" />
                        <label>Image 2 (Optional)</label>
                        <input type="file" id="productImage2" accept="image/*" class="form-control" />
                        <label>Image 3 (Optional)</label>
                        <input type="file" id="productImage3" accept="image/*" class="form-control" />
                        <label>Image 4 (Optional)</label>
                        <input type="file" id="productImage4" accept="image/*" class="form-control" />
                        <label>Image 5 (Optional)</label>
                        <input type="file" id="productImage5" accept="image/*" class="form-control" />
                    </div>
                </form >
                `,
                buttons: {
                    formSubmit: {
                        text: 'Add Product',
                        btnClass: 'btn-blue',
                        action: function () {
                            var productName = $('#productName').val();
                            var productPrice = $('#productPrice').val();
                            var category = $('#category').val();
                            var quantity = $('#productStock').val();

                            if (!productName || !productPrice || !category) {
                                $.alert('Please fill out the product name, product price, and category!');
                                return false;
                            }

                            var formData = {
                                quantity: quantity,
                                product_name: productName,
                                product_price: productPrice,
                                category_id: category,
                                images: []
                            };

                            for (let i = 1; i <= 11; i++) {
                                let desValue = $(`#des${i} `).val();

                                if (desValue) {
                                    formData[`des_${i} `] = desValue;
                                }
                            }

                            for (let i = 1; i <= 5; i++) {
                                let fileInput = $(`#productImage${i} `)[0].files[0];
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
                    document.getElementById('productPrice').addEventListener('input', function () {
                        if (this.value < 0) {
                            this.value = 0;
                        }
                    });

                    document.getElementById('productStock').addEventListener('input', function () {
                        if (this.value < 0) {
                            this.value = 0;
                        }
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
            buttons: {
                Confirm: {
                    text: options.confirmText || 'Confirm',
                    btnClass: options.confirmBtnClass || 'btn-blue',
                    action: options.onConfirm || function () { }
                },
                Cancel: {
                    text: options.cancelText || 'Cancel',
                    action: options.onCancel || function () { }
                }
            },
            onOpenBefore: function () {
                if (options.onOpenBefore) {
                    options.onOpenBefore();
                }
            },
            onContentReady: function () {
                if (options.onContentReady) {
                    options.onContentReady();
                }
            }
        };

        if (options.autoClose != null) {
            config.autoClose = options.autoClose;
        }

        $.confirm(config);
    }

    function MyDataTable(tableId) {
        if ($.fn.dataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        $(tableId).DataTable({
            "info": false,
            "lengthChange": false,
            "pageLength": 10,
            "paging": true,
            "searching": true,
            "ordering": true,
            "language": {
                "paginate": {
                    "previous": "<i class='fas fa-arrow-left'></i>",
                    "next": "<i class='fas fa-arrow-right'></i>"
                }
            }
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
});