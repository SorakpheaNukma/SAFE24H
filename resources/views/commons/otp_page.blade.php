@extends('commons.layouts.app')

@section('content')
<div>
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <!-- Image Section -->
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 50%;">
        </div>

        <!-- Section 2-->
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start">
            <!-- Back Arrow and Text -->
            <div class="d-flex align-items-start mx-2 mb-3 w-75">
                <a href="{{ url()->previous() }}" class="text-decoration-none text-dark">
                    <i class="fa-solid fa-circle-arrow-left fa-lg"></i> Back
                </a>
            </div>

            <h1 class="mb-2 mx-2">បញ្ចូលលេខកូត</h1>
            <p class="w-75 mx-lg-2 text-lg-start text-center mt-3">
                ពួកយើងបានផ្ញើរលេខកូតតាមអ៊ីម៉ែលរបស់អ្នក.
            </p>

            <!-- OTP Form -->
            <form class="w-75 mx-2">
                <div class="d-flex justify-content-center mb-3">
                    <!--  OTP input -->
                    <input type="text" type="number" id="id-input-otp" name="otp" class="otp-input" required>

                </div>

                <!--  -->
                <div class="d-flex justify-content-center">
                    <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <button id="btn-verify-otp" class="btn btn-dark w-100 mb-5">កំណត់បញ្ជាក់លេខកូត</button>
            </form>
        </div>
    </div>
</div>

<link rel="stylesheet" href="{{ asset('assets/css/style_otp_page.css') }}">
<script src="{{ asset('assets/toasts/toast.js') }}"></script>
<script src="{{ asset('assets/js/otp_page.js') }}"></script>

@endsection