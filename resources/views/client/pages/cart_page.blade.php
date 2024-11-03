@extends('client.layouts.app')

@section('content')
@include('client.layouts.nav_bar')

<main class="mx-3 mb-3">
    <!-- Back Icon and Text Home -->
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="{{ url()->previous() }}" class=" text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-4 ms-2">Your cart</span>
    </div>

    <div class="container">
        <!-- Select All -->
        <div class="row align-items-center mb-3 bottom-border">
            <div class="col-12">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="selectAll" />
                    <label class="form-check-label" for="selectAll">Select All</label>

                    <!--btn delete-->
                    <label id="deleteSelectedAllItems" class="form-check-label ms-3" for="item1">
                        <i class="fa-solid fa-trash-can" style="cursor: pointer;"></i>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <!-- Cart Items -->
    <div class="container" id="cartItemsContainer">
    </div>
    <!--End Cart Items -->

    <div id="totalPriceContainer" class="mt-4 container"></div>

    <!-- Check Out Button -->
    <div id="id-check-out" class="d-none container mt-4">
        <div class="row">
            <div class="col-12 text-end">
                <button id="id-btn-checkout" class="btn btn-primary">Check Out</button>
            </div>
        </div>
    </div>

</main>


<link rel="stylesheet" href="{{ asset('assets/css/cart_page.css') }}">

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/cart_page.js') }}"></script>
@endsection