<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
use App\Models\User;

Route::get('/test-audit', function () {
    User::create([
        'name'     => 'Test Navegador',
        'email'    => 'nav' . rand(1,999) . '@bolivar.com',
        'password' => 'password123',
    ]);
    return 'ok';
});