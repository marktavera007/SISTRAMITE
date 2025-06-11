import { BellIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface Notificacion {
    mensaje: string;
    url: string;
    leida: boolean;
}

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            setLoading(true);
            try {
                const res = await fetch('/user/notifications');
                if (!res.ok) {
                    throw new Error('Error al cargar notificaciones');
                }
                const data = await res.json();

                if (Array.isArray(data)) {
                    setNotificaciones(data);
                } else if (Array.isArray(data.notifications)) {
                    setNotificaciones(data.notifications);
                } else {
                    // console.error('Formato inesperado de notificaciones:', data);
                    setNotificaciones([]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificaciones();
    }, []);

    // Filtramos las notificaciones no leídas
    const notificacionesNoLeidas = notificaciones.filter((noti) => !noti.leida);
    console.log(notificaciones);

    return (
        <div className="relative">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="relative cursor-pointer">
                        {/* Icono de notificación */}
                        <BellIcon className="h-6 w-6 text-gray-50" />

                        {/* Contador de notificaciones no leídas */}
                        {notificacionesNoLeidas.length > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {notificacionesNoLeidas.length}
                            </span>
                        )}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="mt-5 mr-6 w-80 rounded-lg bg-white p-4 shadow-lg">
                    <h3 className="text-lg font-semibold">Notificaciones</h3>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : notificaciones.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                            {notificaciones.map((noti, index) => (
                                <li key={index} className={`rounded-lg p-2 ${noti.leida ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                    <a href={noti.url} className="block text-sm text-blue-600">
                                        {noti.mensaje}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay notificaciones.</p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Notificaciones;
