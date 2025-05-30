<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Verifica si el usuario no es admin
        if ($user->role !== 'administrador') {
            abort(Response::HTTP_FORBIDDEN, 'No tienes permiso para acceder a esta sección.');
        }

        $areas = Area::all();

        return Inertia::render('areas/index', compact('areas'));
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
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'estado' => 'required|in:0,1', // Asegurar que solo se permiten 0 o 1
        ]);

        // Crear el área en la base de datos
        Area::create($validatedData);
        return to_route('area.index')->with('success', 'Area creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Area $area)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Area $area)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Area $area)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'estado' => 'required|in:0,1', // Solo permitir 0 o 1
        ]);

        // Actualizar el área en la base de datos
        $area->update($validatedData);

        // Redirigir con mensaje de éxito
        return to_route('area.index')->with('success', 'Área actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Area $area)
    {
        $area->delete(); // Eliminación total de la base de datos
        return to_route('area.index');
    }
}
