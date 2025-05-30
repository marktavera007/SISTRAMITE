<?php

namespace App\Http\Requests\clientes;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $cliente = $this->route('cliente');

        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($cliente->user_id),
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
            ],

            'dni' => [
                'required',
                'numeric',
                'digits:8',
                Rule::unique(Cliente::class)->ignore($cliente->id),
            ],

            'celular' => [
                'required',
                'numeric',
                'digits:9',
                Rule::unique(Cliente::class)->ignore($cliente->id),
            ],

            'direccion' => ['required', 'string', 'max:255'],

            'ruc' => [
                'nullable',
                'numeric',
                'digits:11',
                Rule::unique(Cliente::class)->ignore($cliente->id),
            ],

            'empleado_id' => ['required', 'exists:empleados,id'],

            'foto' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico no tiene un formato válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'dni.required' => 'El DNI es obligatorio.',
            'dni.numeric' => 'El DNI solo debe contener números.',
            'dni.digits' => 'El DNI debe tener exactamente 8 dígitos.',
            'dni.unique' => 'El DNI ya está registrado.',
            'celular.required' => 'El número de celular es obligatorio.',
            'celular.numeric' => 'El número solo debe contener números.',
            'celular.digits' => 'El número debe tener exactamente 9 dígitos.',
            'celular.unique' => 'El número ya está registrado.',
            'direccion.required' => 'La dirección es obligatoria.',
            'ruc.numeric' => 'El RUC solo debe contener números.',
            'ruc.digits' => 'El RUC debe tener exactamente 11 dígitos.',
            'ruc.unique' => 'El RUC ya está registrado.',
            'empleado_id.required' => 'Debe seleccionar un empleado.',
            'empleado_id.exists' => 'El empleado seleccionado no es válido.',
            'foto.image' => 'El archivo debe ser una imagen.',
            'foto.max' => 'La imagen no debe superar los 2MB.',
        ];
    }
}
