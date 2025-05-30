<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Empleado extends Model
{
    use HasFactory;



    /** @var array Campos permitidos para asignación masiva */
    protected $fillable = [
        'user_id',
        'foto',
        'dni',
        'celular',
        'cargo',
        'direccion',
    ];

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

    /**
     * Relación: Un Empleado pertenece a un Usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación con los clientes
    public function clientes()
    {
        return $this->hasMany(Cliente::class);
    }
}
