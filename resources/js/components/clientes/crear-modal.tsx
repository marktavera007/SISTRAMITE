import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cliente } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

type EmpleadosProps = {
    cargo: string;
    id: number;
    name: string;
};

export default function CrearClienteModal({ isOpen, onClose, empleados }: { isOpen: boolean; onClose: () => void; empleados: EmpleadosProps[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<Cliente>({
        name: '',
        email: '',
        empleado_id: '',
        password: '',
        ruc: '',
        dni: '',
        foto: null,
        celular: '',
        direccion: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('cliente.store'), {
            onSuccess: () => {
                reset(); // Limpiar el formulario
                onClose(); // Cerrar el modal
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-[80vh] overflow-y-auto rounded-2xl border-none sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Proveedor</DialogTitle>
                    <DialogDescription>Complete los datos del proveedor y haga clic en "Crear" para agregarlo al sistema.</DialogDescription>
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

                        {/* Campo para contraseña */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Contraseña <span className="text-lg text-red-500">*</span>
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
                            <InputError message={errors.password} className="col-span-4 col-start-2" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right leading-snug">
                                Asignar un empleado <span className="text-lg text-red-500">*</span>
                            </Label>
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
                            Crear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
