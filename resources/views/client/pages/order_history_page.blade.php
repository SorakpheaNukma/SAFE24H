@extends('client.layouts.app')

@section('content')

<div class="container my-5">
    <!-- Back Button -->
    <div class="container d-flex align-items-center mb-3">
        <div class="d-flex justify-content-center align-items-center rounded-circle"
            style="width: 40px; height: 40px; background-color: #F3F3F3;">
            <a href="/profile-page" class="text-blue text-decoration-none">
                <i class="fa-solid fa-arrow-left fa-lg"></i>
            </a>
        </div>
        <span class="text" style="font-size: 16px;">ត្រឡប់ក្រោយ</span>
    </div>

    <!-- Tabs for Order Status -->
    <ul class="nav nav-tabs justify-content-center mb-4" role="tablist">
        <li class="nav-item position-relative">
            <span id="badge-processing" class="d-none custom-badge position-absolute badge rounded-pill"
                style="background-color: blue; color: white; transform: translate(100%, -50%); z-index: 1;">2</span>
            <a class="nav-link active" data-toggle="tab" href="#processing-orders" role="tab">កំពុងធ្វើការរៀបចំ</a>
        </li>
        <li class="nav-item position-relative">
            <span id="badge-shipped" class="d-none custom-badge position-absolute badge rounded-pill"
                style="background-color: blue; color: white; transform: translate(100%, -50%); z-index: 1;">5</span>
            <a class="nav-link" data-toggle="tab" href="#shipped-orders" role="tab">កំពុងធ្វើការដឹកជញ្ជូន</a>
        </li>
        <li class="nav-item position-relative">
            <a class="nav-link" data-toggle="tab" href="#received-orders" role="tab">បានទទួលជោគជ័យ</a>
        </li>
    </ul>


    <!-- Tab Content -->
    <div class="tab-content">
        <!-- Processing Orders -->
        <div class="tab-pane fade show active" id="processing-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>

        <!-- Shipped Orders -->
        <div class="tab-pane fade" id="shipped-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>

        <!-- Received Orders -->
        <div class="tab-pane fade" id="received-orders" role="tabpanel">
            <!-- Order cards will be appended here -->
        </div>
    </div>
</div>

<!-- 🌟 Modal Đánh Giá -->
<!-- Nhớ để thêm meta csrf-token vào <head> -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ratingModalLabel">បញ្ចេញមតិ និងអត្រា</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="ratingForm">
          <input type="hidden" name="_token" id="csrf_token" value="">
          <div id="ratingFormContainer" style="max-height: 400px; overflow-y: auto;">
            <!-- JS sẽ tạo các khối đánh giá tại đây -->
          </div>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-primary">យល់ព្រម</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>


<meta name="csrf-token" content="{{ csrf_token() }}">

<link rel="stylesheet" href="{{asset('assets/css/order_history_page.css')}}" />
<script src="{{ asset('assets/js/order_history_page.js') }}"></script>

@endsection