<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" sizes="50x50" href="{{ asset('assets/images/24h.png') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>SAFE 24H</title>

    <!-- Include CSS -->
    <link rel="stylesheet" href="{{ asset('assets/lib/bootstrap.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('assets/lib/datatables.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/jquery-confirm.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/toastr.min.css') }}">

    <link rel="stylesheet" href="{{ asset('assets/css/style_main.css') }}">

    <script src="{{ asset('assets/lib/jquery.min.js') }}"></script>

</head>

<body>

    @yield('content')

    <!-- Include Toast -->
    <script src="{{ asset('assets/toasts/toast.js') }}"></script>
    <script src="{{ asset('assets/lib/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/lib/datatables.min.js') }}"></script>
    <script src="{{ asset('assets/lib/jquery-confirm.min.js') }}"></script>
    <script src="{{ asset('assets/lib/toastr.min.js') }}"></script>

    <script src="{{ asset('assets/js/close_devtoolsOpened.js') }}"></script>
</body>

</html>