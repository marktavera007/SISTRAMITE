<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteDetalle extends Model
{
    use HasFactory; // Habilita el uso de fábricas

    protected $table = 'tramite_det'; // especificar si no sigue la convención Laravel

    protected $primaryKey = 'id_det'; // clave primaria personalizada

    public $timestamps = false; // si tu tabla no tiene created_at / updated_at

    protected $fillable = [
        'id_tramite',
        'oc_citem',
        'oc_ccodigo',
        'oc_cdesref',
        'oc_ncantid',
    ];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class, 'id_tramite');
    }
}
