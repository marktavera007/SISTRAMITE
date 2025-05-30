import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Area } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function EditarAreaModal({ isOpen, onClose, area }: { isOpen: boolean; onClose: () => void; area: Area }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: area.nombre,
        estado: area.estado ? 1 : 0, // Estado inicial como 1 (activo)
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('area.update', area), {
            onSuccess: () => onClose(), // Cierra el modal después de enviar
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Área</DialogTitle>
                    <DialogDescription>Ingrese el nombre y seleccione el estado del área.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Campo para nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Nombre del área"
                            />
                            <InputError message={errors.nombre} className="mt-2" />
                        </div>

                        {/* Campo para estado */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Estado</Label>
                            <Select
                                value={String(data.estado)} // Convertimos el número a string para Select
                                onValueChange={(value) => setData('estado', Number(value))} // Convertimos el string a número
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="1">Activo</SelectItem>
                                        <SelectItem value="0">Inactivo</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.estado} className="mt-2" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
