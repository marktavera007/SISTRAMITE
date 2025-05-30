<?php

namespace App\Http\Controllers;

use App\Http\Requests\empleados\StoreRequestEmpleado;
use App\Http\Requests\empleados\UpdateRequest;
use App\Models\Empleado;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Solo permitir si es administrador
        if ($user->role !== 'administrador') {
            abort(Response::HTTP_FORBIDDEN, 'No tienes permiso para ver esta sección.');
        }

        $empleados = Empleado::with('user:id,name,email,is_active')->get();

        return Inertia::render('empleados/index', compact('empleados'));
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
    public function store(StoreRequestEmpleado $request)
    {
        // Solo permitir que el admin cree empleados
        if (Auth::user()->role !== 'administrador') {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        // Crear el usuario con el rol 'empleado'
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'empleado', // Fijamos el rol como 'empleado'
        ]);

        // Obtener los datos del empleado del request
        $data = $request->only('dni', 'celular', 'cargo', 'direccion');

        // Guardar la foto si existe
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('empleados', 'public');
        }

        // Relacionar el empleado con el usuario recién creado
        $data['user_id'] = $user->id;

        // Crear el empleado
        Empleado::create($data);

        // Redireccionar a la lista de empleados
        return to_route('empleado.index')->with('success', 'Empleado creado correctamente.');
    }



    /**
     * Display the specified resource.
     */
    public function show(Empleado $empleado)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Empleado $empleado)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateRequest $request, Empleado $empleado)
    {
        // Obtener los datos del empleado del request
        $empleadoData = $request->only('dni', 'celular', 'cargo', 'direccion');

        // Si se sube una nueva foto, guardarla
        if ($request->hasFile('foto')) {
            // Borrar la foto anterior si existe
            if ($empleado->foto) {
                Storage::disk('public')->delete($empleado->foto);
            }

            // Guardar la nueva foto
            $empleadoData['foto'] = $request->file('foto')->store('empleados', 'public');
        }

        // Actualizar los datos específicos del empleado
        $empleado->update($empleadoData);

        // Obtener los datos del usuario asociado
        $usuarioData = $request->only('name', 'email');

        // Actualizar los datos del usuario (si es necesario)
        $empleado->user->update($usuarioData);

        // Redireccionar a la lista de empleados con mensaje de éxito
        return to_route('empleado.index')->with('success', 'Empleado actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy(Empleado $empleado)
    {
        // Eliminar la foto del empleado, si existe
        if ($empleado->foto) {
            Storage::disk('public')->delete($empleado->foto);
        }

        // Opcional: Desactivar el usuario en lugar de eliminarlo
        $empleado->user->update(['is_active' => false]);

        // Eliminar el empleado
        $empleado->delete();

        return to_route('empleado.index');
    }
}
