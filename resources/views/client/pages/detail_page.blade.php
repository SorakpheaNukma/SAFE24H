@extends('client.layouts.app')

<meta name="user_id" content="{{ Auth::check() ? Auth::user()->user_id : '' }}">
<meta name="is_logged_in" content="{{ Auth::check() ? 'true' : 'false' }}">

@section('content')
@include('client.layouts.nav_bar')

<!-- MAIN CONTENT START -->
<main class="container mb-5"> <!-- Dùng container chuẩn Bootstrap -->

    <!-- Back Icon -->
    <div class="d-flex align-items-center mb-3" style="gap: 8px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer"
                class="text-blue text-decoration-none d-flex align-items-center justify-content-center">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="text" style="font-size: 16px">ត្រឡប់ក្រោយ</span>
    </div>

    <!-- Detail Section -->
    <div id="container_detail_page" class="row g-4">
        <!-- Product Images -->
        <div class="col-12 col-md-3 d-flex flex-column align-items-center mb-3">
            <div class="swiper mySwiper" style="max-width: 300px; max-height: 450px; margin: 0 auto;">
                <div class="swiper-wrapper" id="id-product-images"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <!-- Product Details -->
        <div class="col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
            <div id="id-product-name" class="product-line fw-bold fs-2 mb-2 text-break"></div>

            <div class="product-line">
                <span id="id-price" class="custom-price"></span>
            </div>

            <div class="product-line price-info">
                <span class="icon-check p-1 rounded-pill" style="background-color: #F3F3F3;">
                    <i class="fa-solid fa-check"></i>
                </span>
                <span class="text">អាចដូរវិញបាន ឥតគិតថ្លៃ</span>
            </div>

            <div class="product-line d-flex gap-4">
                <p class="rating-stars text-warning fs-2 mb-0"></p>
                <p class="avg-rating-text text-muted mb-0"></p>
            </div>

            <div class="mb-2 d-flex gap-3">
                <p id="id-sold"></p>
                <p id="id-stock"></p>
            </div>
            <!-- Size -->
            <div class="product-line d-flex align-items-center">
                <label for="id-sizeSelect" class="fw-medium mb-0 me-2">ទំហំ:</label>
                <select id="id-sizeSelect" class="form-select" style="width: 150px;">
                    <option value="" disabled selected hidden>ជ្រើសរើសទំហំ</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                </select>
            </div>

            <!-- Quantity -->
            <div class="quantity-container mb-3 mt-2">
                <span class="fw-medium">ចំនួន:</span>
                <div class="quantity_count d-flex align-items-center gap-2">
                    <button class="btn btn-secondary" id="minusBtn">-</button>
                    <input type="number" class="form-control text-center" id="id-quantityInput" value="0" min="0"
                        style="width: 60px;">
                    <button class="btn btn-secondary" id="plusBtn">+</button>
                </div>
            </div>


            <!-- Buttons -->
                <div class="product-line d-flex w-100 justify-content-start gap-4">
                    <button id="id-btn-buy-now" class="btn-add btn btn-primary" style="width: 226px; height: 49px;">ទិញឥឡូវនេះ</button> 
                    <button id="id-btn-add-to-cart" class="btn-add btn btn-secondary" style="width: 226px; height: 49px;">បន្ថែមទុកក្នុងកន្ត្រក</button>
                </div>
            </div>

        <!-- Product Description -->
        <div class="col-12 col-md-3 d-flex flex-column mb-3">
            <div class="fw-bold text-start" style="font-size: 32px;">អំពីទំនិញ</div>
            <div id="product-detail-id" class="w-100"></div>
        </div>
    </div>

    <!-- Comment Section -->
    <div class="container_comment mt-4">
        <div class="mb-2">
            <p class="fw-bold" style="font-size: 25px;">មតិ និងការវាយតម្លៃ</p>
        </div>
        <div class="comments-list">
            <!-- AJAX comment rendering -->
        </div>
    </div>

    <!-- Recommend Items -->
    <div class="mt-4">
        <p class="fw-semibold fs-3">ទំនិញស្រដៀងៗគ្នា</p>
        <div class="d-flex flex-wrap justify-content-start mt-2" id="recommend-items-grid"></div>
        <div class="text-center mt-3" id="view-more-container" style="display: none;">
            <button class="btn btn-dark" onclick="addMoreItems()">បន្ថែមទៀត</button>
        </div>
    </div>

</main>

<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" />

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"></script>

<!-- Script JS -->
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/detail_page.js') }}"></script>

<!-- SweetAlert -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
@endsection
