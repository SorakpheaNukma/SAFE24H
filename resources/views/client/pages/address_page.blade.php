@extends('client.layouts.app')

<meta name="address" content="{{ Auth::user()->address }}">
<meta name="country" content="{{ Auth::user()->country }}">

@section('content')
@include('client.layouts.nav_bar')

<div class="container mt-3" style="font-family: 'KhmerOS', sans-serif;">
    <!-- Nút trở lại -->
    <div class="d-flex align-items-center mb-3 gap-2 ps-2">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
             style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="{{ url()->previous() }}" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-5">ត្រឡប់ក្រោយ</span>
    </div>

    <!-- Thông tin người dùng -->
    <div class="row">
        <div class="col-sm-12 col-md-6">
            <!-- Phần: ទំនាក់ទំនង -->
            <div class="bg-light p-2 rounded">
                <h4 class="mb-3" style="font-weight: bold;">ទំនាក់ទំនង</h4>

                <div class="d-flex justify-content-between mb-2">
                    <h5>ឈ្មោះ:</h5>
                    <h5  style="font-weight: bold; text-decoration: underline;"">{{ Auth::user()->username }}</h5>
                </div>

                <div class="d-flex justify-content-between mb-3">
                    <h5>លេខទូរស័ព្ទ:</h5>
                    <h5>{{ Auth::user()->phone_number }}</h5>
                </div>
            </div>

            <!-- Phần: អាស័យដ្ឋាន -->
            <div class="bg-light p-2 rounded mt-4">
                <h4 class="mb-3" style="font-weight: bold;">អាស័យដ្ឋាន</h4>

                <!-- Chọn tỉnh/thành -->
                <div class="mb-3">
                    <label class="form-label fs-5" for="country">ខេត្ត/រាជធានី</label>
                    <select class="form-control" id="country">
                        <option value="">-- ជ្រើសរើសខេត្ត --</option>
                        <option value="ភ្នំពេញ">ភ្នំពេញ</option>
                        <option value="កណ្ដាល">កណ្ដាល</option>
                        <option value="តាកែវ">តាកែវ</option>
                        <option value="កំពត">កំពត</option>
                        <option value="កែប">កែប</option>
                        <option value="ព្រះសីហនុ">ព្រះសីហនុ</option>
                        <option value="កោះកុង">កោះកុង</option>
                        <option value="កំពុងស្ពឺ">កំពុងស្ពឺ</option>
                        <option value="កំពង់ឆ្នាំង">កំពង់ឆ្នាំង</option>
                        <option value="កំពង់ធំ">កំពង់ធំ</option>
                        <option value="កំពង់ចាម">កំពង់ចាម</option>
                        <option value="ត្បូងឃ្មុំ">ត្បូងឃ្មុំ</option>
                        <option value="ព្រៃវែង">ព្រៃវែង</option>
                        <option value="ស្វាយរៀង">ស្វាយរៀង</option>
                        <option value="បាត់ដំបង">បាត់ដំបង</option>
                        <option value="បន្ទាយមានជ័យ">បន្ទាយមានជ័យ</option>
                        <option value="ប៉ៃលិន">ប៉ៃលិន</option>
                        <option value="សៀមរាប">សៀមរាប</option>
                        <option value="ឧត្តរមានជ័យ">ឧត្តរមានជ័យ</option>
                        <option value="ព្រះវិហារ">ព្រះវិហារ</option>
                        <option value="ស្ទឹងត្រែង">ស្ទឹងត្រែង</option>
                        <option value="ក្រចេះ">ក្រចេះ</option>
                        <option value="មណ្ឌលគីរី">មណ្ឌលគីរី</option>
                        <option value="រតនគីរី">រតនគីរី</option>
                        <option value="ពោធិ៍សាត់">ពោធិ៍សាត់</option>
                    </select>
                </div>
                <p id="shippingCost" class="fs-5 text-primary mt-3"></p>

                <!-- Địa chỉ chi tiết -->
                <div class="mb-3">
                    <label class="form-label fs-5" for="more-address">
                        បន្ថែមព័ត៌មាន <span class="fs-6">(ទីតាំងជាក់លាក់......)</span>
                    </label>
                    <input id="more-address" type="text" placeholder="ឧទាហរណ៍៖ លេខផ្ទះ, ភូមិ ..........."
                           class="form-control" />
                </div>

                <!-- Nút lưu -->
                <div class="d-flex justify-content-end">
                    <button id="saveAddressButton" class="btn btn-primary px-4 py-2">
                        យល់ព្រមរក្សាទុក
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts và CSS -->
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/address_page.js') }}"></script>
<link rel="stylesheet" href="{{ asset('assets/css/address_page.css') }}">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- Font Khmer OS nếu bạn đã chèn file KhmerOS.ttf -->
<style>
@font-face {
    font-family: 'KhmerOS';
    src: url('{{ asset('assets/fonts/KhmerOS.ttf') }}') format('truetype');
}
</style>
@endsection
