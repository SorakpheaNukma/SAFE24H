@extends('client.layouts.app')

@section('content')
@include('client.layouts.nav_bar')

<h5 id="id-title-header" class="mx-3 mt-3 fw-bold"></h5>

<main class="mx-3 mb-3">
    <div class="row" id="gridContainer"></div>
    <div class="d-flex justify-content-center">
        <button id="viewMore" class="btn btn-primary mx-3 mt-3" style="display: none">View More</button>
    </div>
</main>

<script src="{{ asset('assets/js/home.js') }}"></script>
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>

@endsection