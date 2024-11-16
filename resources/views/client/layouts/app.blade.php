<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/png" sizes="50x50" href="{{ asset('assets/images/logo.png') }}">

    <title>SkinCare Shop</title>

    <!--images carousel -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Include CSS -->
    <link rel="stylesheet" href="{{ asset('assets/lib/bootstrap.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('assets/lib/datatables.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/jquery-confirm.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/lib/toastr.min.css') }}">


    <link rel="stylesheet" href="{{asset('assets/css/home_page.css')}}" />
    <link rel="stylesheet" href="{{asset('assets/css/detail_page.css')}}" />

    <script src="{{ asset('assets/lib/jquery.min.js') }}"></script>
</head>

<body>
    <!-- -->
    <div id="spinner"
        class="bg-ligth position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <!-- -->

    <main>
        @yield('content')
    </main>

    @include('client.layouts.footer')

    <!--  -->
    <script src="{{ asset('assets/lib/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/lib/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/lib/datatables.min.js') }}"></script>
    <script src="{{ asset('assets/lib/jquery-confirm.min.js') }}"></script>

    <script src="{{ asset('assets/lib/toastr.min.js') }}"></script>
    <!--custom toast-->
    <script src="{{ asset('assets/toasts/toast.js') }}"></script>

    <script src="{{ asset('assets/js/close_devtoolsOpened.js') }}"></script>
</body>

</html>
</body>

</html>