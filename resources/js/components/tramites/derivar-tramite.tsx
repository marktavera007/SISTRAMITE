import { Label } from '@/components/ui/label';
import { Tramite } from '@/types';
import { useForm } from '@inertiajs/react';

import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type EmpleadoLocal = {
    id: number;
    dni?: string;
    user: {
        id: string;
        name: string;
    };
    user_id: number;
};

type Props = {
    tramite: Tramite;
    empleados: EmpleadoLocal[];
    isOpen: boolean;
    onClose: () => void;
};

const DerivarModal: React.FC<Props> = ({ tramite, empleados, isOpen, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm<{
        empleado_id: string;
        oc_aprobacioncompras: boolean;
    }>({
        empleado_id: '',
        oc_aprobacioncompras: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('tramite.derivar', tramite), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="hidden">
                    <DialogTitle>Derivar orden {tramite.numero_expediente}</DialogTitle>
                    <DialogDescription>Selecciona el empleado para derivar la Orden.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-2 block font-medium">Empleado responsable</Label>
                        <Select value={data.empleado_id} onValueChange={(value) => setData('empleado_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un empleado" />
                            </SelectTrigger>
                            <SelectContent>
                                {empleados.map((empleado) => (
                                    <SelectItem key={empleado.id} value={empleado.id.toString()}>
                                        {empleado.user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.empleado_id && <p className="text-sm text-red-500">{errors.empleado_id}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="oc_aprobacioncompras"
                            checked={data.oc_aprobacioncompras}
                            onCheckedChange={(checked) => setData('oc_aprobacioncompras', checked === true)}
                        />
                        <Label htmlFor="oc_aprobacioncompras">Aprobar orden de compras</Label>
                    </div>
                    {errors.oc_aprobacioncompras && <p className="text-sm text-red-500">{errors.oc_aprobacioncompras}</p>}

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
                            {processing ? 'Aprobando...' : 'Aprobar'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DerivarModal;
