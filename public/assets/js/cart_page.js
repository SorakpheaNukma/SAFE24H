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
                    renderCartItems(cartsItemsGL);
                } else if (res.status === 204 || (res.data && res.data.length === 0)) {
                    $('#cartItemsContainer').html('<p>គ្មានទំនិញក្នុងកន្រ្តករបស់អ្នក</p>');
                } else {
                    console.warn('Unexpected response:', res);
                    showError('Unable to load cart data');
                }
            },            
            error: function (xhr) {
                hideSpinner();
                console.error('Error fetching cart items:', xhr.responseText);
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
        const imagePath = item.images || `${dmain}/uploads/products/default.jpg`;
    
        return `
            <div class="row align-items-center mb-4">
                <div class="col-1">
                    <input class="form-check-input item-checkbox" type="checkbox" id="item${index}" />
                    <label class="form-check-label ms-0 ms-md-2 delete-icon" data-index="${index}">
                        <i class="fa-solid fa-trash-can" style="cursor: pointer;"></i>
                    </label>
                </div>
                <div class="col-11 col-md-11 d-flex align-items-center">
                    <div style="flex-shrink: 0;">
                        <img width="100px" src="${imagePath}" alt="${item.product_name || 'No Name'}"
                             onerror="this.onerror=null;this.src='${dmain}/uploads/products/default.jpg';">
                    </div>
                    <div class="ms-3">
                        <h5 class="mb-1">${item.product_name || 'No Name'}</h5>
                        <p class="mb-1">
                            តម្លៃ:
                            <span style="color: red; font-size: 20px; font-weight: bold;">
                                $${item.price || 0}
                            </span>
                            ${item.original_price && item.original_price != item.price ? `
                                <span style="text-decoration: line-through; color: gray; font-size: 16px;">
                                    $${item.original_price}
                                </span>
                            ` : ''}
                        </p>


                        <p class="mb-0">ទំហំ: ${item.size || 'N/A'}</p>
                        <p class="text-primary g-0 p-0 m-0">${item.stock_quantity <= 0 ? 'អស់ស្តុក' : 'មានស្តុកចំនួន: ' + item.stock_quantity}</p>
                        <div class="quantity-container mb-2">
                            <div class="d-flex align-items-center">
                                <span class="me-2">ចំនួន</span>
                                <div class="d-flex align-items-center mx-2">
                                    <button class="btn btn-secondary btn-sm minus-btn" data-index="${index}">-</button>
                                    <input type="number" class="form-control mx-2 quantity-input" data-index="${index}" value="${item.quantity}" min="1" style="width: 60px;">
                                    <button class="btn btn-secondary btn-sm plus-btn" data-index="${index}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render all cart items
    function renderCartItems(items) {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        if (!items || items.length === 0) {
            cartItemsContainer.innerHTML = '<p>គ្មានទំនិញក្នុងកន្រ្តកស្តុករបស់អ្នក</p>';
            return;
        }
    
        cartItemsContainer.innerHTML = items.map((item, index) => {
            return createCartItem(item, index);
        }).join('');
    
        // Add event listeners for the quantity buttons and checkboxes
        document.querySelectorAll('.minus-btn').forEach(btn => btn.addEventListener('click', handleQuantityChange));
        document.querySelectorAll('.plus-btn').forEach(btn => btn.addEventListener('click', handleQuantityChange));
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function (e) {
                const index = e.target.dataset.index;
                let newQty = parseInt(e.target.value);
                if (isNaN(newQty) || newQty < 1) newQty = 1;

                const item = cartsItemsGL[index];
                if (newQty > item.stock_quantity) newQty = item.stock_quantity;

                e.target.value = newQty;
                item.quantity = newQty; 
                updateTotalPrice();
            });
        });
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
    const item = cartsItemsGL[index];
    const quantityInput = document.querySelector(`.quantity-input[data-index="${index}"]`);
    if (!quantityInput) return; 

    let quantity = parseInt(quantityInput.value) + change;
    if (quantity < 1) quantity = 1;

    
    if (item.stock_quantity !== undefined && quantity > item.stock_quantity) {
        quantity = item.stock_quantity;
    }

    quantityInput.value = quantity;
    item.quantity = quantity;

    const price = parseFloat(item.price || 0); 

    
    const subtotal = document.getElementById(`subtotal${index}`);
    if (subtotal) {
        subtotal.textContent = `$${(quantity * price).toFixed(2)}`;
    }

    updateTotalPrice();
    }

    // Function to update the total price of selected items
    function updateTotalPrice() {
        let totalPrice = 0;
    
        cartsItemsGL.forEach((item, index) => {
            const checkbox = document.getElementById(`item${index}`);
            if (checkbox && checkbox.checked) {
                const quantity = parseInt(document.querySelector(`.quantity-input[data-index="${index}"]`)?.value || 1);
                const price = parseFloat(
                    item?.variant?.product?.product_price ??
                    item?.product?.product_price ??
                    item?.price ??
                    0
                );
                totalPrice += quantity * price;
            }
        });
    
        document.getElementById('totalPriceContainer').innerHTML = `
            <h5 class="fw-bold" style="font-size: 24px; color:blue;">
                សរុបតម្លៃ: <span class="text-primary">$${totalPrice.toFixed(2)}</span>
            </h5>
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

        if (!cartsItemsGL[index]) {
            console.error(`Cart item at index ${index} does not exist`);
            return;
        }

        const itemId = cartsItemsGL[index].cart_id;
        const productName = cartsItemsGL[index].product_name || 'this product';

        
        Swal.fire({
            title: 'លុបទំនិញ',
            html: `តើអ្នកពិតជាចង់លុប <strong>${productName}</strong> ចេញពីកន្ត្រករបស់អ្នកមែនទេ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'លុប',
            cancelButtonText: 'បោះបង់',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                
                $.ajax({
                    url: `/remove-from-cart`,
                    method: 'POST',
                    data: {
                        _method: 'DELETE',
                        id: itemId
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (res) {
                        if (res.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: '✅ លុបទំនិញជោគជ័យ!',
                                text: 'ទំនិញត្រូវបានដកចេញពីកន្ត្រករបស់អ្នក។',
                                confirmButtonText: 'យល់ព្រម'  
                            });

                            cartsItemsGL.splice(index, 1);
                            renderCartItems(cartsItemsGL);
                            updateTotalPrice();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: '❌ មិនអាចលុបបាន!',
                                text: 'មានបញ្ហាកើតឡើង។'
                            });
                        }
                    },
                    error: function (xhr) {
                        console.error('Error deleting the item:', xhr.responseText);
                        Swal.fire({
                            icon: 'error',
                            title: '❌ បរាជ័យ!',
                            text: 'មិនអាចលុបទំនិញបានទេ។'
                        });
                    }
                });
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

function btnCheckOut() {
    $('#id-btn-checkout').on('click', function () {
        // Filter the checked items
        const FilterOnlyCartItemsSelected = cartsItemsGL.filter((item, index) => {
            const checkbox = document.getElementById(`item${index}`);
            return checkbox && checkbox.checked;
        });

        const outOfStockItems = FilterOnlyCartItemsSelected.filter(cartItem => {
            return cartItem.variant?.quantity === 0;
        });

        if (outOfStockItems.length > 0) {
            const dmain = window.location.origin;

            const contentDialog = outOfStockItems.map(item => {
                const productName = item.variant?.product?.product_name;
                const imagePath = item.variant?.product?.product_images?.[0]?.image_path
                    ? `${dmain}/uploads/products/${item.variant.product.product_images[0].image_path}`
                    : 'https://via.placeholder.com/100?text=No+Image';

                return `
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img width="100px" style="border-radius: 8px; margin-right: 10px;" src="${imagePath}" alt="${productName}">
                        <span style="font-size: 16px; font-weight: bold;">${productName}</span>
                    </div>
                `;
            }).join('');

            // Hiển thị SweetAlert2 thay cho MyJConfirmDialog
            Swal.fire({
                title: '<strong>ទំនិញខ្លះអស់ស្តុក</strong>', // "These Products Are Out of Stock" bằng tiếng Khmer
                html: `
                    <div style="font-size: 14px; color: #555; margin-bottom: 10px;">
                        សូមកុំជ្រើសរើសទំនិញដែលអស់ស្តុក៖
                    </div>
                    ${contentDialog}
                `,
                icon: 'warning',
                confirmButtonText: 'យល់ព្រម',
                cancelButtonText: 'បោះបង់',
                showCancelButton: true,
                reverseButtons: true,
                allowOutsideClick: false
            });

            return;
        }

        // Nếu không có sản phẩm hết hàng
        if (FilterOnlyCartItemsSelected.length > 0) {
            const encodedItems = encodeURIComponent(JSON.stringify(FilterOnlyCartItemsSelected));
            window.location.href = `/buy-now-page?items=${encodedItems}`;
        } else {
            // Thay showError bằng SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'កំហុស',
                text: 'មិនមានទំនិញណាមួយត្រូវបានជ្រើសសម្រាប់បញ្ជាទិញ។',
                confirmButtonText: 'យល់ព្រម'
            });
        }
    });
}


    btnCheckOut();


});
