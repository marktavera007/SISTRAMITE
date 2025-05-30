<?php

namespace App\Http\Controllers;

use App\Http\Requests\users\StoreRequestUserCreate;
use App\Http\Requests\users\UpdateRequest;
use App\Models\User;
use App\Notifications\CredencialesClienteNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar si el usuario tiene el rol de administrador
        if ($user->role !== 'administrador') {
            // Si no es administrador, no enviar ningún dato
            return Inertia::render('usuarios/index', [
                'usuarios' => [],  // Enviar una lista vacía
                'message' => 'No tienes permiso para ver esta página.' // Mensaje opcional
            ]);
        }

        // Si es administrador, obtiene la lista completa de usuarios
        $usuarios = User::all(); // Obtiene todos los usuarios



        return Inertia::render('usuarios/index',  [
            'usuarios' => $usuarios,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Obtener lista de empleados
        $empleados = DB::table('empleados')
            ->join('users', 'empleados.user_id', '=', 'users.id')
            ->select('empleados.id', 'users.name', 'empleados.cargo')
            ->get();
        return Inertia::render('usuarios/crear', [
            'empleados' => $empleados,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequestUserCreate $request)
    {
        // $data = $request->only('name', 'email', 'password', 'role');
        // User::create($data);
        // return to_route('user.index');

        $data = $request->only('name', 'email', 'password', 'role');

        // Crear el usuario
        $user = User::create($data);

        // Manejo del archivo foto (si existe)
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $folder = $request->role === 'empleado' ? 'empleados' : 'clientes';
            $fotoPath = $request->file('foto')->store($folder, 'public');
        }

        // Si es EMPLEADO, creamos en la tabla empleados
        if ($request->role === 'empleado') {
            $user->empleado()->create([
                'user_id'   => $user->id,
                'foto'      => $fotoPath,
                'dni'       => $request->dni,
                'celular'   => $request->celular,
                'direccion' => $request->direccion,
                'cargo'     => $request->cargo,
            ]);
        }

        // Si es CLIENTE, creamos en la tabla clientes
        if ($request->role === 'cliente') {
            $user->cliente()->create([
                'user_id'     => $user->id,
                'empleado_id' => $request->empleado_id,
                'foto'        => $fotoPath,
                'dni'         => $request->dni,
                'celular'     => $request->celular,
                'direccion'   => $request->direccion,
                'ruc'         => $request->ruc,
            ]);
        }

        $user->notify(new CredencialesClienteNotification($user->name, $user->email, $request->password));
        return to_route('user.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $usuario)
    {
        return Inertia::render('usuarios/editar', compact('usuario'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, User $usuario)
    {
        $data = $request->only('name', 'email', 'role', 'is_active');
        $usuario->update($data);
        return to_route('user.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario)
    {
        $usuario->delete();
        return to_route('user.index');
    }
}
