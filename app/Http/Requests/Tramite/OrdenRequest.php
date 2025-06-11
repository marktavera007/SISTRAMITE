<?php

namespace App\Http\Requests\Tramite;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class OrdenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check(); // Asegura que el usuario esté autenticado
    }

    public function rules(): array
    {
        return [
            'cliente_id'       => 'required|exists:clientes,id',
            'nota_ingreso'     => 'nullable|string|max:255',
            'orden_compra'     => 'nullable|string|max:255',
            'numero_factura'   => 'nullable|string|max:255',
            'tipo_documento' => 'required|string|max:255',
            'dias_respuesta'   => 'nullable|integer|min:1',
            'documento_subido' => 'nullable|file|mimes:pdf|max:2048',

            'oc_ccodmon'       => 'nullable|string|max:50',
            'oc_cfacdirec'     => 'nullable|string|max:255',
            'oc_cfacnombre'    => 'nullable|string|max:255',
            'oc_cfacruc'       => 'nullable|string|max:20',
            'oc_cforpag'       => 'nullable|string|max:100',
            'oc_dfecdoc'       => 'nullable|string|max:100',

            'productos'                     => 'required|array',
            'productos.*.oc_ccodigo'        => 'required|string|max:100',
            'productos.*.oc_cdesref'        => 'required|string|max:255',
            'productos.*.oc_citem'          => 'required|string|max:50',
            'productos.*.oc_ncantid'        => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'cliente_id.required' => 'Debe seleccionar un cliente.',
            'cliente_id.exists'   => 'El cliente seleccionado no existe.',
            'documento_subido.mimes' => 'El documento debe ser un archivo PDF.',
            'documento_subido.max'   => 'El documento no debe superar los 2MB.',
            'dias_respuesta.min'     => 'Los días de respuesta deben ser al menos 1.',
            'tipo_documento.required' => 'Debe seleccionar un tipo de documento.',

            'productos.*.oc_ccodigo.required' => 'El código del producto es obligatorio.',
            'productos.*.oc_cdesref.required' => 'La descripción del producto es obligatoria.',
            'productos.*.oc_citem.required'   => 'El ítem del producto es obligatorio.',
            'productos.*.oc_ncantid.required' => 'La cantidad del producto es obligatoria.',
            'productos.*.oc_ncantid.numeric'  => 'La cantidad del producto debe ser un número.',
            'productos.required' => 'Debe agregar al menos un producto y completar todos sus campos.',
            'productos.array' => 'Debe agregar al menos un producto y completar todos sus campos.',


        ];
    }
}
