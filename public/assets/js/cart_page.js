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
        const imagePath = item.product.product_image.length > 0 ? item.product.product_image[0].image_path : 'default.jpg';

        return `
            <div class="row align-items-center mb-4">
                <div class="col-1">
                    <input class="form-check-input item-checkbox" type="checkbox" id="item${index}" />
                    <label class="form-check-label ms-0 ms-md-2 delete-icon" data-index="${index}">
                        <i class="fa-solid fa-trash-can" style="cursor: pointer;"></i>
                    </label>
                </div>
                <div class="col-4 col-md-2">
                    <img width="100px" src="${dmain}/uploads/products/${imagePath}" alt="${item.product.product_name}">
                </div>
                <div id="idInfoProduct${index}" class="col-7 col-md-9">
                    <div class="product-description mb-0 p-0">
                        <div class="row">
                            <div class="col-12 d-flex flex-column flex-md-row justify-content-between">
                                <div><h5>${item.product.product_name}</h5></div>
                                <div class="d-flex">
                                    <p class="mb-0">Price:</p>
                                    <p class="mb-0 ms-2">$${item.product.product_price}</p>
                                </div>
                            </div>
                        </div>
                        <p>${item.product.des_1}</p>
                    </div>
                    <p class="text-primary g-0 p-0 m-0">In Stock</p>
                    <div class="quantity-container mb-2">
                        <div class="d-flex align-items-center">
                            <h7>Quantity</h7>
                            <div class="d-flex align-items-center mx-2">
                                <button class="btn btn-secondary btn-sm minus-btn" data-index="${index}">-</button>
                                <input type="number" class="form-control mx-2 quantity-input" data-index="${index}" value="${item.quantity}" min="1" style="width: 60px;">
                                <button class="btn btn-secondary btn-sm plus-btn" data-index="${index}">+</button>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <h7>Subtotal:</h7>
                            <span class="text-success subtotal" id="subtotal${index}">$${(item.product.product_price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to render all cart items
    function renderCartItems(items) {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        cartItemsContainer.innerHTML = items.map((item, index) => createCartItem(item, index)).join('');

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
                const quantity = parseInt(document.querySelector(`.quantity-input[data-index="${index}"]`).value);
                const price = parseFloat(item.product.product_price);
                totalPrice += quantity * price;
            }
        });

        document.getElementById('totalPriceContainer').innerHTML = `
            <h5>Total Price: <span class="text-primary">$${totalPrice.toFixed(2)}</span></h5>
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
    document.getElementById('deleteSelectedAllItems').addEventListener('click', function () {
        const selectedItems = cartsItemsGL.filter((item, index) => document.getElementById(`item${index}`).checked);
        const selectedItemIds = selectedItems.map(item => item.id);

        if (selectedItemIds.length > 0) {
            $.ajax({
                url: '/delete-multiple-from-cart',
                method: 'DELETE',
                data: {
                    'ids': selectedItemIds,
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (res) {
                    if (res.status === 200) {
                        // Remove selected items from the global array based on selected IDs
                        cartsItemsGL = cartsItemsGL.filter(item => !selectedItemIds.includes(item.id));

                        // Re-render the cart and update the total price
                        renderCartItems(cartsItemsGL);
                        updateTotalPrice();

                        // call from other js
                        getAllCartItems();

                        showSuccess('deleted cart successfully🎉');
                    } else {
                        showError('Failed to delete selected items.');
                    }
                },
                error: function () {
                    showError('Error deleting the selected items.');
                }
            });
        }
    });


    function btnCheckOut() {
        $('#id-btn-checkout').on('click', function () {
            // Filter only the checked items
            const FilterOnlyCartItemsSelected = cartsItemsGL.filter((item, index) => {
                const checkbox = document.getElementById(`item${index}`);
                return checkbox && checkbox.checked;
            });

            if (FilterOnlyCartItemsSelected.length > 0) {
                window.location.href = `/buy-now-page?items=${JSON.stringify(FilterOnlyCartItemsSelected)}`;
            } else {
                showError('No items selected for checkout.');
            }
        });
    }

    btnCheckOut();


});
