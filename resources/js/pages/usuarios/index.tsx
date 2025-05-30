import TextLink from '@/components/text-link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Usuarios',
        href: '/usuarios',
    },
];

type UsuariosProps = {
    usuarios: User[];
};

export default function Usuarios({ usuarios }: UsuariosProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="p-10">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Gestión de Usuarios</h3>

                    <TextLink
                        href={route('user.crear')}
                        className="flex items-center gap-1.5 rounded-md bg-[#ED8F0B] px-4 py-1.5 text-sm text-white no-underline"
                    >
                        <Plus className="h-4 w-4" />
                        Crear Usuario
                    </TextLink>
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <Table>
                        <TableHeader className="bg-neutral-100">
                            <TableRow className="border-neutral-200 hover:bg-neutral-100">
                                <TableHead className="font-medium text-gray-600">ID</TableHead>
                                <TableHead className="font-medium text-gray-600">Nombre</TableHead>
                                <TableHead className="font-medium text-gray-600">Email</TableHead>
                                <TableHead className="font-medium text-gray-600">Registrado</TableHead>
                                <TableHead className="font-medium text-gray-600">Rol</TableHead>
                                <TableHead className="font-medium text-gray-600">Estado</TableHead>
                                <TableHead className="font-medium text-gray-600">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario) => {
                                    return (
                                        <TableRow key={usuario.id} className="border-neutral-200 hover:bg-gray-100">
                                            <TableCell>{usuario.id}</TableCell>
                                            <TableCell>{usuario.name}</TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>{new Date(usuario.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{usuario.role}</TableCell>
                                            <TableCell>
                                                {usuario.is_active ? (
                                                    <span className="flex max-w-[70px] items-center justify-center rounded-full bg-green-500 px-3 text-xs font-medium text-white">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="flex max-w-[70px] items-center justify-center rounded-full bg-red-500 px-3 text-xs font-medium text-white">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell className="flex items-center gap-4">
                                                <TextLink href={route('user.edit', [usuario])}>
                                                    <Pencil className="h-4 w-4 text-black" />
                                                </TextLink>
                                                <TextLink href={route('user.destroy', [usuario])} className="cursor-pointer" method="delete">
                                                    <Trash className="h-4 w-4 text-black" />
                                                </TextLink>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-4 text-center">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
