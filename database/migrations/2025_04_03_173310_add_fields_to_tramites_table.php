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
            $table->foreignId('area_destino_id')->constrained('areas')->onDelete('cascade');
            $table->string('documento_subido')->nullable(); // Campo para almacenar el documento subido
            $table->integer('dias_pasados')->default(0);
            $table->integer('dias_respuesta')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            $table->dropColumn('area_destino_id');
            $table->dropColumn('documento_subido');
            $table->dropColumn('dias_pasados');
            $table->dropColumn('dias_respuesta');
        });
    }
};
