@extends('commons.layouts.app')

@section('content')
<div>
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; object-fit: fill;">
        </div>

        {{-- @if($errors->any())
        <script>
            $(document).ready(function () {
                showError('{{ $errors->first() }}'); 
            });
        </script>
        @endif --}}

        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <h1 class="mx-2">បង្កើតគណនីថ្មី</h1>
            <p class="mx-2">សូមធ្វើការបញ្ចូលព័ត៍មានរបស់អ្នកខាងក្រោមនេះ!</p>

            <form class="w-75 mx-2">

                <div class="form-group mb-3">
                    <label for="username" class="form-label">ឈ្មោះ</label>
                    <input type="text" id="username" name="username" class="form-control"
                        placeholder="សូមបំពេញឈ្មោះរបស់អ្នក" required>
                </div>

                <div class="form-group mb-3">
                    <label for="email" class="form-label">អ៊ីម៉ែល</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="សូមបំពេញអ៊ីម៉ែលរបស់អ្នក"
                        required>
                </div>

                <div class="form-group mb-3">
                    <label for="phone" class="form-label">លេខ​ទូរស័ព្ទ</label>
                    <input type="tel" id="phone" name="phone" class="form-control" placeholder="សូមបំពេញលេខ​ទូរស័ព្ទរបស់អ្នក"
                        required>
                </div>

                <div class="form-group mb-3">
                    <label for="password" class="form-label">លេខសម្ងាត់</label>
                    <input type="password" id="password" name="password" class="form-control"
                        placeholder="សូមបំពេញលេខសម្ងាត់របស់អ្នក" required>
                </div>

                <div class="form-group mb-3">
                    <label for="ConfirmPassword" class="form-label">បញ្ជាក់លេខសម្ងាត់</label>
                    <input type="password" id="ConfirmPassword" name="password_confirmation" class="form-control"
                        placeholder="សូមបំពេញលេខសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់" required>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <button id="signupButton" type="button" class="btn btn-dark w-100 mb-3">បង្កើតគណនី</button>
                <script>
                    // Lắng nghe sự kiện khi nhấn phím
                    document.addEventListener('keydown', function(event) {
                        // Kiểm tra nếu phím Enter được nhấn
                        if (event.key === 'Enter') {
                            // Thực hiện hành động khi nhấn Enter (giả sử là login)
                            document.getElementById('signupButton').click();
                        }
                    });
                </script>

                <!-- login Up Link -->
                <div class="text-center">
                    <p>លោកអ្នកមានគណនីរួចហើយមែនទេ?
                        <a href="/login" class="text-decoration-none text-dark fw-bold mb-5">ចូលគណនី</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/sign_up.js') }}"></script>
@endsection