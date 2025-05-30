<?php

namespace App\Notifications;

use App\Models\Tramite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TramiteDerivadoNotification extends Notification
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
            ->subject('Nuevo trámite asignado')
            ->greeting('Hola ' . $notifiable->name . ',')
            ->line('Se te ha asignado un nuevo trámite.')
            ->line('Área de destino: ' . optional($this->tramite->areaDestino)->nombre)
            ->line('Nota de ingreso: ' . ($this->tramite->nota_ingreso ?? 'Ninguna'))
            ->action('Ver trámite', url('/tramites/'))
            ->line('Por favor revisa y gestiona este trámite a la brevedad.');
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
            'cliente' => optional($this->tramite->cliente)->nombre,
            'area_destino' => optional($this->tramite->areaDestino)->nombre,
        ];
    }
}
