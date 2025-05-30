<?php

namespace App\Notifications;

use App\Models\Tramite;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TramiteFinalizarCorreoNotification extends Notification
{
    use Queueable;

    protected $tramite;

    /**
     * Create a new notification instance.
     */
    public function __construct(Tramite $tramite)
    {
        $this->tramite = $tramite;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
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
            ->subject('Tu trámite ha sido finalizado')
            ->greeting('Hola ' . $notifiable->name . ',')
            ->line('Te informamos que tu trámite con ID #' . $this->tramite->id . ' ha sido finalizado.')
            ->line('Detalles del trámite:')
            ->line('Área de origen: ' . optional($this->tramite->area)->nombre)
            ->line('Área de destino: ' . optional($this->tramite->areaDestino)->nombre)
            ->line('Nota de ingreso: ' . ($this->tramite->nota_ingreso ?? 'Sin nota'))
            ->action('Ver trámite', url('/tramites/'))
            ->line('Gracias por confiar en nosotros.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'tramite_id' => $this->tramite->id,
            'estado' => 'finalizado',
        ];
    }
}
