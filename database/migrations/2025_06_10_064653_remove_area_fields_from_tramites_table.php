<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            // Primero eliminamos las claves foráneas
            $table->dropForeign(['area_id']);
            $table->dropForeign(['area_destino_id']);

            // Luego eliminamos las columnas
            $table->dropColumn(['area_id', 'area_destino_id']);
        });
        Schema::table('seguimiento_tramites', function (Blueprint $table) {
            $table->dropForeign(['area_id']);
            $table->dropColumn('area_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('tramites');
    }
};
