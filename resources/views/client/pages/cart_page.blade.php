@extends('client.layouts.app')

@section('content')
@include('client.layouts.nav_bar')

<main class="mx-3 mb-3">
    <!-- Back Icon and Text Home lỗi chưa back được -->
    <div class="container_back" style="display: flex; align-items: center; padding-left: 12px; gap: 8px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer"
                class="text-blue text-decoration-none d-flex align-items-center justify-content-center">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>

        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>
    <script>
    function goBackHome() {
        window.history.back();
    }
    </script>



    <div class="container">
        <!-- Select All -->
        <div class="row align-items-center mb-3 bottom-border">
            <div class="col-12">
                <div class="form-check">
                    <div class="text-center">
                        <p class="fw-semibold fs-4 p-0 m-0">បញ្ជីទំនិញក្នុងកន្ត្រកស្តុក</p>
                    </div>
                    <input class="form-check-input" type="checkbox" id="selectAll" />
                    <label class="form-check-label" for="selectAll" style="color: blue;">ជ្រើសរើសយកទាំងអស់</label>
                </div>
            </div>
        </div>
    </div>

    <!-- Cart Items -->
    <div class="container" id="cartItemsContainer">

    </div>
    <!--End Cart Items -->

    <!-- Wrapper: căn giữa và nằm ngang -->
    <div class="container mt-4 d-flex justify-content-center align-items-center gap-4 flex-wrap">
        <!-- Tổng tiền -->
        <div id="totalPriceContainer" class="mb-0" style="color:blue"></div>
        <!-- Nút thanh toán -->
        <div id="id-check-out" class="">
            <button id="id-btn-checkout" class="btn btn-primary" style="width: 226px; height: 49px;">
                ទិញឥឡូវនេះ
            </button>
        </div>
    </div>
</main>

<!-- CSRF Token -->
<meta name "csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="{{ asset('assets/css/cart_page.css') }}">

<script src="{{ asset('assets/js/cart_page.js') }}"></script>
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<!-- SweetAlert2 CSS & JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
@endsection