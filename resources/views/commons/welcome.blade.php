@extends('commons.layouts.app')

@section('content')

<!-- -->
<div id="pageContent">
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;">
        </div>

        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <h1 class="mx-2">​សួស្ដីមកកាន់ SAFE 24H </h1>
            <p class="mx-2">រីករាយជាមួយការទិញទំនិញនៅទីនេះ​​ </p>
            <a href="/login" class="btn btn-dark mt-2 mx-2 styleBtn">ចូលគណនី</a>
            <a href="/sign-up" class="btn btn-dark  mt-2 mx-2 styleBtn">បង្កើតគណនី</a>
        </div>
    </div>
</div>

@endsection