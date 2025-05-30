<?php

namespace App\Notifications;

use App\Models\Tramite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevoTramiteNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Tramite $tramite) {}


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Agrega 'database' para que se guarde
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nuevo trámite creado')
            ->greeting('Hola ' . $notifiable->name . ',')
            ->line('Se ha registrado un nuevo trámite: **' . $this->tramite->numero_expediente . '**')
            ->action('Ver trámite', url('/tramites'))
            ->line('Gracias por usar el sistema.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'mensaje' => 'Se creó el trámite: ' . $this->tramite->numero_expediente,
            'url' => '/tramites',
        ];
    }
}
