<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ResultController;
use App\Http\Controllers\Admin\MockController;

use App\Http\Controllers\User\MockController as UserMockController;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


//flush cache
Route::get('/cache-clear', function() {
	Artisan::call('optimize:clear');
	return "Cache is cleared";
});


Route::get('/info', function() {
	phpinfo();
});

Route::get('/cron', function () {
	\Artisan::call('queue:work --queue=SpeechToText --timeout=2000');
})->name('cron');


Route::group(['middleware' => ['auth', 'verified']], function () {	
	
	/*Route::get('/', function () {
	    return Inertia::render('Welcome', [
	        'canLogin' => Route::has('login'),
	        'canRegister' => Route::has('register'),
	        'laravelVersion' => Application::VERSION,
	        'phpVersion' => PHP_VERSION,
	    ]);
	});*/


	Route::get('/', function () {
	    return Inertia::render('Dashboard');
	})->name('home');


	Route::get('/dashboard', function () {
	    return Inertia::render('Dashboard');
	})->name('dashboard');





	Route::controller(MockController::class)->prefix('admin')->middleware('isAdmin')->group(function () {
        Route::get('/mock', 'index')->name('mock.index');
        Route::get('/mock/create', 'create')->name('mock.create');
        Route::post('/mock/store', 'store')->name('mock.store');
        Route::get('/mock/{mock}/edit', 'edit')->name('mock.edit');
        Route::post('/mock/destroy', 'destroy')->name('mock.destroy');
        
    });


    Route::controller(UserMockController::class)->middleware('isUser')->group(function () {
        Route::get('/mock-tests', 'index')->name('user.mock.index');

        Route::get('/mock-tests/{mock}', 'takeTest')->name('mock.test');
        Route::post('/mock-tests/submit', 'testSubmit')->name('mock.test.submit');
        
    });

    Route::controller(ResultController::class)->group(function () {
        Route::get('/result', 'index')->name('result.index');
        Route::get('/result/{mock}/{slug}', 'show')->name('result.show');
    });


});




require __DIR__.'/auth.php';
