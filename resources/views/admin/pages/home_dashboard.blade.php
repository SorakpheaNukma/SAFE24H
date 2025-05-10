@extends('admin.layouts.app')

<meta name="csrf_token" content="{{ csrf_token() }}">
<meta name="service-worker-file-js" content="{{ URL::asset('service-worker.js') }}">
<meta name="public-key-push-notification" content="{{ env('PUSH_NOTIFICATION_PUBLIC_KEY') }}">

@section('content')
    <div class="container-fluid position-relative d-flex p-0">
        <!--spinner-->
        <div id="IDSpinner" class="my-hidden">
            <div
                class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <!--end of spinner-->


        <div id="idSideBar" class="sidebar pe-4 pb-3">
            <nav class="navbar navbar-dark">
                <a href="index.html" class="navbar-brand mx-4 mb-3">
                    <h3 class="text-primary"><i class="fa fa-user-edit me-2"></i>SAFE 24H</h3>
                </a>

                <button type="button" class="sidebar-toggler btn btn-link position-absolute top-0 end-0"
                    style="margin-top: 10px; margin-right: 10px;">
                    <i class="fa fa-times"></i>
                </button>

                <div class="d-flex align-items-center ms-4 mb-4">
                    <div class="position-relative">
                        <img class="rounded-circle" src="assets/images/profile.png" alt=""
                            style="width: 40px; height: 40px;">
                        <div
                            class="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1">
                        </div>
                    </div>
                    <div class="ms-3">
                        <!--<h6 id="id-username" class="mb-0"></h6>-->
                        <span>Admin</span>
                    </div>
                </div>
                <div class="navbar-nav w-100">
                    <a id="id_dashBoard" class="nav-item nav-link active"><i
                            class="fa fa-tachometer-alt me-2"></i>Dashboard</a>

                            <a id="id_product" class="nav-item nav-link position-relative">
                                <!-- Badge number -->
                                <span id="id-badge-product" class="d-none position-absolute start-100 badge rounded-pill bg-danger"
                                    style="transform: translate(-605%, -22%) !important;"></span>
                                <i class="fa fa-table me-2"></i>Product
                            </a>


                    <!-- <a id="id_user" class="nav-item nav-link">
                                                <i class="fa fa-user-friends me-2"></i>User</a> -->

                    <!--
                                            <a id="id_payment" class="nav-item nav-link">
                                                <i class="fa fa-money-check-alt me-2"></i>Payment</a>-->

                    <a id="id_order" class="nav-item nav-link">
                        <!-- Badge number -->
                        <span id="id-badge-order" class="d-none position-absolute start-100 badge rounded-pill bg-danger"
                            style="transform: translate(-605%, -22%) !important;"></span>
                        <i class="fa fa-shopping-cart me-2"></i>Order
                    </a>
                    <a id="banner-images-edit" class="nav-item nav-link"><i class="fa fa-table me-2"></i>
                        Edit Banner
                    </a>
                </div>
            </nav>
        </div>


        <div class="content">

            <nav class="navbar navbar-expand navbar-dark px-4 py-0">
                <a href="index.html" class="navbar-brand d-flex d-lg-none me-4">
                    <h2 class="text-primary mb-0"><i class="fa fa-user-edit"></i></h2>
                </a>
                <a href="#" class="sidebar-toggler flex-shrink-0">
                    <i class="fa fa-bars"></i>
                </a>
                <div class="navbar-nav align-items-center ms-auto">
                    <!-- Button to Enable Notifications on Browser -->
                    <button id="btn-enable-notification"
                        class="btn btn-primary shadow-sm rounded-pill d-flex align-items-center px-2 py-1 px-lg-3 py-lg-2">
                        <i class="fa fa-bell me-0 me-md-2 me-lg-2"></i>
                        <span class="d-none d-md-inline">Enable Notifications</span>
                    </button>

                    <!-- Button for Refresh -->
                    <button id="btn-refresh"
                        class="btn btn-primary shadow-sm rounded-pill d-flex align-items-center ms-2 px-2 py-1 px-lg-3 py-lg-2">
                        <i class="fa fa-refresh"></i>
                    </button>

                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <img class="rounded-circle me-lg-1" src="assets/images/profile.png" alt=""
                                style="width: 40px; height: 40px;">
                            <span id="id-username" class="d-none d-lg-inline-flex"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
                            <a id="" class="dropdown-item">My Profile</a>
                            {{-- <a class="dropdown-item">Settings</a> --}}
                            <a id="id-logout" class="dropdown-item">Log Out</a>
                        </div>
                    </div>
                </div>
            </nav>
            <!-- -->


            <div class="container-fluid" id="different-content">
                <div id="dashboard-content" style="display: block;">
                    <div id="id-conent-dashboard"></div>
                </div>


                <div id="product-content" style="display: none;">
                    <div class="d-flex">
                        <button id="addProductButton" class="btn btn-primary mb-2">
                            Add New Product
                            <i class="ms-2 fa-solid fa-plus"></i>
                        </button>

                        <button id="addCategory" class="btn btn-secondary mb-2 mx-2">
                            Add Category
                            <i class="fa fa-plus-circle ml-2"></i>
                        </button>
                    </div>

                    <div id="table_product">
                    </div>
                </div>

                <div id="product-images-content" class="mt-3" style="display: none;">
                    <div id="table_product_imgs">

                    </div>
                </div>

                <div id="product-description1-tb" class="mt-3" style="display: none;">
                </div>
                <div id="product-description2-tb" class="mt-3" style="display: none;">
                </div>

                <!--Order content -->
                <div id="id-content-order" class="mt-3" style="display: none;"></div>

                <!-- Banner Content -->
                <div id="id-banner-content" style="display: none;"></div>
            </div>
        </div>

    </div>
    
@endsection
