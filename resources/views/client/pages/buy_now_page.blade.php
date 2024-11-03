@extends('client.layouts.app')
<meta name="user_id" content="{{ Auth::user()->user_id }}">

@section('content')
@include('client.layouts.nav_bar')

<main id="main-content" class="mx-3 mb-3">
    <!-- Back Button -->
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="{{ url()->previous() }}" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-4 ms-2">Buy it now</span>
    </div>

    <!-- 1: Address Information -->
    <div class="container">
        <div class="row">
            <div class="col-12 d-flex flex-md-row flex-column justify-content-md-between">
                <h6 class="fw-bold">Address Information</h6>
                <h6 id="id-change-address" class="text-primary">Change</h6>
            </div>
            <div class="col-md-12 col-10 mt-2">
                <div class="container">
                    <p class="fw-semibold mb-1">Name: {{ Auth::user()->username }}</p>
                    <p class="mb-1">Phone: {{ Auth::user()->phone_number }}</p>

                    @if(Auth::user()->address && Auth::user()->country)
                    <p class="mb-0">Address: {{ Auth::user()->address }}, {{ Auth::user()->country }}</p>
                    @else
                    <p class="mb-0"></p>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- 2: Product List -->
    <div class="container mt-2">
        <div class="row">
            <div class="col-12">
                <h6 class="fw-bold">Product List</h6>
            </div>
            <div id="product-list" class="container mt-2"></div>

            <div id="order-total" class="col-12 d-flex flex-column flex-md-row justify-content-between mt-3">
                <h6 class="fw-bold mb-2 mb-md-0">Order Total (0 Items):</h6>
                <h6 class="fw-bold text-md-end">$0.00</h6>
            </div>
        </div>
    </div>

    <!-- 3: Payment Option -->
    <div class="container mt-2">
        <div class="row">
            <div class="col-12">
                <h6 class="fw-bold">Payment Option</h6>
            </div>
            <div class="mx-3 d-flex">
                <input id="id-payment-method" type="checkbox" />
                <span class="ms-2">Cash on delivery</span>
            </div>
        </div>
    </div>

    <!-- Payment Details -->
    <div class="container mt-2 p-3">
        <div class="row">
            <div class="col-12 mb-3">
                <h6 class="fw-bold">Payment Details</h6>
            </div>
            <div class="col-12 p-3 text-black rounded" style="background-color: burlywood;">
                <div class="row mb-2">
                    <div class="col-6">Merchandise</div>
                    <div class="col-6 text-end" id="merchandise-total">$0.00</div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">Shipping Subtotal</div>
                    <div class="col-6 text-end" id="shipping-total">$5.00</div>
                </div>
                <hr class="my-2 text-white" />
                <div class="row">
                    <div class="col-6 fw-bold">Total Payment</div>
                    <div class="col-6 text-end fw-bold" id="total-payment">$0.00</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 5: Final Payment -->
    <div class="container">
        <div class="row">
            <div class="col-6">
                <div class="d-flex flex-column text-end">
                    <h4>Total Payment</h4>
                    <h6 class="mb-0 fw-bold" id="final-total">$0.00</h6>
                </div>
            </div>
            <div class="col-6 d-flex align-items-center">
                <button id="id-btn-order" class="btn btn-primary">Order</button>
            </div>
        </div>
    </div>
</main>

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/buy_now_page.js') }}"></script>
@endsection