<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'estado']; // Los campos asignables


    // Relación con Tramite (Un área puede tener varios trámites)
    public function tramites()
    {
        return $this->hasMany(Tramite::class);
    }
}
