<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\FounderController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

//  ROUTES PUBLIQUES (sans authentification requise)

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Projects - lecture publique
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);

// Founders
Route::get('/founders/{id}', [FounderController::class, 'show']);

// Investors
Route::get('/investors', [InvestorController::class, 'index']);
Route::get('/investors/{id}', [InvestorController::class, 'show']);

// Partners
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/partners/{partner}', function (\App\Models\Partner $partner) {
    return response()->json($partner);
});

// News - lecture publique
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/news/{news}/image', [NewsController::class, 'image']);

// Events - lecture publique
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/events/{id}/image', [EventController::class, 'image']);

// Startups - lecture publique
Route::get('/startups', [App\Http\Controllers\Api\StartupController::class, 'index']);
Route::get('/startups/{id}', [App\Http\Controllers\Api\StartupController::class, 'show']);
Route::get('/startups/{startup_id}/founders/{founder_id}/image', [FounderController::class, 'founderImage']);

//Dashboard - lecture publique
Route::get('/dashboard', [DashboardController::class, 'index']);

//  ROUTES PROTÉGÉES PAR AUTH SANCTUM

Route::middleware('auth:sanctum')->group(function () {

    // Utilisateur connecté
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Projects - création / édition / suppression
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/email/{email}', [UserController::class, 'byEmail']);
    Route::get('/users/{user_id}', [UserController::class, 'show']);
    Route::get('/users/{user_id}/image', [UserController::class, 'image']);
    Route::post('/users/{user_id}/image', [UserController::class, 'uploadImage']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user_id}', [UserController::class, 'update']);
    Route::delete('/users/{user_id}', [UserController::class, 'destroy']);


    // DELETE user
    Route::delete('/users/{user_id}', [UserController::class, 'destroy']);

    // News - création / édition / suppression
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    // Events - création / édition / suppression
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Startups - création / édition / suppression
    Route::post('/startups', [\App\Http\Controllers\Api\StartupController::class, 'store']);
    Route::put('/startups/{id}', [\App\Http\Controllers\Api\StartupController::class, 'update']);
    Route::delete('/startups/{id}', [\App\Http\Controllers\Api\StartupController::class, 'destroy']);

    //Pitch Desk exportation de pdf
    Route::get('/export/pitchdeck', [\App\Http\Controllers\Api\ExportController::class, 'pitchDeck']);
});

