<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!--here for pusher-->
    <meta name="pusher-key" content="{{ env('PUSHER_APP_KEY') }}">
    <meta name="pusher-cluster" content="{{ env('PUSHER_APP_CLUSTER') }}">
    <!--end of pusher-->

    <meta name="username" content="{{ Auth::user()->username }}">

    <link rel="icon" type="image/png" sizes="50x50" href="{{ asset('assets/images/logo.png') }}">
    <title>SkinCare Shop</title>

    <link rel="stylesheet" href="{{ asset('assets/lib/bootstrap.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('assets/lib/datatables.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/jquery-confirm.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/toastr.min.css') }}">

    <!---->
    <link rel="stylesheet" href="{{asset('assets/css/home_dashboard.css')}}" />
    <link rel="stylesheet" href="{{asset('assets/css/home_dashboard_2.css')}}" />
    <link rel="stylesheet" href="{{asset('assets/css/animation_slide.css')}}" />
    <!---->
</head>

<body>
    @yield('content')

    <script src="{{ asset('assets/lib/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/lib/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/lib/datatables.min.js') }}"></script>
    <script src="{{ asset('assets/lib/jquery-confirm.min.js') }}"></script>
    <script src="{{ asset('assets/lib/toastr.min.js') }}"></script>

    <script src="{{ asset('assets/toasts/toast.js') }}"></script>

    <script src="{{ asset('assets/js/dashboard_content.js') }}"></script>
    <script src="{{ asset('assets/js/home_dashboard.js') }}"></script>
    <script src="{{ asset('assets/js/home_dashboard_push_notify.js') }}"></script>
    {{-- <script src="{{ asset('assets/js/close_devtoolsOpened.js') }}"></script> --}}

    <!-- Include Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!--here for pusher-->
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
</body>

</html>
</body>

</html>