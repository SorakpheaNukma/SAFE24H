@extends('client.layouts.app')

@section('content')
@include('client.layouts.nav_bar')

<div class="mx-3 mb-3">
    <!-- Gallery Section -->
    <div id="gallery" class="gallery-container">
        <!-- Gallery images will be inserted here by JavaScript -->
    </div>
</div>

<h5 id="id-title-header" class="mx-3 mt-3 fw-bold"></h5>

<main class="mx-5 mb-3">
    <div class="row" id="gridContainer"></div>
</main>

<script src="{{ asset('assets/js/home.js') }}"></script>
<script src="{{ asset('assets/js/nav_bar_global.js') }}"></script>


@endsection