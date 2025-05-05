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
<div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ratingModalLabel">បញ្ចេញមតិ និងអត្រា</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="ratingForm">
          @csrf
          <div class="mb-3">
            <label for="rating" class="form-label">អត្រា (1-5)</label>
            <select class="form-select" id="rating" required>
              <option value="">ជ្រើសរើស</option>
              <option value="1">1 - អន់</option>
              <option value="2">2 - មធ្យម</option>
              <option value="3">3 - ល្អ</option>
              <option value="4">4 - ល្អណាស់</option>
              <option value="5">5 - ល្អបំផុត</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="comment" class="form-label">មតិ</label>
            <textarea class="form-control" id="comment" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">ដាក់ស្នើ</button>
        </form>
      </div>
    </div>
  </div>
</div>

<link rel="stylesheet" href="{{asset('assets/css/order_history_page.css')}}" />
<script src="{{ asset('assets/js/order_history_page.js') }}"></script>

@endsection