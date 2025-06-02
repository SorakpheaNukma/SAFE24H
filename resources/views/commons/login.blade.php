@extends('commons.layouts.app')

@section('content')
<div>
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 50%;">
        </div>

        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <h1 class="mx-2">សូមស្វាគមន៏ 👋</h1>
            <p class="mx-2">សូមធ្វើការបំពេញដើម្បីប្រើប្រាស់.</p>

            <form class="w-75 mx-2">

                <div class="form-group mb-3">
                    <label for="email" class="form-label">អ៊ីម៉ែល</label>
                    <input type="email" name="email" id="email" class="form-control" placeholder="សូមបញ្ចូលអ៊ីម៉ែល"
                        required>
                </div>

                <div class="form-group mb-3 position-relative">
                    <label for="password" class="form-label">លេខសម្ងាត់</label>
                    <div class="input-group">
                        <input type="password" name="password" id="password" class="form-control"
                            placeholder="សូមបញ្ចូលលេខសម្ងាត់" required>
                        <button type="button" class="btn btn-outline-secondary position-absolute end-0"
                            id="togglePassword" style="border: none;  z-index: 2;">
                            <i class="fa fa-eye-slash" id="toggleIcon"></i>
                        </button>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">

                    <div class="form-check">
                        <input type="checkbox" name="remember" id="remember" class="form-check-input">
                        <label for="remember" class="form-check-label">ចងចាំខ្ញុំ</label>
                    </div>

                    <div>
                        <a href="/forget" class="text-decoration-none text-dark fw-bold">ភ្លេចលេខសម្ងាត់?</a>
                    </div>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <button id="loginButton" type="button" class="btn btn-dark w-100 mb-3">ចូលគណនី</button>
                <script>
                    // Lắng nghe sự kiện khi nhấn phím
                    document.addEventListener('keydown', function(event) {
                        // Kiểm tra nếu phím Enter được nhấn
                        if (event.key === 'Enter') {
                            // Thực hiện hành động khi nhấn Enter (giả sử là login)
                            document.getElementById('loginButton').click();
                        }
                    });
                </script>

                <!-- -->
                <div class="text-center">
                    <p>អ្នកមិនទាន់មានគណនីមែនទេ?
                        <a href="/sign-up" class="text-decoration-none text-dark fw-bold mb-5">បង្កើតគណនី</a>
                    </p>
                </div>
            </form>

        </div>
    </div>
</div>

<script src="{{ asset('assets/js/login.js') }}"></script>
@endsection