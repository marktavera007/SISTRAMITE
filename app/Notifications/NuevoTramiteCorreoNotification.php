<?php

namespace App\Notifications;

use App\Models\Tramite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevoTramiteCorreoNotification extends Notification
{
    use Queueable;

    protected $tramite;

    public function __construct(Tramite $tramite)
    {
        $this->tramite = $tramite;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nuevo Trámite Creado')
            ->greeting('Hola!')  // Aquí se toma el nombre del objeto
            ->line('Se ha creado un nuevo trámite para su solicitud.')
            ->line('Detalles del trámite:')
            ->line('Número de factura: ' . $this->tramite->numero_factura)
            ->line('Estado: ' . $this->tramite->estado)
            ->action('Ver Trámite', url('/tramites/'))
            ->line('Gracias por usar nuestra plataforma.');
    }
}
