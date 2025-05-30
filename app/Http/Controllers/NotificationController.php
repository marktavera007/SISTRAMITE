<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function fetch()
    {
        // Verificar si el usuario tiene notificaciones
        $user = Auth::user();

        if ($user->notifications->isEmpty()) {
            return response()->json(['message' => 'No hay notificaciones'], 200);
        }

        // Mapear las notificaciones
        $notificaciones = $user->notifications->map(function ($noti) {
            return [
                'mensaje' => $noti->data['mensaje'],
                'url' => $noti->data['url'],
                'leida' => (bool) $noti->read_at,
            ];
        });

        // Retornar las notificaciones en formato JSON
        return response()->json($notificaciones);
    }
}
