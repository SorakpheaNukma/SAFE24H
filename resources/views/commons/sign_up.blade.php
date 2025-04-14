@extends('commons.layouts.app')

@section('content')
<div>
    <div class="row g0" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
        <div class="col-md-6">
            <img id="welcomeImage" src="{{ asset('assets/images/24h.png') }}" alt="Welcome Image"
                style="width: 100%; object-fit: fill;">
        </div>

        {{-- @if($errors->any())
        <script>
            $(document).ready(function () {
                showError('{{ $errors->first() }}'); 
            });
        </script>
        @endif --}}

        <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start align-items-md-start">
            <h1 class="mx-2">Create New Account</h1>
            <p class="mx-2">Please enter your details below.</p>

            <form class="w-75 mx-2">

                <div class="form-group mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" name="username" class="form-control"
                        placeholder="Enter your username" required>
                </div>

                <div class="form-group mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email"
                        required>
                </div>

                <div class="form-group mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="tel" id="phone" name="phone" class="form-control" placeholder="Enter your phone number"
                        required>
                </div>

                <div class="form-group mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" name="password" class="form-control"
                        placeholder="Enter your password" required>
                </div>

                <div class="form-group mb-3">
                    <label for="ConfirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" id="ConfirmPassword" name="password_confirmation" class="form-control"
                        placeholder="Enter your Confirm Password" required>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="loadingSpinner" class="spinner-border" role="status" style="display: none;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <button id="signupButton" type="button" class="btn btn-dark w-100 mb-3">Sign Up</button>

                <!-- login Up Link -->
                <div class="text-center">
                    <p>already have an account?
                        <a href="/login" class="text-decoration-none text-dark fw-bold mb-5">Login</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="{{ asset('assets/js/sign_up.js') }}"></script>
@endsection