<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Tramite extends Model
{
    use HasFactory; // Habilita el uso de fábricas

    // Definir la tabla si no sigue la convención
    protected $table = 'tramites';

    // Definir los campos que son asignables de manera masiva
    protected $fillable = [
        'cliente_id',
        'empleado_id',
        'numero_expediente',
        'nota_ingreso',
        'orden_compra',
        'factura_subida',
        'numero_factura',
        'tipo_documento',
        'estado',
        'dias_pasados',
        'dias_respuesta',
        'documento_subido', // Si tienes el campo para el documento
        'oc_cforpag',
        'oc_ccodmon',
        'oc_dfecdoc',
        'oc_cfacnombre',
        'oc_cfacruc',
        'oc_cfacdirec',
    ];

    // Si es necesario deshabilitar la creación automática de timestamps
    public $timestamps = true;

    // Establecer relaciones

    public function seguimiento()
    {
        return $this->hasMany(SeguimientoTramite::class);
    }
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function areaDestino()
    {
        return $this->belongsTo(Area::class, 'area_destino_id'); // Relación con el área de destino
    }

    public function detalles()
    {
        return $this->hasMany(TramiteDetalle::class, 'id_tramite', 'id');
    }



    // Método para calcular los días pasados desde la creación del trámite
    public function getDiasPasadosAttribute()
    {
        return $this->created_at ? $this->created_at->diffInDays(now()) : 0;
    }




    // Si necesitas lógica adicional, por ejemplo, para actualizar los días antes de guardar el trámite
    public static function booted()
    {
        static::saving(function ($tramite) {
            // Si el trámite está completado y no tiene días de respuesta
            if ($tramite->estado === 'completado' && !$tramite->dias_respuesta) {
                $tramite->dias_respuesta = $tramite->created_at ? $tramite->created_at->diffInDays(Carbon::now()) : 0;
            }

            // Si no tiene días pasados y created_at no es null
            if (!$tramite->dias_pasados) {
                $tramite->dias_pasados = $tramite->created_at ? $tramite->created_at->diffInDays(Carbon::now()) : 0;
            }
        });

        static::creating(function ($tramite) {
            if (empty($tramite->numero_expediente)) {
                // Generar el número de expediente con un prefijo y un número incremental
                $tramite->numero_expediente = 'OC-' . str_pad(Tramite::max('id') + 1, 5, '0', STR_PAD_LEFT);
            }
        });
    }


    // Definir los estados válidos para el trámite
    public static function getEstados()
    {
        return ['pendiente', 'en_proceso', 'completado', 'cancelado'];
    }
}
