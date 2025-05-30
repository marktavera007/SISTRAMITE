<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::rename('tramite_detalles', 'tramite_det');
    }

    public function down()
    {
        Schema::rename('tramite_det', 'tramite_detalles');
    }
};
