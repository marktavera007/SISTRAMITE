<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = ['empleado_id', 'user_id', 'ruc', 'celular', 'foto', 'dni', 'direccion'];

    /** 
     * @return array Definir conversiones automáticas 
     */
    protected function casts(): array
    {
        return [
            'estado' => 'boolean', // Convertir a true/false
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
    // Relación con el empleado
    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
