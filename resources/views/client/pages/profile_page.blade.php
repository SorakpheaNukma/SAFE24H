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
    <div class="container d-flex justify-content-start align-items-center mb-3" style="margin-left: 0;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="/home-page" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>

    <div class="container">
        <h5 class="fw-bold mb-3">ព័ត៌មានរបស់អ្នក</h5>

        <div class="row">
            <!-- Cột chính -->
            <div class="col-12 d-flex align-items-start">

                <!-- Ảnh đại diện -->
                <div class="me-3">
                    <img width="100px" src="assets/images/profile.png" />
                 </div>

                <!-- Thông tin + nút Edit -->
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start w-100">
                        
                        <!-- Thông tin người dùng -->
                        <div class="d-flex flex-column">
                            <p class="mb-2">ឈ្មោះ ៖ {{ Auth::user()->username }}</p>
                            <p class="mb-1 mt-1">លេខទូរស័ព្ទ ៖ {{ Auth::user()->phone_number }}</p>
                            <p class="mb-1 mt-1">អ៊ីម៉ែល ៖ {{ Auth::user()->email }}</p>
                        </div>

                        <!-- Nút Edit -->
                        <div class="fw-bold text-primary ms-3" style="cursor: pointer;" id="id-edit-info">
                            កែសម្រួល
                        </div>
                    </div>
                </div>

            </div>

        </div>


        <div class="row mt-3">
            <div>
                <div>
                    <h5>ប្រតិបត្តិការទំនិញរបស់អ្នក</h5>
                </div>

                <div class="col-12 d-flex justify-content-around py-4">
                    <!-- To Pay Section -->
                    <a id="id-link-to-order-history-processing" class="text-center text-decoration-none"
                        style="cursor: pointer;">
                        <span id="idBadges-processing"
                            class="d-none custom-badge position-absolute start-10 badge rounded-pill"
                            style="background-color: blue; color: white; transform:translate(242%,-50%)!important"></span>

                        <i class="fas fa-money-bill-wave fa-2x changeFontAwesomeColor"></i>
                        <p>កំពុងធ្វើការរៀបចំ</p>
                    </a>

                    <!-- To Ship Section -->
                    <a id="id-link-to-order-history-toShip" class="text-center text-decoration-none"
                        style="cursor: pointer;">

                        <span id="idBadges-Ship"
                            class="d-none custom-badge position-absolute start-10 badge rounded-pill"
                            style="background-color: blue; color: white; transform:translate(242%,-50%)!important"></span>

                        <i class="fas fa-shipping-fast fa-2x changeFontAwesomeColor"></i>
                        <p>កំពុងធ្វើការដឹកជញ្ជូន</p>
                    </a>

                    <!-- To Receive Section -->
                    <a id="id-link-to-order-history-completed" class="text-center text-decoration-none"
                        style="cursor: pointer;">

                        <i class="fas fa-box-open fa-2x changeFontAwesomeColor"></i>
                        <p>បានទទួលជោគជ័យ</p>
                    </a>
                </div>
            </div>
        </div>

        <!--<div class="row mt-3">
            <div class="col-12 d-flex flex-column">
                <h5>Recent Viewed</h5>

                <h7>You migth forgot to put these products in to your cart</h7>

                 Custom styled div for horizontal line 
                <div style="border-bottom: 1px solid #848484; width: 100%; margin-top: 5px;"></div>
            </div>

            <div class="col-12 d-flex flex-column mt-3 mb-3">
                <h5>Complain</h5>

                <h7>Experiencing bad things? Tell Us</h7>

                 Custom styled div for horizontal line 
                <div style="border-bottom: 1px solid #848484; width: 100%; margin-top: 5px;"></div>
            </div>
        </div>-->

    </div>
</main>

<script src="{{ asset('assets/js/profile_page.js') }}"></script>
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>

@endsection