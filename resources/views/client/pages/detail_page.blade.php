@extends('client.layouts.app')

<meta name="user_id" content="{{ Auth::check() ? Auth::user()->user_id : '' }}">
<meta name="is_logged_in" content="{{ Auth::check() ? 'true' : 'false' }}">


@section('content')
@include('client.layouts.nav_bar')

<main class="mx-3 mb-3">
    <!-- Back Icon and Text Home -->
    <div class="container_back" style="display: flex; align-items: center; padding-left: 12px; gap: 8px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer" class="text-blue text-decoration-none d-flex align-items-center justify-content-center">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>

        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>

    <div class="container-fluid" id="container_detail_page">
        <div class="row">
                        <!-- Product Images -->
            <div class="col-12 col-md-4 d-flex flex-column align-items-center mb-3">
            <!-- Carousel hình ảnh chính -->
            <div id="carouselProductImages" class="carousel slide mb-3" data-ride="carousel">
                <div class="carousel-inner rounded shadow" id="id-product-images"
                     style="max-width: 300px; max-height: 450px; margin: 0 auto;">
                    <!-- JS sẽ chèn ảnh vào đây -->
                </div>
                <!-- Controls -->
                <a class="carousel-control-prev" href="#carouselProductImages" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </a>
                <a class="carousel-control-next" href="#carouselProductImages" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </a>
            </div>

            <!-- Thumbnail preview -->
            <div class="d-flex justify-content-center gap-2 flex-wrap" id="carousel-thumbnails">
                <!-- JS render các thumbnail -->
            </div>
        </div>

            <!-- Product Details -->
            <div class="col-12 col-md-4 d-flex flex-column justify-content-start align-items-start">
                <!-- Product Name -->
                <div class="marquee-container">
                    <div class="marquee-text" id="id-product-name">
                        Đây là một tên sản phẩm cực kỳ dài mà bạn không thể bỏ qua đâu nha!
                    </div>
                </div>


                <!-- Price -->
                <div>
                    <span id="id-price" class="fs-4 fw-bold"></span>
                </div>

                <!-- Free Return -->
                <div class="price-info mb-3 mt-2">
                    <span class="icon-check p-1 rounded-pill" style="background-color: #F3F3F3;">
                        <i class="fa-solid fa-check"></i>
                    </span>
                    <span class="text">អាចដូរវិញបាន ឥតគិតថ្លៃ</span>
                </div>

                <div class="d-flex gap-4 mb-2">
                    <p class="rating-stars text-warning fs-5 mb-0"></p>
                    <p class="avg-rating-text text-muted mb-0"></p>
                </div>


                <!-- Sold -->
                <div style="display:flex; flex-direction:row; gap:10px;">
                    <p id="id-sold"></p> 
                    <p id="id-stock"></p>
                </div>
                <!-- Quantity Selector -->
                <div class="quantity-container mt-3 mb-3">
                    <span class="fw-medium" style="white-space: nowrap;">ចំនួន:</span>
                    <div class="quantity_count d-flex align-items-center" style="gap: 5px;">
                        <button class="btn btn-secondary" id="minusBtn">-</button>
                        <input type="number" class="form-control text-center" id="id-quantityInput" value="0" min="0"
                            style="width: 60px;">
                        <button class="btn btn-secondary" id="plusBtn">+</button>
                    </div>
                </div>
                <!-- Size Selector -->
                <div class="mb-3 d-flex align-items-center" style="gap: 10px;">
                    <label for="id-sizeSelect" class="fw-medium mb-0">ទំហំ:</label>
                    <select id="id-sizeSelect" class="form-select" style="width: 150px;">
                    <option value="" disabled selected hidden>ជ្រើសរើសទំហំ</option>    
                    <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="2XL">2XL</option>
                    </select>
                </div>

                <!-- Buttons -->
                <div class="d-flex w-100 justify-content-start gap-4">
                    <button id="id-btn-buy-now" class="btn-add btn btn-primary" style="width: 226px; height: 49px;">ទិញឥឡូវនេះ</button> 
                    <button id="id-btn-add-to-cart" class="btn-add btn btn-secondary" style="width: 226px; height: 49px;">បន្ថែមទុកក្នុងកន្ត្រក</button>
                </div>
            </div>

            <!-- Product Description -->
            <div class="Product_Description col-12 col-md-4 d-flex flex-column mb-3 mb-md-0">
                <div style="font-weight: bold; text-align: left; white-space: nowrap; font-size:40px">អំពីទំនិញ</div>
                <div id="product-detail-id" class="w-100"></div>
            </div>
        </div>

        <div class="container_comment" style="padding-left:15px">
            <div style="display:flex; flex-direction:row;">
                <p style="font-size: 25px; font-weight:bold;">មតិ និងការវាយតម្លៃ</p>
            </div>
            <div class="comments-list">
                <!-- Các comment sẽ được AJAX đổ vào đây -->
            </div>
        </div>

        <!-- Recommend Items -->
        <div style="padding: 15px; width:100%;">
            <div class="row">
                <div>
                    <p class= "fw-semibold fs-4 p-0 m-0 bold" >ទំនិញស្រដៀងៗគ្នា</p>
                        <div class="d-flex flex-wrap justify-content-start" style="margin-top:10px; gap:auto;" id="recommend-items-grid">
                    </div>
                    <div class="text-center mt-3" id="view-more-container" style="display: none;">
                        <button class="btn btn-dark" onclick="addMoreItems()">បន្ថែមទៀត</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/detail_page.js') }}"></script>
    <!-- SweetAlert2 CSS & JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
@endsection