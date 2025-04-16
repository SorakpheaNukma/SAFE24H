@extends('client.layouts.app')
<meta name="address" content="{{ Auth::user()->address }}">
<meta name="country" content="{{ Auth::user()->country }}">

@section('content')
@include('client.layouts.nav_bar')

<div class="container">
    <div class="container_back" style="display: flex; align-items: center; padding-left: 12px; gap: 8px;">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="{{ url()->previous() }}" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>

    <div class="row ms-1">
        <div class="col-sm-12 col-md-6 mt-4">
            <div class="col-12" style="background-color: #F3F3F3;">
                <h4 class="ms-2">ទំនាក់ទំនង</h4>
            </div>

            <div class="container">
                <div class="row d-flex">
                    <div class="col-12 col-md-6">
                        <h5>ឈ្មោះ:</h5>
                    </div>
                    <div class="col-12 col-md-6 text-md-end">
                        <h5>{{ Auth::user()->username }}</h5>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row d-flex">
                    <div class="col-12 col-md-6">
                        <h5>លេខទូរស័ព្ទ:</h5>
                    </div>
                    <div class="col-12 col-md-6 text-md-end">
                        <h5>{{ Auth::user()->phone_number }}</h5>
                    </div>
                </div>
            </div>

            <div class="col-12" style="background-color: #F3F3F3;">
                <h4 class="ms-2">អាស័យដ្ឋាន</h4>
            </div>

            <div>
                <div class="col-12 mt-2 d-flex align-items-center">
                    <label class="fs-5 me-2 mb-0" for="country" >ខេត្ត/រាជធានី</label>
                    <select class="form-control" id="country" style="width: 377px; height: auto;">
                    <option value="">-- ជ្រើសរើសខេត្ត --</option>
                        <option value="ភ្នំពេញ">ភ្នំពេញ</option>
                        <option value="កណ្ដាល">កណ្ដាល</option>
                        <option value="តាកែវ">តាកែវ</option>
                        <option value="កំពត">កំពត</option>
                        <option value="កែប">កែប</option>
                        <option value="ព្រះសីហនុ">ព្រះសីហនុ</option>
                        <option value="កោះកុង">កោះកុង</option>
                        <option value="កំពុងស្ពឺ">កំពង់ស្ពឺ</option>
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


                <div class="col-11 mt-2">
                    <label  style="font-size: 18px;" for="more-address">
                        បន្ថែមព័ត៌មាន
                        <span style="font-size: 0.8em;">(ទីតាំងជាក់លាក់......)</span>
                    </label>
                    <input id="more-address" type="text" placeholder="ឧទារហណ៍​៖ លេខផ្ទះ, ភូមិ ..........."
                        class="form-control" />
                </div>
            </div>

            <div class="col-12 mt-4 d-flex justify-content-end">
                <button id="saveAddressButton" class="btn btn-primary p-2 mb-1" style="width: 226;">យល់ព្រមរក្សាទុក</button>
            </div>
        </div>

        <!-- <div class="col-sm-12 col-md-6">
            <div class="container mt-2 mb-4">
                <h2>ផែនទី</h2>
                <div id="map-message" style="display: none;" class="alert alert-warning">
                    Map can't support your location due to low accuracy.
                </div>
                <iframe id="google-map-iframe" width="100%" height="400" frameborder="0" marginheight="0"
                    marginwidth="0" scrolling="yes"
                    src="https://maps.google.com/maps?q=0,0&hl=en-US&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
            </div>
        </div> -->
    </div>
</div>

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/address_page.js') }}"></script>

@endsection