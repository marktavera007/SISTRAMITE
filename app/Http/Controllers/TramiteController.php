<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tramite\OrdenRequest;
use App\Models\Area;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\SeguimientoTramite;
use App\Models\Tramite;
use App\Notifications\FacturaSubidaClienteNotification;
use App\Notifications\NuevoTramiteCorreoNotification;
use App\Notifications\NuevoTramiteNotification;
use App\Notifications\TramiteDerivadoNotification;
use App\Notifications\TramiteFinalizarCorreoNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TramiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Inicializa la variable de trámites
        $tramiteQuery = Tramite::with([
            'cliente.user',
            'empleado.user',
            'detalles'
        ]);

        // Filtrar trámites según el rol del usuario
        if ($user->role === 'administrador') {
            $tramite = $tramiteQuery->get();
        } else {
            // Verificar si es empleado
            $empleado = Empleado::where('user_id', $user->id)->first();
            if ($empleado) {
                $tramite = $tramiteQuery->where('empleado_id', $empleado->id)->get();
            } else {
                // Si no es empleado, verificar si es cliente
                $cliente = Cliente::where('user_id', $user->id)->first();
                $tramite = $cliente
                    ? $tramiteQuery->where('cliente_id', $cliente->id)->get()
                    : collect(); // vacío si no es cliente ni empleado
            }
        }


        // Obtener la información del creador (empleado que hizo el primer seguimiento)
        foreach ($tramite as $t) {
            // Obtener el primer seguimiento para cada trámite usando la relación 'seguimiento'
            $primerSeguimiento = $t->seguimiento()->first(); // Aquí usamos el nombre correcto de la relación
            if ($primerSeguimiento) {
                // Cargar el empleado que realizó el primer seguimiento (creador)
                $empleadoCreador = $primerSeguimiento->empleado;

                // Asignamos los datos del creador al trámite
                $t->creador = [
                    'id' => $empleadoCreador->id,
                    'nombre' => $empleadoCreador->user->name ?? 'Empleado no encontrado',
                    'email' => $empleadoCreador->user->email ?? 'Email no disponible',
                    // Agregar más datos si es necesario
                ];
            }
        }

        // Otros datos necesarios
        $clientes = Cliente::with('user:id,name,email')->get(['id', 'dni', 'ruc', 'user_id']);
        $empleados = Empleado::with('user:id,name')->get(['id', 'user_id']);
        $seguimientosTramite = SeguimientoTramite::whereIn('tramite_id', $tramite->pluck('id'))->get();

        return Inertia::render('tramites/index', [
            'clientes' => $clientes,
            'empleados' => $empleados,
            'tramite' => $tramite,
            'seguimientosTramite' => $seguimientosTramite,
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
    public function store(OrdenRequest $request)
    {
        // Validar los datos recibidos
        $validatedData = $request->validated(); // ✅ Correcto
        // Obtener el usuario autenticado
        $user = Auth::user();
        // Determinar el empleado_id según el rol
        if ($user->role === 'empleado') {
            $validatedData['empleado_id'] = optional($user->empleado)->id; // Obtener su ID en la tabla empleados
        } elseif ($user->role === 'administrador') {
            $validatedData['empleado_id'] = null; // Su propio ID en users
        } else {
            $validatedData['empleado_id'] = null; // Si es cliente, no tiene empleado_id
        }

        // Subir el documento si se ha enviado
        if ($request->hasFile('documento_subido')) {
            $validatedData['documento_subido'] = $request->file('documento_subido')->store('documentos', 'public');
        }

        // Crear el trámite y establecer el estado como 'pendiente'
        $tramite = Tramite::create([
            ...$validatedData, // Aquí pasamos los datos validados
            'estado' => 'pendiente', // El estado del trámite también es 'pendiente'
        ]);
        // Crear el seguimiento inicial (etapa inicial con el área de origen)
        SeguimientoTramite::create([
            'tramite_id' => $tramite->id,
            'empleado_id' => $validatedData['empleado_id'],
            'estado' => 'pendiente', // Estado inicial
            'fecha_derivacion' => now(),
        ]);


        // Insertar productos si vienen
        if (!empty($validatedData['productos'])) {
            foreach ($validatedData['productos'] as $producto) {
                $tramite->detalles()->create([
                    'oc_citem'    => $producto['oc_citem'],
                    'oc_ccodigo'  => $producto['oc_ccodigo'],
                    'oc_cdesref'  => $producto['oc_cdesref'],
                    'oc_ncantid'  => $producto['oc_ncantid'],
                ]);
            }
        }


        // Obtener el cliente relacionado con el trámite usando el cliente_id
        $cliente = Cliente::find($validatedData['cliente_id']);

        // Verificar si el cliente tiene un usuario asociado
        if ($cliente && $cliente->user) {
            // Enviar la notificación al cliente
            $cliente->user->notify(new NuevoTramiteNotification($tramite));
            $cliente->user->notify(new NuevoTramiteCorreoNotification($tramite));
        }


        return to_route('tramite.index')->with('success', 'Area creado correctamente.');
    }

    /** finalizar tramite */
    public function finalizar(Tramite $tramite)
    {
        // Obtener el empleado relacionado con el usuario autenticado
        $empleadoId = Auth::user()?->empleado->id;  // Obtén el id del empleado relacionado con el usuario autenticado

        // Verificar si el usuario tiene un empleado asociado
        if (!$empleadoId) {
            return back()->with('error', 'El usuario no tiene un empleado asociado.');
        }

        // Actualizar estado del trámite
        $tramite->update(['estado' => 'completado']);

        // Crear seguimiento final
        SeguimientoTramite::create([
            'tramite_id' => $tramite->id,
            'empleado_id' => $empleadoId,  // Ahora insertamos el id del empleado
            'estado' => 'completado',
            'fecha_derivacion' => now(),
        ]);

        // Enviar correo al cliente notificando que su trámite fue finalizado
        $cliente = $tramite->cliente;

        if ($cliente && $cliente->user) {
            $cliente->user->notify(new TramiteFinalizarCorreoNotification($tramite));
        }

        return back()->with('success', 'Trámite finalizado correctamente.');
    }

    public function subirFactura(Request $request, Tramite $tramite)
    {
        $request->validate([
            'factura' => 'required|file|mimes:pdf,doc,docx,jpg,png|max:2048'
        ]);

        if ($request->hasFile('factura')) {
            $path = $request->file('factura')->store('facturas', 'public');
            $tramite->update(['factura_subida' => $path]);

            // Notificar al empleado asignado
            $empleado = $tramite->empleado;

            if ($empleado && $empleado->user) {
                $empleado->user->notify(new FacturaSubidaClienteNotification($tramite));
            }
        }


        return back()->with('success', 'Factura subida correctamente');
    }


    /**
     * Derivar un trámite a otra área.
     */
    public function derivarTramite(Request $request, Tramite $tramite)
    {
        $request->validate([
            'empleado_id' => 'required|exists:empleados,id',  // El empleado al que se deriva
        ]);

        // Validar que no se derive a la misma área
        // if ($tramite->area_destino_id == $request->area_destino_id) {
        //     return back()->withErrors(['area_destino_id' => 'El trámite ya está asignado a esa área de destino.']);
        // }

        DB::transaction(function () use ($request, $tramite) {
            // 1. Actualizar el estado del último seguimiento (el anterior)
            $ultimoSeguimiento = SeguimientoTramite::where('tramite_id', $tramite->id)
                ->orderBy('fecha_derivacion', 'desc')
                ->first();

            if ($ultimoSeguimiento) {
                $ultimoSeguimiento->update([
                    'estado' => 'derivado', // Cambiar el estado al que corresponde
                    'fecha_derivacion' => now(),
                ]);
            }

            // 2. Crear un nuevo seguimiento con el área destino y el empleado asignado
            SeguimientoTramite::create([
                'tramite_id' => $tramite->id,
                'empleado_id' => $request->empleado_id, // El empleado al que se deriva
                'estado' => 'pendiente', // El estado inicial del nuevo seguimiento
                'fecha_derivacion' => now(),
            ]);

            // 3. Actualizar el trámite: el área destino pasa a ser el área actual
            $tramite->update([

                'empleado_id' => $request->empleado_id, // El empleado a quien se asigna el trámite
                'estado' => 'pendiente', // Estado del trámite: derivado
            ]);
        });
        // Obtener el empleado al que se derivó el trámite
        $empleado = Empleado::with('user')->find($request->empleado_id);

        // Verificar si tiene usuario asociado y notificarle
        if ($empleado && $empleado->user) {
            $empleado->user->notify(new TramiteDerivadoNotification($tramite));
        }


        return back()->with('success', 'Trámite derivado correctamente.');
    }




    /**
     * Display the specified resource.
     */
    public function show(Tramite $tramite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tramite $tramite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tramite $tramite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tramite $tramite)
    {
        //
    }
}
