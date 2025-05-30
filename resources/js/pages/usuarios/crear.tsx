import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Volver from '@/components/Volver';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crear Usuario',
        href: '/usuarios/crear',
    },
];

type UserForm = {
    name: string;
    email: string;
    password: string;
    role: string;
    // Campos específicos de empleado
    dni?: string;
    foto?: File | null;
    celular?: string;
    cargo?: string;
    direccion?: string;
    // Campos específicos de cliente
    ruc?: string;
    empleado_id?: number | string;
};

type EmpleadosCrear = {
    cargo: string;
    id: number;
    name: string;
};

type EmpleadosProps = {
    empleados: EmpleadosCrear[];
};

export default function CrearUsuario({ empleados }: EmpleadosProps) {
    const { data, setData, post, processing, errors } = useForm<UserForm>({
        name: '',
        email: '',
        password: '',
        role: '',
        dni: '',
        foto: null,
        celular: '',
        cargo: '',
        direccion: '',
        ruc: '',
        empleado_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <Volver />
            <h3 className="px-10 py-6 text-lg font-medium">Crear una cuenta de Usuario</h3>

            <form className="flex flex-col gap-6 px-10" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-6">
                    {/* Campos comunes a todos los roles */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Nombre completo<span className="pl-0.5 text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} disabled={processing} />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Selector de rol */}
                    <div className="grid gap-2">
                        <Label>Rol del usuario</Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    <SelectItem value="administrador">Administrador</SelectItem>
                                    <SelectItem value="empleado">Empleado</SelectItem>
                                    <SelectItem value="cliente">Cliente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    {/* Campos específicos para Empleado */}
                    {data.role === 'empleado' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                    pattern="[0-9]*"
                                    value={data.dni}
                                    onChange={(e) => setData('dni', e.target.value.replace(/\D/g, ''))}
                                />
                                <InputError message={errors.dni} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cargo">Cargo</Label>
                                <Input id="cargo" type="text" value={data.cargo} onChange={(e) => setData('cargo', e.target.value)} />
                                <InputError message={errors.cargo} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="celular">Celular</Label>
                                <Input
                                    id="celular"
                                    type="text"
                                    inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                    pattern="[0-9]*"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value.replace(/\D/g, ''))}
                                />
                                <InputError message={errors.celular} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input id="direccion" type="text" value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} />
                                <InputError message={errors.direccion} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="foto">Foto</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('foto', e.target.files[0]);
                                        }
                                    }}
                                />
                                <InputError message={errors.foto} />
                            </div>
                        </>
                    )}

                    {/* Campos específicos para Cliente */}
                    {data.role === 'cliente' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                    pattern="[0-9]*"
                                    value={data.dni}
                                    onChange={(e) => setData('dni', e.target.value.replace(/\D/g, ''))}
                                />
                                <InputError message={errors.dni} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="celular">Celular</Label>
                                <Input id="celular" type="text" value={data.celular} onChange={(e) => setData('celular', e.target.value)} />
                                <InputError message={errors.celular} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input id="direccion" type="text" value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} />
                                <InputError message={errors.direccion} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="foto">Foto</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setData('foto', e.target.files[0]);
                                        }
                                    }}
                                />
                                <InputError message={errors.foto} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ruc">RUC</Label>
                                <Input
                                    id="ruc"
                                    type="text"
                                    inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                                    pattern="[0-9]*"
                                    value={data.ruc}
                                    onChange={(e) => setData('ruc', e.target.value.replace(/\D/g, ''))}
                                />
                                <InputError message={errors.ruc} />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-left">Asignar un empleado</Label>
                                <Select value={String(data.empleado_id)} onValueChange={(value) => setData('empleado_id', Number(value))}>
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Empleados</SelectLabel>
                                            {empleados.map((empleado: EmpleadosCrear) => (
                                                <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                    {empleado.name} ({empleado.cargo})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.empleado_id} className="mt-2" />
                            </div>
                        </>
                    )}
                </div>
                <Button type="submit" disabled={processing} className="w-fit cursor-pointer bg-[#ED8F0B] hover:bg-[#ED8F0B]">
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Cuenta
                </Button>
            </form>
        </AppLayout>
    );
}
