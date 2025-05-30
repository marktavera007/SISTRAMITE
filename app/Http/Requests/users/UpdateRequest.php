<?php

namespace App\Http\Requests\users;

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
        return Auth::Check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Accedemos al usuario desde la ruta
        $usuario = $this->route('usuario');

        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($usuario->id), // Ignorar el ID del usuario actual
            ],
            'role' => [
                'required',
                'string',
                Rule::in(['administrador', 'empleado', 'cliente']), // Solo acepta estos valores
            ],
            'is_active' => ['required', 'boolean'], // Asegura que solo acepte true o false

        ];
    }
}
