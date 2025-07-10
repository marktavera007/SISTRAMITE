<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('tramites', function (Blueprint $table) {
            $table->string('oc_cforpag')->nullable()->after('dias_respuesta');
            $table->string('oc_ccodmon')->nullable()->after('oc_cforpag');
            $table->string('oc_dfecdoc')->nullable()->after('oc_ccodmon');
            $table->string('oc_cfacnombre')->nullable()->after('oc_dfecdoc');
            $table->string('oc_cfacruc')->nullable()->after('oc_cfacnombre');
            $table->string('oc_cfacdirec')->nullable()->after('oc_cfacruc');
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
