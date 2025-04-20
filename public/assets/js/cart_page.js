$(document).ready(function () {
    var cartsItemsGL = [];

    // Function to get all cart items
    function getAllCartItemsInThisJS() {
        showSpinner();
        $.ajax({
            url: '/get-all-cart-items',
            method: 'GET',
            success: function (res) {
                hideSpinner();
                if (res.status === 200 && res.data && res.data.length > 0) {
                    cartsItemsGL = res.data;
                    // console.log('in cartPage: ' + JSON.stringify(cartsItemsGL));

                    // Render items if available
                    renderCartItems(cartsItemsGL);
                } else {
                    console.log('No items in cart');
                }
            },
            error: function () {
                hideSpinner();
                showError('Something went wrong!!');
            }
        });
    }

    getAllCartItemsInThisJS();

    function showSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.visibility = 'visible';
        spinner.style.opacity = '1';
        spinner.style.backgroundColor = 'white';
    }

    function hideSpinner() {
        const spinner = document.getElementById('spinner');
        spinner.style.opacity = '0';
        spinner.style.visibility = 'hidden';

        const btncheckOut = document.getElementById('id-check-out');
        btncheckOut.classList.remove('d-none');
    }


    // Function to create HTML for each cart item
    function createCartItem(item, index) {
        const dmain = window.location.origin;
        // console.log(item);
        const imagePath = item.variant && item.variant.product && item.variant.product.product_image && item.variant.product.product_image.length > 0 
        ? item.variant.product.product_image[0].image_path 
        : 'default.jpg';
    
        const product = item.variant.product;
        const size = item.variant.size;
        return `
            <div class="row align-items-center mb-4">
                <div class="col-1">
                    <input class="form-check-input item-checkbox" type="checkbox" id="item${index}" />
                    <label class="form-check-label ms-0 ms-md-2 delete-icon" data-index="${index}">
                        <i class="fa-solid fa-trash-can" style="cursor: pointer;"></i>
                    </label>
                </div>
                <div class="col-4 col-md-2">
                    <img width="100px" src="${dmain}/uploads/products/${imagePath}" alt="${product.product_name}">
                </div>
                <div id="idInfoProduct${index}" class="col-7 col-md-9">
                    <div class="product-description mb-0 p-0">
                        <div class="row">
                            <div class="col-12 d-flex flex-column flex-md-row justify-content-between">
                                <div>
                                    <h5>${product.product_name}</h5>
                                    <div><small>ទំហំ: <strong>${size}</strong></small></div>
                                </div>
                                <div class="d-flex">
                                    <p class="mb-0">តម្លៃ:</p>
                                    <p class="mb-0 ms-2">$${product.product_price}</p>
                                </div>
                            </div>
                        </div>
                        <p>${product.des_1}</p>
                    </div>
                    <p class="text-primary g-0 p-0 m-0">${item.variant.quantity === 0 ? 'គ្មានក្នុងស្តុក' : 'មានក្នុងស្តុក'}</p>
                    <div class="quantity-container mb-2">
                        <div class="d-flex align-items-center">
                            <h7>ចំនួន</h7>
                            <div class="d-flex align-items-center mx-2">
                                <span class="form-control text-center" style="width: 60px; background-color: #f8f9fa;">${item.quantity}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <h7>សរុបរង:</h7>
                            <span class="text-success subtotal" id="subtotal${index}">$${(product.product_price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    

    // Function to render all cart items
    function renderCartItems(items) {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        cartItemsContainer.innerHTML = items.map((item, index) => {
            // Kiểm tra nếu có ảnh sản phẩm và lấy ảnh đầu tiên
            const imagePath = item.variant.product.product_image && item.variant.product.product_image.length > 0
                ? item.variant.product.product_image[0].image_path // Lấy ảnh đầu tiên
                : 'default.jpg'; // Nếu không có ảnh, sử dụng ảnh mặc định
    
            return createCartItem(item, index, imagePath);
        }).join('');

        // Add event listeners for the quantity buttons and checkboxes
        document.querySelectorAll('.minus-btn').forEach(btn => btn.addEventListener('click', handleQuantityChange));
        document.querySelectorAll('.plus-btn').forEach(btn => btn.addEventListener('click', handleQuantityChange));
        document.querySelectorAll('.item-checkbox').forEach(checkbox => checkbox.addEventListener('change', updateTotalPrice));
        document.querySelectorAll('.delete-icon').forEach(icon => icon.addEventListener('click', deleteSingleItem));

        updateTotalPrice(); // Initialize total price
    }

    // Handle quantity change
    function handleQuantityChange(e) {
        const index = e.target.dataset.index;
        const change = e.target.classList.contains('minus-btn') ? -1 : 1;
        updateQuantity(index, change);
    }

    // Function to update the quantity and subtotal
    function updateQuantity(index, change) {
        const quantityInput = document.querySelector(`.quantity-input[data-index="${index}"]`);
        let quantity = parseInt(quantityInput.value) + change;
        if (quantity < 1) quantity = 1; // Ensure at least 1 item
        quantityInput.value = quantity;

        const price = parseFloat(cartsItemsGL[index].product.product_price);
        const subtotal = document.getElementById(`subtotal${index}`);
        subtotal.textContent = `$${(quantity * price).toFixed(2)}`;

        updateTotalPrice();
    }

    // Function to update the total price of selected items
    function updateTotalPrice() {
        let totalPrice = 0;

        cartsItemsGL.forEach((item, index) => {
            const checkbox = document.getElementById(`item${index}`);
            if (checkbox.checked) {
                const quantity = item.quantity;
                const price = parseFloat(item.variant.product.product_price);
                totalPrice += quantity * price;
            }
        });

        document.getElementById('totalPriceContainer').innerHTML = `
            <h5 class="fw-bold" style="font-size: 24px; color:blue;">តម្លៃទំនិញសរុប: <span class="text-primary" >$${totalPrice.toFixed(2)}</span></h5>
        `;
    }

    // Handle "Select All" functionality
    document.getElementById('selectAll').addEventListener('change', function () {
        const isChecked = this.checked;
        document.querySelectorAll('.item-checkbox').forEach(checkbox => checkbox.checked = isChecked);
        updateTotalPrice();
    });

    // Function to delete a single cart item
    function deleteSingleItem(e) {
        const index = e.currentTarget.dataset.index;

        // Assuming each cart item has an ID
        const itemId = cartsItemsGL[index].id;

        $.ajax({
            url: `/remove-from-cart`,
            method: 'DELETE',
            data: {
                'id': itemId
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (res) {
                if (res.status === 200) {
                    showSuccess('deleted cart successfully🎉');

                    // call from other js
                    getAllCartItems();

                    // Remove the item from the global array and re-render the cart
                    cartsItemsGL.splice(index, 1);

                    renderCartItems(cartsItemsGL);
                    updateTotalPrice();
                } else {
                    showError('Failed to delete item.');
                }
            },
            error: function () {
                showError('Error deleting the item.');
            }
        });
    }


    // Function to delete selected items (bulk delete)
    // document.getElementById('deleteSelectedAllItems').addEventListener('click', function () {
    //     const selectedItems = cartsItemsGL.filter((item, index) => document.getElementById(`item${index}`).checked);
    //     const selectedItemIds = selectedItems.map(item => item.id);

    //     if (selectedItemIds.length > 0) {
    //         $.ajax({
    //             url: '/delete-multiple-from-cart',
    //             method: 'DELETE',
    //             data: {
    //                 'ids': selectedItemIds,
    //             },
    //             headers: {
    //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //             },
    //             success: function (res) {
    //                 if (res.status === 200) {
    //                     // Remove selected items from the global array based on selected IDs
    //                     cartsItemsGL = cartsItemsGL.filter(item => !selectedItemIds.includes(item.id));

    //                     // Re-render the cart and update the total price
    //                     renderCartItems(cartsItemsGL);
    //                     updateTotalPrice();

    //                     // call from other js
    //                     getAllCartItems();

    //                     showSuccess('deleted cart successfully🎉');
    //                 } else {
    //                     showError('Failed to delete selected items.');
    //                 }
    //             },
    //             error: function () {
    //                 showError('Error deleting the selected items.');
    //             }
    //         });
    //     }
    // });

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

    function btnCheckOut() {
        $('#id-btn-checkout').on('click', function () {
            // Filter the checked items
            const FilterOnlyCartItemsSelected = cartsItemsGL.filter((item, index) => {
                const checkbox = document.getElementById(`item${index}`);
                return checkbox && checkbox.checked;
            });

            // Check for out-of-stock items in the selected list
            const outOfStockItems = FilterOnlyCartItemsSelected.filter(cartItem => cartItem.product.quantity === 0);

            if (outOfStockItems.length > 0) {
                const dmain = window.location.origin;

                const titleDialog = '<strong>These Products Are Out of Stock</strong>';

                const contentDialog = outOfStockItems.map(item => {
                    const productName = item.product.product_name;

                    const imagePath = item.product.product_image.length > 0
                        ? `${dmain}/uploads/products/${item.product.product_image[0].image_path}`
                        : 'https://via.placeholder.com/100?text=No+Image';

                    return `
                         <div style="font-size: 14px; color: #555; margin-bottom: 10px;">
                            Please deselect products that are out of stock:
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <img width="100px" style="border-radius: 8px; margin-right: 10px;" src="${imagePath}" alt="${productName}">
                            <span style="font-size: 16px; font-weight: bold;">${productName}</span>
                        </div>
                    `;
                }).join('');

                // Show dialog for out-of-stock items
                MyJConfirmDialog({
                    title: titleDialog,
                    content: contentDialog,
                    autoClose: 'Cancel|30000',
                    type: 'red',
                    onConfirm: function () {

                    },
                    cancelText: 'Cancel',
                    onCancel: function () {

                    }
                });

                return;
            }

            // If no out-of-stock items are selected
            if (FilterOnlyCartItemsSelected.length > 0) {
                window.location.href = `/buy-now-page?items=${JSON.stringify(FilterOnlyCartItemsSelected)}`;
            } else {
                showError('No items selected for checkout.');
            }
        });
    }

    btnCheckOut();


});
