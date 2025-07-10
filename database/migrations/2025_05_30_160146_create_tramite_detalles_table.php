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
        Schema::create('tramite_detalles', function (Blueprint $table) {
            $table->bigIncrements('id_det'); // Clave primaria personalizada

            $table->unsignedBigInteger('id_tramite'); // FK al tramite

            $table->string('oc_citem', 50);      // Puedes ajustar tamaños
            $table->string('oc_ccodigo', 100);
            $table->string('oc_cdesref', 255);
            $table->integer('oc_ncantid');


            // Define la clave foránea
            $table->foreign('id_tramite')->references('id')->on('tramites')->onDelete('cascade');

            // No timestamps según tu modelo
            // $table->timestamps(); // No agregar si no tienes created_at / updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tramite_detalles');
    }
};
