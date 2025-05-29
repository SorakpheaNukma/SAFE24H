<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Home_dashBoard;
use App\Http\Controllers\PushNotificationBrowserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\SignUpController;
use App\Http\Controllers\ForgetController;
use App\Http\Controllers\OTPController;
use App\Http\Controllers\BannerImageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\EventController;







Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login');

Route::get('/sign-up', [SignUpController::class, 'showSignUpForm'])->name('signup');
route::post('/sign-up', [SignUpController::class, 'signUp'])->name('signup');

//
Route::get('/forget', [ForgetController::class, 'showForgetForm'])->name('forget');
Route::get('/otp-page', [OTPController::class, 'showOTPForm'])->name('otp-page');
Route::get('/reset-password-page', function () {
    return view('commons.reset_pass_page');
});

Route::post('/send-otp', [OTPController::class, 'sendOtp']);
Route::post('/verify-otp', [OTPController::class, 'verifyOTP']);
Route::post('/reset-password', [LoginController::class, 'resetPassword']);

Route::get('/token-validity', [LoginController::class, 'tokenExpiry']);


Route::middleware('MyMiddlewareNavigation')->group(function () {
    Route::get('/', function () {
        return view('commons.welcome');
    })->name('commons.welcome');
});

//can be use all of this if already logged in (auth)
Route::middleware('MyMiddleWareAuth')->group(function () {
    //Banner Image
    Route::get('/banner-images', [BannerImageController::class, 'getAllBannerImages']);
    Route::post('/update-info', [ProfileController::class, 'updateInfo'])->middleware('MyUserMiddleWare');
    Route::get('/user-info', [ProfileController::class, 'getUserInfo']);
    Route::post('/add-banner-images', [BannerImageController::class, 'createBannerImage']);
    Route::delete('/delete-banner/{id}', [BannerImageController::class, 'clear']);

    //comment and rate
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');



    //Product
    Route::get('/getAllProducts', [ProductController::class, 'getAll']);
    Route::get('/products-recommendations', [ProductController::class, 'getRecommendedProducts']);
    Route::get('/getAllCategory', [CategoryController::class, 'getAllCategory']);
    Route::post('/add-category', [CategoryController::class, 'createCategory']);
    Route::put('/edit-category', [CategoryController::class, 'updateCategory']);
    Route::delete('/delete-category', [CategoryController::class, 'deleteCategory']);
    Route::delete('/delete-banner/{id}', [BannerImageController::class, 'clear']);
    Route::post('/add-banner-images', [BannerImageController::class, 'createBannerImage']);
    Route::post('/add-product', [ProductController::class, 'addProduct']);
    Route::put('/edit-product', [ProductController::class, 'updateProduct']);
    Route::delete('/delete-product', [ProductController::class, 'deleteProduct']);
    Route::post('/add-product-img', [ProductController::class, 'addImageProduct']);
    Route::post('/edit-product-img', [ProductController::class, 'updateImgProduct']);
    Route::delete('/delete-product-img', [ProductController::class, 'deleteProductImg']);
    Route::get('/logout', [LoginController::class, 'logout']);

    Route::get('/get-all-users', [LoginController::class, 'getAllUsers']);

    //
    Route::get('/get-all-cart-items', [CartController::class, 'getAllCartItems']);
    Route::post('/add-to-cart', [CartController::class, 'store']);
    Route::put('/update-cart', [CartController::class, 'update']);
    Route::delete('/remove-from-cart', [CartController::class, 'destroy'])->name('cart.remove');
    Route::delete('/delete-multiple-from-cart', [CartController::class, 'deleteMultiple']);


    Route::post('/orders/user-update-order', [OrderItemController::class, 'userUpdateOrder']); //1


    //
    

    Route::get('/getall-order', [OrderController::class, 'getAllOrders']);
    Route::get('/get-order-current-login', [OrderController::class, 'getOrdersCurrentLogin']);
    Route::post('/save-order', [OrderController::class, 'createOrders']);
    Route::put('/edit-order', [OrderController::class, 'updateOrder']);
    Route::delete('/delete-order', [OrderController::class, 'deleteOrder']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    Route::get('/getall-order-items', [OrderItemController::class, 'getAllOrderItems']);
    Route::post('/save-order-items', [OrderItemController::class, 'addOrderItem']);
    Route::delete('/delete-order-items', [OrderItemController::class, 'deleteOrderItem']);

    Route::get('/get-variants-by-product/{productId}', [OrderItemController::class, 'getVariantsByProduct']);//2

    Route::get('/address-page', [MapController::class, 'index']);
    Route::put('/update-address', [LoginController::class, 'updateUserAddress']);
    Route::get('/me-info', [LoginController::class, 'me']);

    // push notifications 
    Route::post('/save-push-notification-sub', [PushNotificationBrowserController::class, 'saveSubscription']);
    Route::post('/send-push-notification', [PushNotificationBrowserController::class, 'sendNotification']);








});


// admin
Route::middleware('MyAdminMiddleware')->group(function () {
Route::get('/home-dashboard', [Home_dashBoard::class, 'index'])->name('admin.home_dashboard');
Route::post('/admin/event', [EventController::class, 'store'])->name('event.store');
Route::get('/admin/events', [EventController::class, 'getAllEvents']);
Route::get('/admin/event/{id}', [EventController::class, 'show']);
Route::put('/admin/event/{id}', [EventController::class, 'update'])->name('event.update');
Route::delete('/admin/event/{id}', [EventController::class, 'destroy'])->name('event.destroy');



});





//client
Route::get('/banner-images', [BannerImageController::class, 'getAllBannerImages']);




Route::get('/getAllProducts', [ProductController::class, 'getAll']);
Route::get('/getAllCategory', [CategoryController::class, 'getAllCategory']);
Route::get('/home-page', function () {
    return view('client.pages.home_page');
})->name('client.home_page');
Route::get('/details-page', function () {
    return view('client.pages.detail_page');
});
Route::get('/reviews', [ReviewController::class, 'getReviewsByQuery']);


// user
Route::middleware('MyUserMiddleWare')->group(function () {

    Route::get('/cart-page', [CartController::class, 'index']);

    //
    Route::get('/buy-now-page', function () {
        return view('client.pages.buy_now_page');
    });

    //
    Route::get('/profile-page', function () {
        return view('client.pages.profile_page');
    });

    //
    Route::get('/order-success', function () {
        return view('client.pages.order_sucess');
    });


    //
    Route::get('/order-history-page', function () {
        return view('client.pages.order_history_page');
    });


    Route::post('/update-info', [ProfileController::class, 'updateInfo'])->middleware('MyUserMiddleWare');
   
    
});



