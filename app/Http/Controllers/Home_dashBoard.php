<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Home_dashBoard extends Controller
{
    public function index()
    {
        return view("admin.pages.home_dashboard");
    }
}
