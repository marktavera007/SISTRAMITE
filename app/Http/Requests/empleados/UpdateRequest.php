<?php

namespace App\Http\Requests\empleados;

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
        // Obtener el empleado desde la ruta
        $empleado = $this->route('empleado');

        return [
            'dni' => 'required|digits:8',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048', // Reglas para la imagen
            'celular' => 'required|digits_between:9,15',
            'cargo' => 'required|string|max:100|regex:/^[\pL\s]+$/u',
            'direccion' => 'required|string|max:255',
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($empleado->user->id), // Ignorar el ID del usuario asociado
            ],
        ];
    }
}
