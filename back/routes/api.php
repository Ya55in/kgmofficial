<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ComingSoonController;
use App\Http\Controllers\Api\TestDriveController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\WebhookTestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Coming soon form submission
Route::post('/coming-soon', [ComingSoonController::class, 'submit']);

// Test drive form submission
Route::post('/test-drive', [TestDriveController::class, 'submit']);

// Webhook for KGM leads (encrypted)
Route::post('/webhook/kgm', [WebhookController::class, 'receive']);

// Webhook testing endpoints (for development/testing only)
Route::get('/webhook/test-status', [WebhookTestController::class, 'status']);
Route::post('/webhook/test', [WebhookTestController::class, 'test']);

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'API is running']);
});
