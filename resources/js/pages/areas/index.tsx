import CrearAreaModal from '@/components/areas/crear-modal';
import EditarAreaModal from '@/components/areas/editar-modal';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { Area, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Areas',
        href: '/areas',
    },
];

type AreasProps = {
    areas: Area[];
};

export default function Areas({ areas }: AreasProps) {
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [areaSeleccionado, setAreaSeleccionado] = useState<Area | null>(null);

    console.log(areas);
    const openCrearModal = () => setIsCrearModalOpen(true);
    const closeCrearModal = () => setIsCrearModalOpen(false);

    const openEditarModal = (area: Area) => {
        setAreaSeleccionado(area);
        setIsEditarModalOpen(true);
    };
    const closeEditarModal = () => {
        setAreaSeleccionado(null); // Resetea el estado del empleado seleccionado
        setIsEditarModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empleados" />
            <div className="p-10">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Gestión de Áreas</h3>

                    <button
                        onClick={openCrearModal}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#ED8F0B] px-4 py-1.5 text-sm text-white no-underline"
                    >
                        <Plus className="h-4 w-4" />
                        Crear Área
                    </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <Table>
                        <TableHeader className="bg-neutral-100">
                            <TableRow className="border-neutral-200 hover:bg-neutral-100">
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Registrado</TableHead>

                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areas.length > 0 ? (
                                areas.map((area) => {
                                    return (
                                        <TableRow key={area.id}>
                                            <TableCell>{area.id}</TableCell>

                                            <TableCell>{area.nombre}</TableCell>
                                            <TableCell>
                                                {' '}
                                                {area.created_at ? new Date(area.created_at).toLocaleDateString() : 'No registrado'}
                                            </TableCell>
                                            <TableCell>
                                                {area.estado ? (
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
                                                <button onClick={() => openEditarModal(area)}>
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <TextLink href={route('area.destroy', [area])} className="cursor-pointer" method="delete">
                                                    <Trash className="h-4 w-4" />
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

                <CrearAreaModal isOpen={isCrearModalOpen} onClose={closeCrearModal} />
                {areaSeleccionado && <EditarAreaModal isOpen={isEditarModalOpen} onClose={closeEditarModal} area={areaSeleccionado} />}
            </div>
        </AppLayout>
    );
}
