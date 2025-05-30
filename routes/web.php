<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TramiteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');


Route::middleware('auth')->get('/user/notifications', [NotificationController::class, 'fetch']);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::get('usuarios', function () {
    //     return Inertia::render('usuarios');
    // })->name('usuarios');

    //notificaciones
    // Route::get('dashboard', [NotificationController::class, 'index'])->name('notificaciones');

    // Rutas de Usuarios
    Route::get('usuarios', [UserController::class, 'index'])->name('user.index');
    Route::get('usuarios/crear', [UserController::class, 'create'])->name('user.crear');
    Route::post('usuarios', [UserController::class, 'store'])->name('user.store');
    Route::get('usuarios/{usuario}/editar', [UserController::class, 'edit'])->name('user.edit');
    Route::post('usuarios/{usuario}', [UserController::class, 'update'])->name('user.update');
    Route::delete('usuarios/{usuario}', [UserController::class, 'destroy'])->name('user.destroy');

    // Rutas de Empleados
    Route::get('empleados', [EmpleadoController::class, 'index'])->name('empleado.index');
    Route::post('empleados', [EmpleadoController::class, 'store'])->name('empleado.store');
    Route::post('empleados/{empleado}', [EmpleadoController::class, 'update'])->name('empleado.update');
    Route::delete('empleados/{empleado}', [EmpleadoController::class, 'destroy'])->name('empleado.destroy');

    // Rutas de Clientes
    Route::get('clientes', [ClienteController::class, 'index'])->name('cliente.index');
    Route::post('clientes', [ClienteController::class, 'store'])->name('cliente.store');
    Route::post('clientes/{cliente}', [ClienteController::class, 'update'])->name('cliente.update');
    Route::delete('clientes/{cliente}', [ClienteController::class, 'destroy'])->name('cliente.destroy');

    // Rutas de Areas
    Route::get('areas', [AreaController::class, 'index'])->name('area.index');
    Route::post('areas', [AreaController::class, 'store'])->name('area.store');
    Route::post('areas/{area}', [AreaController::class, 'update'])->name('area.update');
    Route::delete('areas/{area}', [AreaController::class, 'destroy'])->name('area.destroy');

    // Rutas de Areas
    Route::get('tramites', [TramiteController::class, 'index'])->name('tramite.index');
    Route::post('tramites', [TramiteController::class, 'store'])->name('tramite.store');
    Route::post('/tramites/{tramite}/derivar', [TramiteController::class, 'derivarTramite'])->name('tramite.derivar');
    Route::post('/tramites/{tramite}/finalizar', [TramiteController::class, 'finalizar'])->name('tramite.finalizar');
    Route::post('/tramites/{tramite}/factura', [TramiteController::class, 'subirFactura'])->name('tramite.facturaCliente');
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
