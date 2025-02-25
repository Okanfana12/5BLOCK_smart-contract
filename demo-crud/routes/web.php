<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/', [UserController::class, 'index'])->name('users.index');

// 404
Route::fallback(function () {
    return response()->json(['message' => 'Not Found!'], 404);
});

// users.create
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');

// users.store
Route::post('/users', [UserController::class, 'store'])->name('users.store');
// users.show
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
// users.edit
Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
// destroy
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
