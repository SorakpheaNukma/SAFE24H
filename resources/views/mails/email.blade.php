<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>

    <!--  -->
    <link rel="stylesheet" href="{{ asset('assets/lib/bootstrap.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('assets/lib/datatables.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/jquery-confirm.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/toastr.min.css') }}">

    <script src="{{ asset('assets/lib/jquery.min.js') }}"></script>
</head>

<body style="background-color: #f4f4f4; padding: 20px;">

    <div class="container">
        <div class="card shadow" style="max-width: 600px; margin: auto;">
            <div class="card-header text-center bg-primary text-white">
                <h2>Your OTP Code</h2>
            </div>
            <div class="card-body text-center">
                <p class="lead">Use the OTP code below to complete your verification process.</p>

                <div class="alert alert-info" style="font-size: 24px; font-weight: bold;">
                    {{ $otp }}
                </div>

            </div>
            <div class="card-footer text-center">
                <p class="text-muted">Thank you for using our service.</p>
            </div>
        </div>
    </div>

</body>

<script src="{{ asset('assets/lib/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('assets/lib/datatables.min.js') }}"></script>
<script src="{{ asset('assets/lib/jquery-confirm.min.js') }}"></script>
<script src="{{ asset('assets/lib/toastr.min.js') }}"></script>

<script src="{{ asset('assets/toasts/toast.js') }}"></script>
<script src="{{ asset('assets/lib/jquery.min.js') }}"></script>

</html>