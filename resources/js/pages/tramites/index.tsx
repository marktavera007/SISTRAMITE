import CrearTramiteModal from '@/components/tramites/crear-modal';
import DerivarModal from '@/components/tramites/derivar-tramite';
import FinalizarButton from '@/components/tramites/finalizar-tramite';
import { InvoiceUploadCell } from '@/components/tramites/subir-factura';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { SharedData, Tramite, TramiteDetail, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowRight, FileDown, FileText, Plus } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Órdenes',
        href: '/areas',
    },
];

type ClienteLocal = {
    id: number;
    dni?: string;
    ruc?: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    user_id: number;
};
type EmpleadoLocal = {
    id: number;
    dni?: string;
    user: {
        id: string;
        name: string;
    };
    user_id: number;
};

type AreaLocal = {
    id: number;
    nombre: string;
};
type SeguimientoTramite = {
    id: number; // ID autoincrementable
    tramite_id: number; // Relación con la tabla tramites
    area_id: number; // Relación con la tabla areas
    empleado_id: number; // Relación con la tabla empleados
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' | 'derivado'; // Estado del trámite
    fecha_derivacion: string | null; // Fecha de derivación, puede ser nula
    created_at: string; // Fecha de creación
    updated_at: string; // Fecha de actualización
};

type Props = {
    areas: AreaLocal[];
    clientes: ClienteLocal[];
    tramite: Tramite[];
    empleados: EmpleadoLocal[];
    seguimientosTramite: SeguimientoTramite[];
    detalleTramite: TramiteDetail[];
};

export default function Tramites({
    clientes,
    areas,
    tramite,
    empleados,
    seguimientosTramite = [], // Valor por defecto
}: Props) {
    const { auth } = usePage<SharedData>().props;

    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);
    const [derivarModalOpen, setDerivarModalOpen] = useState(false);
    const openCrearModal = () => setIsCrearModalOpen(true);
    const closeCrearModal = () => setIsCrearModalOpen(false);

    const openDerivarModal = (tramite: Tramite) => {
        setTramiteSeleccionado(tramite);
        setDerivarModalOpen(true);
    };
    const closeDerivarModal = () => {
        setTramiteSeleccionado(null); // Resetea el estado del empleado seleccionado
        setDerivarModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empleados" />
            <div className="p-10">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Gestión de Órdenes</h3>
                    {auth.user.role === 'empleado' && (
                        <button
                            onClick={openCrearModal}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-800 px-4 py-1.5 text-sm text-white no-underline"
                        >
                            {' '}
                            <Plus className="h-4 w-4" />
                            Crear Trámite
                        </button>
                    )}
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <Table>
                        <TableHeader className="bg-neutral-100">
                            <TableRow className="border-neutral-200 hover:bg-neutral-100">
                                <TableHead>N° Expediente</TableHead>
                                <TableHead>Registrado</TableHead>
                                <TableHead>Creado por</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Area</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Días Transc. </TableHead>
                                <TableHead>Días de Respu. </TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tramite.length > 0 ? (
                                tramite.map((tramite) => {
                                    return (
                                        <TableRow key={tramite.id}>
                                            <TableCell>{tramite.numero_expediente}</TableCell>
                                            <TableCell>
                                                {tramite.created_at
                                                    ? new Date(tramite.created_at).toLocaleString() // Cambié a toLocaleString()
                                                    : 'No registrado'}
                                            </TableCell>
                                            <TableCell>{tramite.creador?.nombre}</TableCell>
                                            <TableCell>{tramite.cliente.user.name}</TableCell>
                                            <TableCell>{tramite.area_destino_nombre}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const estadoMap = {
                                                        pendiente: {
                                                            text: 'Pendiente',
                                                            bg: 'bg-yellow-500',
                                                        },
                                                        en_proceso: {
                                                            text: 'En Proceso',
                                                            bg: 'bg-blue-500',
                                                        },
                                                        completado: {
                                                            text: 'Completado',
                                                            bg: 'bg-green-500',
                                                        },
                                                        cancelado: {
                                                            text: 'Cancelado',
                                                            bg: 'bg-red-500',
                                                        },
                                                        derivado: {
                                                            text: 'Derivado',
                                                            bg: 'bg-purple-500', // Puedes cambiar el color según lo que necesites
                                                        },
                                                    };

                                                    const estado = estadoMap[tramite.estado] || {
                                                        text: 'Desconocido',
                                                        bg: 'bg-gray-500',
                                                    };

                                                    return (
                                                        <span
                                                            className={`flex max-w-[80px] items-center justify-center rounded-full ${estado.bg} px-3 text-xs font-medium text-white`}
                                                        >
                                                            {estado.text}
                                                        </span>
                                                    );
                                                })()}
                                            </TableCell>

                                            <TableCell>
                                                {Math.floor(Number(tramite.dias_pasados))}{' '}
                                                {Math.floor(Number(tramite.dias_pasados)) === 1 ? 'día' : 'días'}
                                            </TableCell>
                                            <TableCell>
                                                {tramite.dias_respuesta} {tramite.dias_respuesta === '1' ? 'día' : 'días'}
                                            </TableCell>

                                            <TableCell className="flex items-center gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="cursor-pointer text-xs">
                                                            Ver más
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
                                                        <DialogHeader>
                                                            <DialogTitle>{tramite.numero_expediente}</DialogTitle>
                                                            <DialogDescription>Consulte los detalles del trámite y del remitente.</DialogDescription>
                                                        </DialogHeader>

                                                        <Tabs defaultValue="tramite" className="w-full">
                                                            <TabsList className="grid w-full grid-cols-4">
                                                                <TabsTrigger value="tramite" className="cursor-pointer">
                                                                    Datos de la Orden
                                                                </TabsTrigger>
                                                                <TabsTrigger value="remitente" className="cursor-pointer">
                                                                    Remitente
                                                                </TabsTrigger>
                                                                <TabsTrigger value="detalle" className="cursor-pointer">
                                                                    Detalle
                                                                </TabsTrigger>
                                                                <TabsTrigger value="seguimiento" className="cursor-pointer">
                                                                    Seguimiento
                                                                </TabsTrigger>
                                                            </TabsList>

                                                            <TabsContent value="tramite">
                                                                <Card>
                                                                    <CardContent className="space-y-6">
                                                                        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-muted-foreground text-sm font-medium">
                                                                                Información Básica
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                                                <div className="space-y-3">
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Expediente
                                                                                        </p>
                                                                                        <p className="text-sm">{tramite.numero_expediente}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Creado por
                                                                                        </p>
                                                                                        <p className="text-sm">{tramite.creador?.nombre}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="space-y-3">
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Fecha
                                                                                        </p>
                                                                                        <p className="text-sm">
                                                                                            {tramite.created_at
                                                                                                ? new Date(tramite.created_at).toLocaleString()
                                                                                                : 'No registrado'}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Tipo de Trámite
                                                                                        </p>
                                                                                        <p className="text-sm">{tramite.tipo_documento}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="space-y-3">
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Estado
                                                                                        </p>
                                                                                        <p className="text-sm">
                                                                                            {(() => {
                                                                                                const estadoMap = {
                                                                                                    pendiente: {
                                                                                                        text: 'Pendiente',
                                                                                                        bg: 'bg-yellow-500',
                                                                                                    },
                                                                                                    en_proceso: {
                                                                                                        text: 'En Proceso',
                                                                                                        bg: 'bg-blue-500',
                                                                                                    },
                                                                                                    completado: {
                                                                                                        text: 'Completado',
                                                                                                        bg: 'bg-green-500',
                                                                                                    },
                                                                                                    cancelado: {
                                                                                                        text: 'Cancelado',
                                                                                                        bg: 'bg-red-500',
                                                                                                    },
                                                                                                    derivado: {
                                                                                                        text: 'Derivado',
                                                                                                        bg: 'bg-purple-500',
                                                                                                    },
                                                                                                };

                                                                                                const estado = estadoMap[tramite.estado] || {
                                                                                                    text: 'Desconocido',
                                                                                                    bg: 'bg-gray-500',
                                                                                                };

                                                                                                return (
                                                                                                    <span
                                                                                                        className={`inline-flex rounded-full ${estado.bg} px-3 py-1 text-xs font-medium text-white`}
                                                                                                    >
                                                                                                        {estado.text}
                                                                                                    </span>
                                                                                                );
                                                                                            })()}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                                            Nota de Ingreso
                                                                                        </p>
                                                                                        <p className="text-sm">{tramite.nota_ingreso}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* SECCIÓN 2: DOCUMENTOS COMERCIALES */}
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-muted-foreground text-sm font-medium">
                                                                                Documentos Comerciales
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Número de Factura
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.numero_factura}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Orden de Compra
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.orden_compra}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* SECCIÓN 3: INFORMACIÓN DE FACTURACIÓN */}
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-muted-foreground text-sm font-medium">
                                                                                Información de Facturación
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Forma de Pago
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.oc_cforpag || 'No registrado'}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Código Moneda
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.oc_ccodmon || 'No registrado'}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Fecha Documento
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {tramite.oc_dfecdoc
                                                                                            ? new Date(tramite.oc_dfecdoc).toLocaleDateString()
                                                                                            : 'No registrado'}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Nombre Factura
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {tramite.oc_cfacnombre || 'No registrado'}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        RUC Factura
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.oc_cfacruc || 'No registrado'}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Dirección Factura
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {tramite.oc_cfacdirec || 'No registrado'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* SECCIÓN 4: ARCHIVOS ADJUNTOS */}
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-muted-foreground text-sm font-medium">
                                                                                Archivos Adjuntos
                                                                            </h3>

                                                                            <div className="flex items-center justify-between rounded-md border p-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="text-muted-foreground h-5 w-5" />
                                                                                    <span>
                                                                                        {tramite.documento_subido ? 'Documento' : 'No hay documento'}
                                                                                    </span>
                                                                                </div>
                                                                                {tramite.documento_subido && (
                                                                                    <div className="flex gap-2">
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (typeof tramite.documento_subido === 'string') {
                                                                                                    window.open(
                                                                                                        `/storage/${tramite.documento_subido}`,
                                                                                                        '_blank',
                                                                                                    );
                                                                                                } else {
                                                                                                    alert('No hay documento para ver.');
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <FileText className="mr-1 h-4 w-4" />
                                                                                            Ver
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="default"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (typeof tramite.documento_subido === 'string') {
                                                                                                    const link = document.createElement('a');
                                                                                                    link.href = `/storage/${tramite.documento_subido}`;
                                                                                                    link.download =
                                                                                                        tramite.documento_subido.split('/').pop() ??
                                                                                                        'Documento_Tramite';
                                                                                                    link.click();
                                                                                                } else {
                                                                                                    alert('No hay documento para descargar.');
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <FileDown className="mr-1 h-4 w-4" />
                                                                                            Descargar
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className="flex items-center justify-between rounded-md border p-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="text-muted-foreground h-5 w-5" />
                                                                                    <span>
                                                                                        {tramite.factura_subida ? 'Factura' : 'No hay factura'}
                                                                                    </span>
                                                                                </div>
                                                                                {tramite.factura_subida && (
                                                                                    <div className="flex gap-2">
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (typeof tramite.factura_subida === 'string') {
                                                                                                    window.open(
                                                                                                        `/storage/${tramite.factura_subida}`,
                                                                                                        '_blank',
                                                                                                    );
                                                                                                } else {
                                                                                                    alert('No hay factura para ver.');
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <FileText className="mr-1 h-4 w-4" />
                                                                                            Ver
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="default"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (typeof tramite.factura_subida === 'string') {
                                                                                                    const link = document.createElement('a');
                                                                                                    link.href = `/storage/${tramite.factura_subida}`;
                                                                                                    link.download =
                                                                                                        tramite.factura_subida.split('/').pop() ??
                                                                                                        'Factura_Tramite';
                                                                                                    link.click();
                                                                                                } else {
                                                                                                    alert('No hay factura para descargar.');
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <FileDown className="mr-1 h-4 w-4" />
                                                                                            Descargar
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </TabsContent>
                                                            <TabsContent value="remitente">
                                                                <Card>
                                                                    <CardContent className="space-y-4">
                                                                        {/* SECCIÓN 2: DOCUMENTOS COMERCIALES */}
                                                                        <div className="space-y-4">
                                                                            <h3 className="text-muted-foreground text-sm font-medium">
                                                                                Información del remitente
                                                                            </h3>
                                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Nombre
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.cliente.user.name}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Correo
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.cliente.user.email}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Número de Documento
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.cliente.dni}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Teléfono
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.cliente.celular}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                                        Dirección
                                                                                    </p>
                                                                                    <p className="text-sm">{tramite.cliente.direccion}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </TabsContent>
                                                            <TabsContent value="detalle">
                                                                <Card>
                                                                    <CardContent className="space-y-4">
                                                                        <p className="text-muted-foreground text-sm font-medium">
                                                                            Lista de Productos
                                                                        </p>

                                                                        <table className="min-w-full table-auto">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                        ID
                                                                                    </th>
                                                                                    <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                        Código
                                                                                    </th>
                                                                                    <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                        Producto
                                                                                    </th>
                                                                                    <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                        Cantidad
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {Array.isArray(tramite.detalles) && tramite.detalles.length > 0 ? (
                                                                                    tramite.detalles.map((detalle) => (
                                                                                        <tr key={detalle.id_det} className="border-t">
                                                                                            <td className="px-4 py-2 text-sm">
                                                                                                {detalle.oc_citem ?? '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm">
                                                                                                {detalle.oc_ccodigo ?? '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm">
                                                                                                {detalle.oc_cdesref ?? '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2 text-sm">
                                                                                                {detalle.oc_ncantid ?? '-'}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                ) : (
                                                                                    <tr className="border-t">
                                                                                        <td
                                                                                            colSpan={4}
                                                                                            className="text-muted-foreground py-4 text-center text-sm"
                                                                                        >
                                                                                            No hay productos registrados
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </CardContent>
                                                                </Card>
                                                            </TabsContent>

                                                            <TabsContent value="seguimiento">
                                                                <Card>
                                                                    <CardContent className="space-y-4">
                                                                        <div className="space-y-4">
                                                                            <p className="text-muted-foreground text-sm font-medium">
                                                                                Historial de Seguimiento
                                                                            </p>

                                                                            <table className="min-w-full table-auto">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                            Fecha
                                                                                        </th>
                                                                                        <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                            Área
                                                                                        </th>
                                                                                        <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                            Encargado a
                                                                                        </th>
                                                                                        <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                                                                            Estado
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {seguimientosTramite
                                                                                        .filter((s) => s.tramite_id === tramite.id)
                                                                                        .map((seguimiento) => (
                                                                                            <tr key={seguimiento.id} className="border-t">
                                                                                                <td className="px-4 py-2 text-sm">
                                                                                                    {seguimiento.fecha_derivacion
                                                                                                        ? new Date(
                                                                                                              seguimiento.fecha_derivacion,
                                                                                                          ).toLocaleDateString()
                                                                                                        : '-'}
                                                                                                </td>
                                                                                                <td className="px-4 py-2 text-sm">
                                                                                                    {
                                                                                                        areas.find(
                                                                                                            (a) => a.id === seguimiento.area_id,
                                                                                                        )?.nombre
                                                                                                    }
                                                                                                </td>
                                                                                                <td className="px-4 py-2 text-sm">
                                                                                                    {
                                                                                                        empleados.find(
                                                                                                            (e) => e.id === seguimiento.empleado_id,
                                                                                                        )?.user.name
                                                                                                    }
                                                                                                </td>
                                                                                                <td className="px-4 py-2 text-sm">
                                                                                                    <span
                                                                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                                                            seguimiento.estado === 'pendiente'
                                                                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                                                                : seguimiento.estado === 'en_proceso'
                                                                                                                  ? 'bg-blue-100 text-blue-800'
                                                                                                                  : seguimiento.estado ===
                                                                                                                      'completado'
                                                                                                                    ? 'bg-green-100 text-green-800'
                                                                                                                    : seguimiento.estado ===
                                                                                                                        'cancelado'
                                                                                                                      ? 'bg-red-100 text-red-800'
                                                                                                                      : 'bg-purple-100 text-purple-800'
                                                                                                        }`}
                                                                                                    >
                                                                                                        {seguimiento.estado
                                                                                                            .replace('_', ' ')
                                                                                                            .toUpperCase()}
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                </tbody>
                                                                            </table>

                                                                            {seguimientosTramite.filter((s) => s.tramite_id === tramite.id).length ===
                                                                                0 && (
                                                                                <div className="text-muted-foreground py-4 text-center text-sm">
                                                                                    No hay seguimientos registrados
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </TabsContent>
                                                        </Tabs>

                                                        <div className="mt-4 flex justify-end">
                                                            <DialogClose>Cerrar</DialogClose>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                {auth.user.role === 'cliente' && (
                                                    <InvoiceUploadCell tramiteId={tramite.id} initialFileName={tramite.factura_subida} />
                                                )}
                                                {auth.user.role === 'empleado' ||
                                                    (auth.user.role === 'administrador' && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (typeof tramite.factura_subida === 'string') {
                                                                        window.open(`/storage/${tramite.factura_subida}`, '_blank');
                                                                    } else {
                                                                        alert('No hay documento para ver.');
                                                                    }
                                                                }}
                                                            >
                                                                <FileText className="mr-1 h-4 w-4" />
                                                                Ver Factura
                                                            </Button>
                                                        </div>
                                                    ))}

                                                {auth.user.role === 'empleado' && (
                                                    <>
                                                        {tramite.estado !== 'completado' && (
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 cursor-pointer border-gray-300 bg-white px-2.5 py-0 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                                                                    onClick={() => openDerivarModal(tramite)}
                                                                >
                                                                    <ArrowRight className="h-3 w-3" />
                                                                    <span>Derivar</span>
                                                                </Button>
                                                                <FinalizarButton tramite={{ id: tramite.id, estado: tramite.estado }} />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
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

                <CrearTramiteModal isOpen={isCrearModalOpen} onClose={closeCrearModal} clientes={clientes} areas={areas} />
                {tramiteSeleccionado && (
                    <DerivarModal
                        tramite={tramiteSeleccionado}
                        areas={areas}
                        empleados={empleados}
                        isOpen={derivarModalOpen}
                        onClose={closeDerivarModal}
                    />
                )}
            </div>
        </AppLayout>
    );
}
