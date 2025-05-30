import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

type AreaLocal = {
    id: number;
    nombre: string;
};

export default function CrearTramiteModal({
    isOpen,
    onClose,
    areas,
    clientes,
}: {
    isOpen: boolean;
    onClose: () => void;
    areas: AreaLocal[];
    clientes: ClienteLocal[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: '', // Cliente seleccionado
        area_id: '', // Área seleccionada
        area_destino_id: '', // Área de destino
        nota_ingreso: '',
        orden_compra: '',
        numero_factura: '',
        tipo_documento: '',
        dias_respuesta: '', // Días de respuesta
        documento_subido: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            ...data,
            cliente_id: Number(data.cliente_id), // Convertir a número
            area_id: Number(data.area_id), // Convertir a número
            area_destino_id: Number(data.area_destino_id), // Convertir a número
        };

        console.log(formData);
        post(route('tramite.store', formData), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-[80vh] overflow-y-auto border-none sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Trámite</DialogTitle>
                    <DialogDescription>Ingrese los datos para crear un nuevo trámite.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Cliente */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cliente_id" className="text-right">
                                Cliente <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.cliente_id} // Valor inicial vacío
                                onValueChange={(value) => setData('cliente_id', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clientes.map((cliente) => (
                                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                            {cliente.user.name} ({cliente.user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.cliente_id} className="mt-2" />
                        </div>

                        {/* Área */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Área de inicio <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.area_id} // Valor inicial vacío
                                onValueChange={(value) => setData('area_id', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un área" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areas.map((area) => (
                                        <SelectItem key={area.id} value={area.id.toString()}>
                                            {area.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.area_id} className="mt-2" />
                        </div>
                        {/* Área */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Área de destino <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.area_destino_id} // Valor inicial vacío
                                onValueChange={(value) => setData('area_destino_id', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un área" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areas.map((area) => (
                                        <SelectItem key={area.id} value={area.id.toString()}>
                                            {area.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.area_destino_id} className="mt-2" />
                        </div>
                        {/* Documento */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="documento_subido" className="text-right">
                                Documento <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="documento_subido"
                                type="file"
                                accept=".pdf" // Limita la selección a archivos PDF
                                onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    if (file) {
                                        setData('documento_subido', file); // Guardar el archivo en el estado
                                    }
                                }}
                                disabled={processing}
                                className="col-span-3"
                            />
                            <InputError message={errors.documento_subido} className="mt-2" />
                        </div>

                        {/* Días de Respuesta */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dias_respuesta" className="text-right">
                                Días de Respuesta
                            </Label>
                            <Input
                                id="dias_respuesta"
                                type="number"
                                value={data.dias_respuesta}
                                onChange={(e) => setData('dias_respuesta', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Días de respuesta"
                            />
                            <InputError message={errors.dias_respuesta} className="mt-2" />
                        </div>

                        {/* Nota de ingreso */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nota_ingreso" className="text-right">
                                Nota de Ingreso <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="nota_ingreso"
                                type="text"
                                value={data.nota_ingreso}
                                onChange={(e) => setData('nota_ingreso', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Nota de ingreso"
                            />
                            <InputError message={errors.nota_ingreso} className="mt-2" />
                        </div>

                        {/* Orden de compra */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orden_compra" className="text-right">
                                Orden de Compra <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="orden_compra"
                                type="text"
                                value={data.orden_compra}
                                onChange={(e) => setData('orden_compra', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Orden de compra"
                            />
                            <InputError message={errors.orden_compra} className="mt-2" />
                        </div>

                        {/* Número de factura */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="numero_factura" className="text-right">
                                Número de Factura <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="numero_factura"
                                type="text"
                                value={data.numero_factura}
                                onChange={(e) => setData('numero_factura', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Número de factura"
                            />
                            <InputError message={errors.numero_factura} className="mt-2" />
                        </div>

                        {/* Tipo de documento */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tipo_documento" className="text-right">
                                Tipo de Documento <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Input
                                id="tipo_documento"
                                type="text"
                                value={data.tipo_documento}
                                onChange={(e) => setData('tipo_documento', e.target.value)}
                                disabled={processing}
                                className="col-span-3"
                                placeholder="Tipo de documento"
                            />
                            <InputError message={errors.tipo_documento} className="mt-2" />
                        </div>

                        {/* Estado */}
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Estado</Label>
                            <Select value={data.estado} onValueChange={(value) => setData('estado', value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="en_proceso">En Proceso</SelectItem>
                                        <SelectItem value="completado">Completado</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.estado} className="mt-2" />
                        </div> */}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear Trámite
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
