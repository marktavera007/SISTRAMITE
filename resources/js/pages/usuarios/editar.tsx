import AppLayout from '@/layouts/app-layout';
import { UserEdit, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Usuario',
        href: '/usuarios/editar',
    },
];

export default function EditarUsuario({ usuario }: { usuario: UserEdit }) {
    const { data, setData, post, processing, errors } = useForm<Required<UserEdit>>({
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        is_active: usuario.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user.update', usuario));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Usuarios" />
            <form className="flex flex-col gap-6 p-10" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            autoFocus
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecciona" />
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
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Select value={data.is_active ? 'Activo' : 'Inactivo'} onValueChange={(value) => setData('is_active', value === 'Activo')}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Estado</SelectLabel>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_active} className="mt-2" />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
