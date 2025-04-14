@extends('commons.layouts.app')

@section('content')
{{-- <style>
    .custom-loading-overlay {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 9999;
        display: none;
    }

    .my-hidden {
        display: none;
    }
</style> --}}
{{--
<!-- -->
<div id="spinnerID" class="my-hidden">
    <div id="loadingOverlay" class="custom-loading-overlay d-flex justify-content-center align-items-center">
        <div id="loading_indicator" class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</div>
<!-- --> --}}

<!-- -->
<div id="pageContent">
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; object-fit: fill;">
        </div>

        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <h1 class="mx-2">Welcome to SkinCare</h1>
            <p class="mx-2">Your journey to better skin starts here.</p>
            <a href="/login" class="btn btn-dark mt-2 mx-2 styleBtn">Login</a>
            <a href="/sign-up" class="btn btn-dark  mt-2 mx-2 styleBtn">Sign Up</a>
        </div>
    </div>
</div>

@endsection