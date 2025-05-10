@extends('commons.layouts.app')

@section('content')
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header text-center">
                    <h3>ដាក់លេខសម្ងាត់ថ្មី</h3>
                </div>
                <div class="card-body">
                    <form>
                        <div class="mb-3">
                            <label for="new-password" class="form-label">លេខសម្ងាត់ថ្មី</label>
                            <input type="password" class="form-control" id="new-password" name="new-password" required>
                        </div>

                        <div class="mb-3">
                            <label for="confirm-password" class="form-label">បញ្ជាក់លេខសម្ងាត់</label>
                            <input type="password" class="form-control" id="confirm-password" name="confirm-password"
                                required>
                        </div>

                        <div class="d-flex justify-content-center mb-3">
                            <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <button id="btn-reset-pass" class="btn btn-dark w-100">បញ្ជាក់ឥឡូវនេះ</button>
                    </form>
                </div>
                <div class="card-footer text-center">
                    <p class="mb-0">ចងចាំលេខសម្ងាត់ដើម្បីចូលប្រើប្រាស់ពេលក្រោយ?</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/reset_password.js') }}"></script>
@endsection