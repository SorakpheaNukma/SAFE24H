@extends('client.layouts.app')
<meta name="user_id" content="{{ Auth::user()->user_id }}">

@section('content')
    @include('client.layouts.nav_bar')

    <main id="main-content" class="mx-3 mb-3">
        <!-- Back Button -->
        <div class="container_back" style="display: flex; align-items: center; padding-left: 12px; gap: 8px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a onclick="goBackHome()" style="cursor: pointer" class="text-blue text-decoration-none d-flex align-items-center justify-content-center">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>

        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>
    <script>
        function goBackHome() {
            window.history.back();
        }
    </script>
        <!-- 1: Address Information -->
        <div class="container">
            <div class="row">
                <div class="col-12 d-flex flex-md-row flex-column justify-content-md-between">
                    <h6 class="fw-bold">ព័ត៌មានទីតាំងទំនាក់ទំនង</h6>
                    <h6 id="id-change-address" class="text-primary" style = color:blue>កែសម្រួល</h6>
                </div>
                <div class="col-md-12 col-10 mt-2">
                    <div class="container">
                        <p class="fw-semibold mb-1"> {{ Auth::user()->username }}</p>
                        <p class="mb-1"> {{ Auth::user()->phone_number }}</p>

                        @if (Auth::user()->address && Auth::user()->country)
                            <p class="mb-0"> {{ Auth::user()->address }}, {{ Auth::user()->country }}</p>
                        @else
                            <p class="mb-0"></p>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- 2: Product List -->
        <div class="container mt-2">
            <div class="row">
                <div class="col-12">
                    <h6 class="fw-bold">បញ្ជីទំនិញ</h6>
                </div>
                <div id="product-list" class="container mt-2"></div>

                <div id="order-total" class="col-12 d-flex flex-column flex-md-row justify-content-between mt-3">
                    <h6 class="fw-bold mb-2 mb-md-0">Order Total (0 Items):</h6>
                    <h6 class="fw-bold text-md-end">$0.00</h6>
                </div>
            </div>
        </div>

        <!-- 3: Payment Option -->
        <div class="container mt-2">
            <div class="row">
                <div class="col-12">
                    <h6 class="fw-bold">ជម្រើសការទូរទាត់ប្រាក់</h6>
                </div>
                <div class="mx-3 d-flex align-items-center">
                    <input id="id-payment-method" type="checkbox" style="width: 20px; height: 20px;"/>
                    <label for="id-payment-method" class="ms-2" style="font-size: 16px; margin-bottom: 0;">ទូរទាត់តាមរយៈអ្នកដឹកជញ្ជូន</label>
                </div>


            </div>
        </div>

        <!-- Payment Details -->
        <div class="container mt-2 p-3">
            <div class="row">
                <div class="col-12 mb-3">
                    <h6 class="fw-bold">បញ្ជាក់ការទូរទាត់ប្រាក់</h6>
                </div>
                <div class="col-12 p-3 text-black rounded" style="background-color: white;">
                    <div class="row mb-2">
                        <div class="col-6">ថ្លៃទំនិញ</div>
                        <div class="col-6 text-end" id="merchandise-total">$0.00</div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-6">ថ្លៃដឹកជញ្ជូន</div>
                        <div class="col-6 text-end" id="shipping-total"></div>
                    </div>
                    <hr class="my-2 text-white" />
                    <div class="row">
                        <div class="col-6 fw-bold">សរុបរួម</div>
                        <div class="col-6 text-end fw-bold" id="total-payment">$0.00</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 5: Final Payment -->
        <div class="container">
    <div class="row align-items-center">
        <!-- Tổng tiền -->
        <div class="col-6">
            <div class="d-flex justify-content-end align-items-center" style="color: blue;">
                <span class="fw-bold me-2" style="font-size: 24px;">សរុបការទូរទាត់រួមចំនួន:</span>
                <span id="final-total" class="fw-bold" style="font-size: 24px;">$0.00</span>
            </div>
        </div>

        <!-- Nút đặt hàng -->
        <div class="col-6 d-flex align-items-center">
            <button id="id-btn-order" class="btn btn-primary" style="width: 226px; height: 49px;">ទិញឥឡូវនេះ</button>
        </div>
    </div>
</div>
    </main>

    <script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
    <script src="{{ asset('assets/js/buy_now_page.js') }}"></script>
@endsection
