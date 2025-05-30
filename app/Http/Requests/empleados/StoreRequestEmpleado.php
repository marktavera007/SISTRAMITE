<?php

namespace App\Http\Requests\empleados;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreRequestEmpleado extends FormRequest
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
        return [
            'dni' => 'required|digits:8',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'celular' => 'required|digits_between:9,15',
            'cargo' => 'required|string|max:100|regex:/^[\pL\s]+$/u',
            'direccion' => 'required|string|max:255',
            'password' => [
                'required',
                'string',
                'min:8', // Contraseña mínima de 8 caracteres
            ],
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
