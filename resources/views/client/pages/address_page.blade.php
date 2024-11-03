@extends('client.layouts.app')
<meta name="address" content="{{ Auth::user()->address }}">
<meta name="country" content="{{ Auth::user()->country }}">

@section('content')
@include('client.layouts.nav_bar')

<div class="container">
    <div class="container-fluid d-flex mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="{{ url()->previous() }}" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="fs-4 ms-2">Address Page</span>
    </div>

    <div class="row ms-1">
        <div class="col-sm-12 col-md-6 mt-4">
            <div class="col-12" style="background-color: #F3F3F3;">
                <h4 class="ms-2">Contact</h4>
            </div>

            <div class="container">
                <div class="row d-flex">
                    <div class="col-12 col-md-6">
                        <h5>Name:</h5>
                    </div>
                    <div class="col-12 col-md-6 text-md-end">
                        <h5>{{ Auth::user()->username }}</h5>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row d-flex">
                    <div class="col-12 col-md-6">
                        <h5>Phone Number:</h5>
                    </div>
                    <div class="col-12 col-md-6 text-md-end">
                        <h5>{{ Auth::user()->phone_number }}</h5>
                    </div>
                </div>
            </div>

            <div class="col-12" style="background-color: #F3F3F3;">
                <h4 class="ms-2">Address</h4>
            </div>

            <div>
                <div class="col-12 mt-2">
                    <label class="fs-5" for="country">Country</label>
                    <select class="form-control" id="country">
                        <option value="Cambodia">Cambodia</option>
                        <option value="VietNam">VietNam</option>
                        <option value="Thai">Thai</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <!-- Add more country options here -->
                    </select>
                </div>

                <div class="col-12 mt-2">
                    <label class="fs-5" for="more-address">
                        More About Address
                        <span style="font-size: 0.8em;">(example: Banteay Meanchey province, Poipet...)</span>
                    </label>
                    <input id="more-address" type="text" placeholder="ex.pp,Stueng Mean Chey,...."
                        class="form-control" />
                </div>
            </div>

            <div class="col-12 mt-4">
                <button id="saveAddressButton" class="btn btn-primary p-2 mb-1" style="width: 100%;">Save
                    Address</button>
            </div>
        </div>

        <div class="col-sm-12 col-md-6">
            <div class="container mt-2 mb-4">
                <h2>Map</h2>
                <div id="map-message" style="display: none;" class="alert alert-warning">
                    Map can't support your location due to low accuracy.
                </div>
                <iframe id="google-map-iframe" width="100%" height="400" frameborder="0" marginheight="0"
                    marginwidth="0" scrolling="yes"
                    src="https://maps.google.com/maps?q=0,0&hl=en-US&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>
<script src="{{ asset('assets/js/address_page.js') }}"></script>

@endsection