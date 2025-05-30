<?php

namespace App\Notifications;

use App\Models\Tramite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FacturaSubidaClienteNotification extends Notification
{
    use Queueable;

    public $tramite;

    /**
     * Create a new notification instance.
     */
    public function __construct(Tramite $tramite)
    {
        $this->tramite = $tramite;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('📄 Se ha subido una factura')
            ->greeting('Hola ')
            ->line('El cliente ha subido la factura correspondiente al siguiente trámite:')
            ->line('Número de expediente: ' . $this->tramite->numero_expediente)
            ->action('Ver trámite', url('/tramites/'))
            ->line('Por favor, revisa la documentación.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'tramite_id' => $this->tramite->id,
            'mensaje' => 'Factura subida correctamente.',
        ];
    }
}
