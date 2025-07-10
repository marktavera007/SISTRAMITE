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
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade'); // Relación con el cliente
            $table->foreignId('empleado_id')->constrained('empleados')->onDelete('cascade'); // Relación con el empleado que creó el trámite
            $table->foreignId('area_id')->constrained('areas')->onDelete('cascade');
            $table->string('numero_expediente')->unique(); // Número de expediente único
            $table->string('nota_ingreso')->nullable(); // Nota de ingreso
            $table->string('orden_compra')->nullable(); // Orden de compra
            $table->string('numero_factura')->nullable(); // Número de factura
            $table->string('tipo_documento'); // Tipo de documento (Ej. Informe, Solicitud)
            $table->string('oc_fechaestimadapago', 255)->nullable();
            $table->boolean('oc_aprobacioncompras')->default(false);
            $table->enum('estado', ['pendiente', 'en_proceso', 'completado', 'cancelado'])->default('pendiente'); // Define los posibles estados
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tramites');
    }
};
