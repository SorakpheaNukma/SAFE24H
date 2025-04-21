@extends('client.layouts.app')

@section('content')
<link rel="stylesheet" href="{{ asset('assets/css/order_success.css') }}">

<main>
    <div class="container mt-4">
        <div class="order-success-card">
            <!-- Success Icon -->
            <div class="icon">
                <i class="fas fa-check-circle"></i>
            </div>

            <!-- Success Message -->
            <h1>Order Successful!</h1>
            <p class="lead">Thank you for your purchase. Your order has been placed successfully.</p>

            <!-- Order Details -->
            <!-- cap nhat them code de lay thong tin -->
            <div class="order-details"> 
                <h5>Order Number: <span class="fw-bold" id="order-number">#</span></h5>
                <h5>Total Amount: <span class="fw-bold" id="total-amount">$0.00</span></h5>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 row">
                <div class="col-6">
                    <a href="/profile-page" class="btn btn-custom btn-lg mb-3 w-100">View Order Details</a>
                </div>
                <div class="col-6">
                    <a href="/home-page" class="btn btn-outline-secondary btn-lg mb-3 w-100">Home</a>
                </div>
            </div>
        </div>
    </div>
</main>

<script src="{{ asset('assets/js/order_sucess.js') }}"></script>
@endsection