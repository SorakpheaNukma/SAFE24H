<nav class="navbar navbar-expand-lg navbar-light my-Bg">
    
    <div class="container">
        <!-- Logo -->
        <div class="logo_container">
            <a href="/home-page">
                <img src="assets/images/Ellipse_3.png" alt="">
            </a>
        </div>
        <a class="navbar-brand fs-2 fw-bold" href="/home-page">SAFE 24H</a>

        <!--  Button for Sidebar -->
        <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- SideBar -->
        <div class="sidebar offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
            <!-- SideBar Header -->
            <div class="offcanvas-header border-bottom">
                <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <!-- SideBar Body -->
            <div class="offcanvas-body sidebar-content p-0 p-lg-0">
                <!-- Box with text and search bar -->
                <div class="search-container d-flex align-items-center">
                <button id="id_location" class="mx-2"
                        style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 10px; border-radius: 10px; background-color: #F3F3F3; border: none; cursor: pointer;">
                    ដឹកជញ្ជូនទៅដល់ ..............
                </button>



                    <div class="input-group">
                            <select class=" form-select" id="categoryDropdown">
                        </select>
                        <input type="text" class="form-control" placeholder="ស្វែងរក...">
                        <button id="id-btn-search" class="btn btn-primary" type="button">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                </div>



                <div class="d-flex align-items-center">
                    <!-- -->
                    <div id="id-cart" class="d-flex align-items-center position-relative" style="cursor: pointer;">
                        <a class="text-dark mx-2 position-relative">
                            <i class="fa-solid fa-cart-shopping fs-4"></i>

                            <span id="idBadges"
                                class="d-none custom-badge position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                style="background-color: blue; color: white;"></span>
                        </a>
                        {{-- <div class="cart-info d-flex flex-column ms-2 fw-bold">
                            <p class="text-nowrap mb-0">My Cart</p>
                            <p class="mb-0 total">$0</p>
                        </div> --}}
                    </div>


                    <!-- Profile Section -->
                    <div id="profile" class="ms-2 nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img id="profile_nav_bar" class="rounded-circle me-lg-2" 
                            src="{{ Auth::check() && Auth::user()->user_profile 
                                ? asset(Auth::user()->user_profile) 
                                : asset('assets/images/profile.png') }}" 
                            alt="Profile Picture" style="width: 40px; height: 40px;">

                            <span id="id-username" class="d-none d-lg-inline-flex"></span>
                            <i id="dropdown-icon" class="fas fa-chevron-down ms-2"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom">
                            <a id="id-profile" class="dropdown-item">ព័ត៌មានរបស់អ្នក</a>
                            <a id="id-logout" id="id-logout" class="dropdown-item">ចាកចេញ</a>
                        </div>
                    </div>

                    <!-- Login/Sign Up Section -->
                    <div id="auth-buttons" class="ms-2 d-flex d-none">
                        <a href="/login" class="btn btn-outline-primary me-2">Đăng nhập</a>
                        <a href="/sign-up" class="btn btn-outline-secondary">Đăng ký</a>
                    </div>


                </div>
            </div>

        </div>
    </div>
    </div>
</nav>
<!-- -->
