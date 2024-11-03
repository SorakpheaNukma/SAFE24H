@extends('client.layouts.app')

@section('content')

<div class="container my-5">
    <!-- Back Button -->
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="/profile-page" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-4 ms-2">My Orders</span>
    </div>

    <!-- Tabs for Order Status -->
    <ul class="nav nav-tabs justify-content-center mb-4" role="tablist">
        <li class="nav-item position-relative">
            <span id="badge-processing" class="d-none custom-badge position-absolute badge rounded-pill"
                style="background-color: blue; color: white; transform: translate(100%, -50%); z-index: 1;">2</span>
            <a class="nav-link active" data-toggle="tab" href="#processing-orders" role="tab">Processing</a>
        </li>
        <li class="nav-item position-relative">
            <span id="badge-shipped" class="d-none custom-badge position-absolute badge rounded-pill"
                style="background-color: blue; color: white; transform: translate(100%, -50%); z-index: 1;">5</span>
            <a class="nav-link" data-toggle="tab" href="#shipped-orders" role="tab">Shipped</a>
        </li>
        <li class="nav-item position-relative">
            <a class="nav-link" data-toggle="tab" href="#received-orders" role="tab">Completed</a>
        </li>
    </ul>


    <!-- Tab Content -->
    <div class="tab-content">
        <!-- Processing Orders -->
        <div class="tab-pane fade show active" id="processing-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>

        <!-- Shipped Orders -->
        <div class="tab-pane fade" id="shipped-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>

        <!-- Received Orders -->
        <div class="tab-pane fade" id="received-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>
    </div>
</div>

<link rel="stylesheet" href="{{asset('assets/css/order_history_page.css')}}" />
<script src="{{ asset('assets/js/order_history_page.js') }}"></script>

@endsection