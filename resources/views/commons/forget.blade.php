@extends('commons.layouts.app')

@section('content')
<div>
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <!-- Image Section -->
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; object-fit: fill;">
        </div>

        <!-- Forgot Password Section -->
        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <!-- Back Arrow and Text -->
            <div class="d-flex align-items-start mx-2 mb-3 w-75"> <a href="{{ url()->previous() }}"
                    class="text-decoration-none text-dark">
                    <i class="fa-solid fa-circle-arrow-left fa-lg"></i> Back
                </a>
            </div>

            <h1 class="mb-2 mx-2">ភ្លេចលេខសម្ងាត់</h1>
            <p class="w-75 mx-lg-2 text-lg-start text-center">សូមបញ្ចូលអ៊ីម៉ែលរបស់អ្នកដើម្បីទទួលបានលេខកូតសម្រាប់
                កំណត់លេខសម្ងាត់ថ្មី</p>
            </p>

            <!-- Email and Send OTP Button -->
            <form class="w-75 mx-2">

                <div class="form-group mb-3">
                    <label for="email" class="form-label">អ៊ីម៉ែល</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="សូមបំពេញអ៊ីម៉ែលរបស់អ្នក"
                        required>
                </div>

                <!-- Send OTP Button -->
                <div>
                    <div class="d-flex justify-content-center">
                        <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <button id="id-btn-otp" class="btn btn-dark w-100 mb-5 fw-bold">ទទួលលេខកូត</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="{{ asset('assets/toasts/toast.js') }}"></script>
<script src="{{ asset('assets/js/forget_page.js') }}"></script>

@endsection