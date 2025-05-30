import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Empleado } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export default function EditarEmpleadoModal({ isOpen, onClose, empleado }: { isOpen: boolean; onClose: () => void; empleado: Empleado }) {
    const { data, setData, post, processing, errors } = useForm<Empleado>({
        name: empleado?.user?.name || '',
        email: empleado?.user?.email || '',
        dni: empleado?.dni || '',
        foto: null,
        celular: empleado?.celular || '',
        cargo: empleado?.cargo || '',
        direccion: empleado?.direccion || '',
    });
    const [fotoPreview, setFotoPreview] = useState<string | null>(empleado?.foto ? `/storage/${empleado.foto}` : null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setFotoPreview(URL.createObjectURL(file)); // Mostrar la imagen seleccionada
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('empleado.update', empleado));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Empleado</DialogTitle>
                    <DialogDescription>Los campos con * son obligatorios y sin eso opcionales.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Campo para nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
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
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Campo para email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
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
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Campo para foto */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="foto" className="text-right">
                                Foto <span className="text-lg text-red-500">*</span>
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
                            <InputError message={errors.foto} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dni" className="text-right">
                                DNI
                            </Label>
                            <Input
                                id="dni"
                                type="text"
                                value={data.dni}
                                onChange={(e) => setData('dni', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="DNI del empleado"
                            />
                            <InputError message={errors.dni} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="celular" className="text-right">
                                Celular
                            </Label>
                            <Input
                                id="celular"
                                type="text"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Número de celular"
                            />
                            <InputError message={errors.celular} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cargo" className="text-right">
                                Cargo
                            </Label>
                            <Input
                                id="cargo"
                                type="text"
                                value={data.cargo}
                                onChange={(e) => setData('cargo', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Cargo del empleado"
                            />
                            <InputError message={errors.cargo} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="direccion" className="text-right">
                                Dirección
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
                            <InputError message={errors.direccion} className="mt-2" />
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
