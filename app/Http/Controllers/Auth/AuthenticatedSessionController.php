<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Intenta autenticar al usuario con las credenciales
        $credentials = $request->only('email', 'password');

        // Si no se puede autenticar, redirige con un error
        if (!Auth::attempt($credentials)) {
            return redirect()->route('login')->withErrors(['email' => 'Credenciales incorrectas']);
        }

        // Obtén el usuario autenticado
        $user = Auth::user();

        // Asegúrate de que el usuario no sea null
        if (!$user) {
            // Si no se encuentra un usuario autenticado, redirige con un error
            return redirect()->route('login')->withErrors(['email' => 'No se pudo encontrar al usuario']);
        }

        // Verificar si el usuario está activo
        if (!$user->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors(['email' => 'Tu cuenta está desactivada.']);
        }

        // Regenerar la sesión
        $request->session()->regenerate();

        // Redirigir según el rol del usuario
        if ($user->role == 'empleado') {
            return redirect()->intended(route('cliente.index', absolute: false));
        }
        if ($user->role == 'cliente') {
            return redirect()->intended(route('tramite.index', absolute: false));
        }


        // Redirigir a otro destino si no es un empleado
        return redirect()->intended(route('user.index', absolute: false));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
