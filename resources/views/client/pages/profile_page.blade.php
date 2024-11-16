@extends('client.layouts.app')
@section('content')
@include('client.layouts.nav_bar')
<style>
    .changeFontAwesomeColor {
        color: blueviolet;
    }
</style>
<meta name="username" content="{{ Auth::user()->username }}">
<meta name="phone_number" content="{{ Auth::user()->phone_number }}">
<meta name="email" content="{{ Auth::user()->email }}">

<main class="mx-2">
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="/home-page" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-4 ms-2">Your information</span>
    </div>

    <div class="container">
        <div class="row">
            <div>
                <div class="col-12">
                    <img width="100px" src="assets/images/profile.png" />
                </div>

                <div class="d-flex">
                    <div class="d-flex flex-column">

                        <div class="col-12 mt-4">
                            <h7>{{ Auth::user()->username }}</h7>
                        </div>
                        <div class="col-12">
                            <h7>{{ Auth::user()->phone_number }}</h7>
                        </div>
                        <div class="col-12">
                            <h7>{{ Auth::user()->email }}</h7>
                        </div>
                    </div>

                    <!-- Edit text aligned center vertically and placed at the end -->
                    <div class="d-flex fw-bold align-items-center justify-content-end" style="width: 100%;">
                        <h7 id="id-edit-info" style="cursor: pointer">Edit</h7>
                    </div>

                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div>
                <div>
                    <h5>Your Transaction</h5>
                </div>

                <div class="col-12 d-flex justify-content-around py-4">
                    <!-- To Pay Section -->
                    <a id="id-link-to-order-history-processing" class="text-center text-decoration-none"
                        style="cursor: pointer;">
                        <span id="idBadges-processing"
                            class="d-none custom-badge position-absolute start-10 badge rounded-pill"
                            style="background-color: blue; color: white; transform:translate(242%,-50%)!important"></span>

                        <i class="fas fa-money-bill-wave fa-2x changeFontAwesomeColor"></i>
                        <p>Process</p>
                    </a>

                    <!-- To Ship Section -->
                    <a id="id-link-to-order-history-toShip" class="text-center text-decoration-none"
                        style="cursor: pointer;">

                        <span id="idBadges-Ship"
                            class="d-none custom-badge position-absolute start-10 badge rounded-pill"
                            style="background-color: blue; color: white; transform:translate(242%,-50%)!important"></span>

                        <i class="fas fa-shipping-fast fa-2x changeFontAwesomeColor"></i>
                        <p>To Ship</p>
                    </a>

                    <!-- To Receive Section -->
                    <a id="id-link-to-order-history-completed" class="text-center text-decoration-none"
                        style="cursor: pointer;">

                        <i class="fas fa-box-open fa-2x changeFontAwesomeColor"></i>
                        <p>Completed</p>
                    </a>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12 d-flex flex-column">
                <h5>Recent Viewed</h5>

                <h7>You migth forgot to put these products in to your cart</h7>

                <!-- Custom styled div for horizontal line -->
                <div style="border-bottom: 1px solid #848484; width: 100%; margin-top: 5px;"></div>
            </div>

            <div class="col-12 d-flex flex-column mt-3 mb-3">
                <h5>Complain</h5>

                <h7>Experiencing bad things? Tell Us</h7>

                <!-- Custom styled div for horizontal line -->
                <div style="border-bottom: 1px solid #848484; width: 100%; margin-top: 5px;"></div>
            </div>
        </div>

    </div>
</main>

<script src="{{ asset('assets/js/profile_page.js') }}"></script>
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>

@endsection