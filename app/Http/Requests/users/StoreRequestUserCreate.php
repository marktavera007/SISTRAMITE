<?php

namespace App\Http\Requests\users;

use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreRequestUserCreate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::Check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(optional($this->user())->id),
            ],

            'role' => [
                'required',
                'string',
                Rule::in(['administrador', 'empleado', 'cliente']),
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            // Foto es opcional pero debe ser imagen si se envía
            'foto' => ['nullable', 'image', 'max:2048'], // Máximo 2MB
        ];

        // Reglas para EMPLEADO
        if ($this->role === 'empleado') {
            $rules = array_merge($rules, [
                'dni' => [
                    'required',
                    'numeric',
                    'digits:8', // Validación de exactamente 8 dígitos
                    Rule::unique(Empleado::class), // Si es necesario
                ],

                'celular' => [
                    'required',
                    'numeric',
                    'digits:9', // Validación de exactamente 8 dígitos
                    Rule::unique(Empleado::class), // Si es necesario
                ],
                'direccion' => ['required', 'string', 'max:255'],
                'cargo' => ['required', 'string', 'max:100'],
            ]);
        }

        // Reglas para CLIENTE
        if ($this->role === 'cliente') {
            $rules = array_merge($rules, [
                'dni' => [
                    'required',
                    'numeric',
                    'digits:8', // Validación de exactamente 8 dígitos
                    Rule::unique(Empleado::class), // Si es necesario
                ],

                'celular' => [
                    'required',
                    'numeric',
                    'digits:9', // Validación de exactamente 8 dígitos
                    Rule::unique(Empleado::class), // Si es necesario
                ],
                'direccion' => ['required', 'string', 'max:255'],
                'ruc' => [
                    'required',
                    'numeric',
                    'digits:11', // Validación de exactamente 8 dígitos
                    Rule::unique(Cliente::class), // Si es necesario
                ],
                'empleado_id' => ['required', 'exists:empleados,id'],
            ]);
        }

        return $rules;
    }
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico no tiene un formato válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'role.required' => 'El rol es obligatorio.',
            'role.in' => 'El rol seleccionado no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'foto.image' => 'El archivo debe ser una imagen.',
            'foto.max' => 'La imagen no debe superar los 2MB.',

            // Empleado
            'dni.required' => 'El DNI es obligatorio.',
            'dni.numeric' => 'El DNI solo debe contener números.',
            'dni.digits' => 'El DNI debe tener exactamente 8 dígitos.',
            'dni.unique' => 'El DNI ya está registrado.',


            'celular.required' => 'El número de celular es obligatorio.',
            'celular.numeric' => 'El número solo debe contener números.',
            'celular.digits' => 'El número debe tener exactamente 9 dígitos.',
            'celular.unique' => 'El número ya está registrado.',
            'direccion.required' => 'La dirección es obligatoria.',
            'cargo.required' => 'El cargo es obligatorio.',

            // Cliente
            'ruc.required' => 'El RUC es obligatorio.',
            'ruc.numeric' => 'El RUC solo debe contener números.',
            'ruc.digits' => 'El RUC debe tener exactamente 11 dígitos.',
            'ruc.unique' => 'El RUC ya está registrado.',
            'empleado_id.required' => 'Debe seleccionar un empleado.',
            'empleado_id.exists' => 'El empleado seleccionado no es válido.',
        ];
    }
}
