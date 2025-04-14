@extends('client.layouts.app')

<meta name="user_id" content="{{ Auth::user()->user_id }}">

@section('content')
@include('client.layouts.nav_bar')

<main class="mx-3 mb-3">
    <!-- Back Icon and Text Home -->
    <div class="container_back" style="display:flex; flex-direction: row; padding-left:12px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>

        <span class="fs-4 ms-2">Home</span>
    </div>

    <div class="container-fluid" id="container_detail_page">
        <div class="row">
            <!-- Product Images -->
            <div class="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center mb-3 mb-md-0">
                <!-- Product Images Carousel -->
                <div id="carouselProductImages" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner" id="id-product-images" style="width:273px; height:409px;">
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
            </div>

            <!-- Product Details -->
            <div class="col-12 col-md-4 d-flex flex-column justify-content-start align-items-start">
                <h1 id="id-product-name" class="product-title" style="padding-left: 0;"></h1>
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
                    <button id="id-btn-buy-now" class="btn-add btn btn-primary ">Buy It Now</button>
                    <button id="id-btn-add-to-cart" class="btn-add btn btn-secondary">Add to Cart</button>
                </div>
                <!-- Quantity Selector -->
                <div class="quantity-container mt-3">
                    <span class="fw-medium" style="white-space: nowrap;">Quantity</span>
                    <div class="quantity_count d-flex align-items-center" style="gap: 5px;">
                        <button class="btn btn-secondary" id="minusBtn">-</button>
                        <input type="number" class="form-control text-center" id="id-quantityInput" value="0" min="0"
                            style="width: 60px;">
                        <button class="btn btn-secondary" id="plusBtn">+</button>
                    </div>
                </div>
            </div>
            <!-- Product Description -->
            <div class="Product_Description col-12 col-md-4 d-flex flex-column mb-3 mb-md-0">
                <div style="font-weight: bold; text-align: left; white-space: nowrap; font-size:40px">Descriptions</div>
                <div id="product-detail-id" class="w-100"></div>
            </div>
        </div>

        <div class="container_comment" style="padding-left:15px">
            <p style="font-size: 25px; font-weight:bold;">Comment and Rate</p>
            <div >
                comment here
            </div>
        </div>

        <!-- Recommend Items -->
        <div style="padding: 15px; width:100%;">
            <div class="row">
                <div>
                    <p class="fw-semibold fs-4 p-0 m-0" >Recommend items</p>
                        <div class="d-flex flex-wrap justify-content-start" style="margin-top:10px; gap:auto;" id="recommend-items-grid">
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