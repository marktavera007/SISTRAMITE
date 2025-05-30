import CrearClienteModal from '@/components/clientes/crear-modal';
import EditarClienteModal from '@/components/clientes/editar-modal';
import TextLink from '@/components/text-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Cliente, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Clientes',
        href: '/empleados',
    },
];

type EmpleadosProps = {
    cargo: string;
    id: number;
    name: string;
};
export default function Clientes({ empleados, clientes }: { clientes: Cliente[]; empleados: EmpleadosProps[] }) {
    const { auth } = usePage<SharedData>().props;

    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

    const openCrearModal = () => setIsCrearModalOpen(true);
    const closeCrearModal = () => setIsCrearModalOpen(false);

    const openEditarModal = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setIsEditarModalOpen(true);
    };
    const closeEditarModal = () => {
        setClienteSeleccionado(null); // Resetea el estado del empleado seleccionado
        setIsEditarModalOpen(false);
    };

    const getFotoUrl = (foto: string | File | null) => {
        if (foto instanceof File) {
            return URL.createObjectURL(foto); // Si es un File, lo convertimos a URL
        }
        return foto || ''; // Si ya es un string, lo usamos directamente, o un string vacío si es null
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empleados" />
            <div className="p-10">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Gestión de Proveedores</h3>

                    {auth.user.role === 'empleado' && (
                        <button
                            onClick={openCrearModal}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#ED8F0B] px-4 py-1.5 text-sm text-white no-underline"
                        >
                            {' '}
                            <Plus className="h-4 w-4" />
                            Crear cliente
                        </button>
                    )}
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <Table>
                        <TableHeader className="bg-neutral-100">
                            <TableRow className="border-neutral-200 hover:bg-neutral-100">
                                <TableHead>ID</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Dni</TableHead>
                                <TableHead>Celular</TableHead>
                                <TableHead>Ruc</TableHead>
                                <TableHead>Registrado</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => {
                                    return (
                                        <TableRow key={cliente.id}>
                                            <TableCell>{cliente.id}</TableCell>
                                            <TableCell>
                                                {cliente.foto ? (
                                                    <Avatar>
                                                        <AvatarImage src={`/storage/${getFotoUrl(cliente.foto)}`} alt="@shadcn" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <>sin imagen</>
                                                )}
                                            </TableCell>
                                            <TableCell>{cliente.user?.name}</TableCell>
                                            <TableCell>{cliente.user?.email}</TableCell>
                                            <TableCell>{cliente.dni}</TableCell>
                                            <TableCell>{cliente.celular}</TableCell>
                                            <TableCell>{cliente.ruc}</TableCell>
                                            <TableCell>
                                                {' '}
                                                {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : 'No registrado'}
                                            </TableCell>
                                            <TableCell>
                                                {cliente.user?.is_active ? (
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
                                                <button onClick={() => openEditarModal(cliente)} className="cursor-pointer">
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <TextLink href={route('cliente.destroy', [cliente])} className="cursor-pointer" method="delete">
                                                    <Trash className="h-4 w-4" />
                                                </TextLink>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="py-4 text-center">
                                        No hay clientes registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <CrearClienteModal isOpen={isCrearModalOpen} onClose={closeCrearModal} empleados={empleados} />
                {clienteSeleccionado && (
                    <EditarClienteModal isOpen={isEditarModalOpen} onClose={closeEditarModal} cliente={clienteSeleccionado} empleados={empleados} />
                )}
            </div>
        </AppLayout>
    );
}
