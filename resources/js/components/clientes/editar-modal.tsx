import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cliente } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

type EmpleadosProps = {
    cargo: string;
    id: number;
    name: string;
};
export default function EditarClienteModal({
    isOpen,
    onClose,
    empleados,
    cliente,
}: {
    isOpen: boolean;
    onClose: () => void;
    empleados: EmpleadosProps[];
    cliente: Cliente;
}) {
    const { data, setData, post, processing, errors } = useForm<Cliente>({
        name: cliente?.user?.name || '',
        email: cliente?.user?.email || '',
        dni: cliente?.dni || '',
        empleado_id: String(cliente.empleado_id) || '',
        foto: null,
        celular: cliente?.celular || '',
        ruc: cliente?.ruc || '',
        direccion: cliente?.direccion || '',
    });
    const [fotoPreview, setFotoPreview] = useState<string | null>(cliente?.foto ? `/storage/${cliente.foto}` : null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setFotoPreview(URL.createObjectURL(file)); // Mostrar la imagen seleccionada
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cliente.update', cliente), {
            onSuccess: () => {
                onClose(); // Cerrar el modal
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-[70vh] overflow-y-auto rounded-2xl border-none sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Proveedor</DialogTitle>
                    <DialogDescription>Los campos con * son obligatorios y sin eso opcionales.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Campo para nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Nombre del empleado"
                            />
                            <InputError message={errors.name} className="col-span-4 col-start-2" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ruc" className="text-right">
                                Ruc <span className="text-lg text-red-500">*</span>
                            </Label>

                            <Input
                                id="ruc"
                                type="text"
                                inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                pattern="[0-9]*"
                                disabled={processing}
                                value={data.ruc}
                                onChange={(e) => setData('ruc', e.target.value.replace(/\D/g, ''))}
                                className="col-span-3"
                                placeholder="Escriba aquí"
                            />
                            <InputError message={errors.ruc} className="col-span-4 col-start-2" />
                        </div>

                        {/* Campo para email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Correo electrónico"
                            />
                            <InputError message={errors.email} className="col-span-4 col-start-2" />
                        </div>

                        {/* Campo para foto */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="foto" className="text-right">
                                Foto
                            </Label>
                            <div className="col-span-3 flex flex-col items-start gap-4">
                                {/* Mostrar la imagen actual si existe */}
                                {fotoPreview && <img src={fotoPreview} alt="Foto actual" className="h-16 w-16 rounded-full object-cover" />}
                                {/* Input para cargar una nueva foto */}
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={processing}
                                    className="col-span-3"
                                />
                            </div>
                            <InputError message={errors.foto} className="col-span-4 col-start-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dni" className="text-right">
                                DNI <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="dni"
                                type="text"
                                inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                pattern="[0-9]*"
                                disabled={processing}
                                value={data.dni}
                                onChange={(e) => setData('dni', e.target.value.replace(/\D/g, ''))}
                                className="col-span-3"
                                placeholder="DNI del empleado"
                            />
                            <InputError message={errors.dni} className="col-span-4 col-start-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="celular" className="text-right">
                                Celular <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="celular"
                                type="text"
                                inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                pattern="[0-9]*"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value.replace(/\D/g, ''))}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Número de celular"
                            />
                            <InputError message={errors.celular} className="col-span-4 col-start-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right leading-snug">Asignar un empleado</Label>
                            <Select value={String(data.empleado_id)} onValueChange={(value) => setData('empleado_id', Number(value))}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Empleados</SelectLabel>
                                        {empleados.map((empleado: EmpleadosProps) => (
                                            <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                {empleado.name} ({empleado.cargo})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.empleado_id} className="col-span-4 col-start-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="direccion" className="text-right">
                                Dirección <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="direccion"
                                type="text"
                                value={data.direccion}
                                onChange={(e) => setData('direccion', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Dirección del empleado"
                            />
                            <InputError message={errors.direccion} className="col-span-4 col-start-2" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
