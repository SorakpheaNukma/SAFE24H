$(document).ready(function () {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const totalPrice = params.get('Total_Price');
        const orderId = params.get('Order_Id');

        return { totalPrice, orderId };
    }

    const orderDetails = getQueryParams();

    if (orderDetails) {
        $('#order-number').text(orderDetails.orderId || "Unknown");
        $('#total-amount').text(`$${parseFloat(orderDetails.totalPrice || 0).toFixed(2)}`);
    }
});
