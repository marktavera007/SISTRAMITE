<?php

namespace App\Http\Controllers;

use App\Http\Requests\clientes\StoreRequest;
use App\Http\Requests\clientes\UpdateRequest;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\User;
use App\Notifications\CredencialesClienteNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Usuario logueado
        $user = Auth::user();

        // Si el usuario es administrador, obtener todos los clientes
        if ($user->role === 'administrador') {
            $clientes = Cliente::with('user:id,name,email,is_active')->get();
        } else {
            // Buscar el empleado correspondiente a ese usuario
            $empleado = Empleado::where('user_id', $user->id)->first();

            // Obtener solo los clientes asignados a ese empleado
            $clientes = $empleado
                ? Cliente::where('empleado_id', $empleado->id)
                ->with('user:id,name,email,is_active')
                ->get()
                : collect(); // colección vacía si no se encuentra el empleado
        }

        // Obtener lista de empleados
        $empleados = DB::table('empleados')
            ->join('users', 'empleados.user_id', '=', 'users.id')
            ->select('empleados.id', 'users.name', 'empleados.cargo')
            ->get();

        return Inertia::render('clientes/index', [
            'clientes' => $clientes,
            'empleados' => $empleados,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {

        // Solo permitir que el admin o empleados creen clientes
        if (!in_array(Auth::user()->role, ['administrador', 'empleado'])) {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        // Crear el usuario con el rol 'empleado'
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'cliente', // Fijamos el rol como 'empleado'
        ]);

        // Obtener los datos del empleado del request
        $data = $request->only('dni', 'celular', 'ruc', 'direccion', 'empleado_id');

        // Guardar la foto si existe
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('clientes', 'public');
        }

        // Relacionar el empleado con el usuario recién creado
        $data['user_id'] = $user->id;

        // Crear el empleado
        Cliente::create($data);

        //Enviar credenciales por correo
        $user->notify(new CredencialesClienteNotification($user->name, $user->email, $request->password));
        // Enviar un correo simple
        // $toEmail = $user->email;
        // $subject = 'Bienvenido a nuestra plataforma';
        // $message = 'Hola ' . $user->name . ',\n\nTu cuenta ha sido creada con éxito. Tu correo es: ' . $user->email . ' y tu contraseña es: ' . $request->password . '\n\n¡Gracias por unirte!';
        // $message = "Hola {$user->name},\n\nTu cuenta ha sido creada.\nEmail: {$user->email}\nContraseña: {$request->password}\n\nGracias por registrarte.";

        // Mail::raw($message, function ($msg) use ($user) {
        //     $msg->to($user->email)
        //         ->subject('Tus credenciales de acceso');
        // });

        // Redireccionar a la lista de empleados
        return to_route('cliente.index')->with('success', 'Empleado creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Cliente $cliente)
    {
        // Obtener los datos del empleado del request
        $clienteData = $request->only('dni', 'celular', 'ruc', 'direccion', 'empleado_id');

        // Si se sube una nueva foto, guardarla
        if ($request->hasFile('foto')) {
            // Borrar la foto anterior si existe
            if ($cliente->foto) {
                Storage::disk('public')->delete($cliente->foto);
            }

            // Guardar la nueva foto
            $clienteData['foto'] = $request->file('foto')->store('clientes', 'public');
        }

        // Actualizar los datos específicos del empleado
        $cliente->update($clienteData);

        // Obtener los datos del usuario asociado
        $usuarioData = $request->only('name', 'email');

        // Actualizar los datos del usuario (si es necesario)
        $cliente->user->update($usuarioData);

        // Redireccionar a la lista de empleados con mensaje de éxito
        return to_route('cliente.index')->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        // Eliminar la foto del empleado, si existe
        if ($cliente->foto) {
            Storage::disk('public')->delete($cliente->foto);
        }

        // Opcional: Desactivar el usuario en lugar de eliminarlo
        $cliente->user->update(['is_active' => false]);

        // Eliminar el empleado
        $cliente->delete();

        return to_route('cliente.index');
    }
}
