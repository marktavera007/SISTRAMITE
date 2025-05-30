import CrearEmpleadoModal from '@/components/empleados/crear-modal';
import EditarEmpleadoModal from '@/components/empleados/editar-modal';
import TextLink from '@/components/text-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Empleado, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Empleados',
        href: '/empleados',
    },
];

type EmpleadosProps = {
    empleados: Empleado[];
};
export default function Empleados({ empleados }: EmpleadosProps) {
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);

    // const openCrearModal = () => setIsCrearModalOpen(true);
    const closeCrearModal = () => setIsCrearModalOpen(false);

    const openEditarModal = (empleado: Empleado) => {
        setEmpleadoSeleccionado(empleado);
        setIsEditarModalOpen(true);
    };
    const closeEditarModal = () => {
        setEmpleadoSeleccionado(null); // Resetea el estado del empleado seleccionado
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
                    <h3 className="text-lg font-medium">Gestión de Empleados</h3>

                    {/* <button onClick={openCrearModal}>Crear Empleado</button> */}
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
                                <TableHead>Cargo</TableHead>
                                <TableHead>Registrado</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {empleados.length > 0 ? (
                                empleados.map((empleado) => {
                                    return (
                                        <TableRow key={empleado.id}>
                                            <TableCell>{empleado.id}</TableCell>
                                            <TableCell>
                                                {empleado.foto ? (
                                                    <Avatar>
                                                        <AvatarImage src={`/storage/${getFotoUrl(empleado.foto)}`} alt="@shadcn" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <>sin imagen</>
                                                )}
                                            </TableCell>
                                            <TableCell>{empleado.user?.name}</TableCell>
                                            <TableCell>{empleado.user?.email}</TableCell>
                                            <TableCell>{empleado.dni}</TableCell>
                                            <TableCell>{empleado.celular}</TableCell>
                                            <TableCell>{empleado.cargo}</TableCell>
                                            <TableCell>
                                                {' '}
                                                {empleado.created_at ? new Date(empleado.created_at).toLocaleDateString() : 'No registrado'}
                                            </TableCell>
                                            <TableCell>
                                                {empleado.user?.is_active ? (
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
                                                <button onClick={() => openEditarModal(empleado)}>
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <TextLink href={route('empleado.destroy', [empleado])} className="cursor-pointer" method="delete">
                                                    <Trash className="h-4 w-4" />
                                                </TextLink>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="py-4 text-center">
                                        No hay empleados registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <CrearEmpleadoModal isOpen={isCrearModalOpen} onClose={closeCrearModal} />
                {empleadoSeleccionado && (
                    <EditarEmpleadoModal isOpen={isEditarModalOpen} onClose={closeEditarModal} empleado={empleadoSeleccionado} />
                )}
            </div>
        </AppLayout>
    );
}
