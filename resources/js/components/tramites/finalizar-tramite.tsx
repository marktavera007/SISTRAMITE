import { router } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

type FinalizarButtonProps = {
    tramite: {
        id?: number | string;
        estado: string;
    };
};

export default function FinalizarButton({ tramite }: FinalizarButtonProps) {
    const handleFinalizar = () => {
        if (confirm('¿Estás seguro de finalizar este trámite?')) {
            router.post(route('tramite.finalizar', tramite.id));
        }
    };

    if (tramite.estado === 'finalizado') return null;

    return (
        <Button size="sm" className="h-8 cursor-pointer bg-emerald-600 px-2.5 py-0 text-xs text-white hover:bg-emerald-600" onClick={handleFinalizar}>
            <CheckCircle className="h-3 w-3" />
            <span>Finalizar</span>
        </Button>
    );
}
