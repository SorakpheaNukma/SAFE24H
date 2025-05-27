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
<!-- Modal Đánh Giá -->
<div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" style="max-height: 80vh; overflow-y: auto;">
    <div class="modal-content">
      <form id="ratingForm">
        <input type="hidden" id="csrf_token" name="_token" value="{{ csrf_token() }}">

        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="ratingModalLabel">📝 វាយតម្លៃផលិតផល</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body" id="ratingFormContainer">
          <!-- Nội dung các sản phẩm sẽ được inject bằng JS -->
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">ដាក់ស្នើការវាយតម្លៃ</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">បោះបង់</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal sửa đơn hàng -->
<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <form id="editOrderForm" class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">កែសម្រួលការបញ្ជាទិញ</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body" id="editFormContainer">
        <!-- JS sẽ render các item ở đây -->
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">រក្សាទុក</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">បោះបង់</button>
      </div>
    </form>
  </div>
</div>





<meta name="csrf-token" content="{{ csrf_token() }}">

<link rel="stylesheet" href="{{asset('assets/css/order_history_page.css')}}" />
<script src="{{ asset('assets/js/order_history_page.js') }}"></script>
<!-- SweetAlert2 CSS & JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

@endsection