@extends('client.layouts.app')

<meta name="user_id" content="{{ Auth::user()->user_id }}">

@section('content')
@include('client.layouts.nav_bar')

<main class="mx-3 mb-3">
    <!-- Back Icon and Text Home -->
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>

        <span class="fs-4 ms-2">Home</span>
    </div>

    <div class="container">
        <div class="row">
            <!-- -->
            <div class="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">
                <!-- Product Images Carousel -->
                <div id="carouselProductImages" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner" id="id-product-images">
                        <!-- Images will be inserted here via JavaScript -->
                    </div>
                    <!-- Controls -->
                    <a class="carousel-control-prev" href="#carouselProductImages" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselProductImages" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>

                <!-- Quantity Selector -->
                <div class="quantity-container mt-3">
                    <h7 class="d-md-block">Quantity</h7>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-secondary" id="minusBtn">-</button>
                        <input type="number" class="form-control mx-2" id="id-quantityInput" value="0" min="0"
                            style="width: 60px;">
                        <button class="btn btn-secondary" id="plusBtn">+</button>
                    </div>
                </div>
            </div>

            <!-- -->
            <div class="col-12 col-md-8 d-flex flex-column justify-content-start align-items-start">
                <h1 id="id-product-name" class="product-title" style="padding-left: 0; "></h1>
                <p>Free 2 Days Shipping | 1 Year Warranty</p>

                <!-- Reviews and Rating -->
                <div class="d-flex gap-4">
                    <p>4.5 <i class="fa-solid fa-star"></i></p>
                    {{-- <p>392 Reviews</p> --}}
                </div>

                <!--price-->
                <div>
                    <span id="id-price" class="fs-4 fw-bold"></span>
                </div>
                <!---->
                <div class="price-info mb-3">
                    <span class="icon-check p-1 rounded-pill" style="background-color: #F3F3F3;"><i
                            class="fa-solid fa-check"></i></span>
                    <span class="text">Free return</span>
                </div>

                <p id="id-sold"></p>

                <div class="d-flex w-100 justify-content-start gap-4">
                    <!-- Buttons -->
                    <button id="id-btn-buy-now" class="btn btn-primary ">Buy It Now</button>
                    <button id="id-btn-add-to-cart" class="btn btn-secondary">Add to Cart</button>
                </div>
            </div>

        </div>

        <!--about product-->
        <div>
            <p class="mb-0 mt-2 fw-semibold fs-4">About</p>
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-3">
                        <div id="id-img-about"></div>
                    </div>

                    <div class="col-12 col-md-9">
                        <!-- Product Details -->
                        <div id="product-detail-id"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommend Items -->
        <div style="padding: 15px;">
            <div class="row">
                <div>
                    <p class="fw-semibold fs-4 p-0 m-0">Recommend items</p>
                    <div class="d-flex flex-wrap justify-content-start" id="recommend-items-grid">
                    </div>

                    <div class="text-center mt-3" id="view-more-container" style="display: none;">
                        <button class="btn btn-dark" onclick="addMoreItems()">View More</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</main>

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/detail_page.js') }}"></script>

@endsection