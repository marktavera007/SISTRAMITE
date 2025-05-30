import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Empleado } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function CrearEmpleadoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { data, setData, processing, errors } = useForm<Empleado>({
        name: '',
        email: '',
        password: '',
        dni: '',
        foto: null,
        celular: '',
        cargo: '',
        direccion: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // post(route('empleado.store'), {
        //     onSuccess: () => {
        //         reset();
        //         onClose();
        //     },
        // });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Empleado</DialogTitle>
                    <DialogDescription>Complete los datos del empleado y haga clic en "Crear" para agregarlo al sistema.</DialogDescription>
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

                        {/* Campo para contraseña */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Contraseña"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        {/* Campo para foto */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="foto" className="text-right">
                                Foto
                            </Label>
                            <Input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setData('foto', e.target.files[0]); // Guardamos el archivo directamente
                                    }
                                }}
                                disabled={processing}
                                className="col-span-3"
                            />
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
                            Crear empleado
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
