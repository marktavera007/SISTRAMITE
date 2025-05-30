<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Agregado el campo 'role'
        'is_active', // Se puede asignar masivamente
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string', // Se asegura que 'role' se maneje como string
            'is_active' => 'boolean',
        ];
    }

    protected static function booted()
    {
        static::deleting(function ($usuario) {
            if ($usuario->role === 'cliente' && $usuario->cliente) {
                $usuario->cliente->delete(); // relación correcta
            }

            if ($usuario->role === 'empleado' && $usuario->empleado) {
                $usuario->empleado->delete(); // relación correcta
            }

            // Si es administrador, no se hace nada
        });
    }

    // Relación con el cliente
    public function cliente()
    {
        return $this->hasOne(Cliente::class);
    }
    public function empleado()
    {
        return $this->hasOne(Empleado::class); // Un usuario puede tener un empleado asociado
    }
}
