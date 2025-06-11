<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeguimientoTramite extends Model
{

    use HasFactory;

    protected $fillable = ['tramite_id',  'empleado_id', 'estado', 'fecha_derivacion'];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }
}
