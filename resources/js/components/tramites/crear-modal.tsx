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

// type AreaLocal = {
//     id: number;
//     nombre: string;
// };

export default function CrearTramiteModal({ isOpen, onClose, clientes }: { isOpen: boolean; onClose: () => void; clientes: ClienteLocal[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: '', // Cliente seleccionado

        nota_ingreso: '',
        orden_compra: '',
        numero_factura: '',
        tipo_documento: '',
        dias_respuesta: '', // Días de respuesta
        documento_subido: null as File | null,

        oc_cforpag: '',
        oc_ccodmon: '',
        oc_dfecdoc: '',
        oc_cfacnombre: '',
        oc_cfacruc: '',
        oc_cfacdirec: '',

        productos: [
            {
                oc_citem: '',
                oc_ccodigo: '',
                oc_cdesref: '',
                oc_ncantid: '',
            },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            ...data,
            cliente_id: Number(data.cliente_id), // Convertir a número
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
            <DialogContent className="h-[70vh] overflow-y-auto border-none sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Orden</DialogTitle>
                    <DialogDescription>Ingrese los datos para crear un nuevo trámite.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Cliente */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cliente_id" className="text-right">
                                Proveedor <span className="text-lg text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.cliente_id} // Valor inicial vacío
                                onValueChange={(value) => setData('cliente_id', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona un proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clientes.map((cliente) => (
                                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                            {cliente.user.name} ({cliente.user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.cliente_id} className="col-span-5 w-full text-start" />
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
                            <InputError message={errors.tipo_documento} className="col-span-5 mt-2" />
                        </div>
                        {/* campos nuevos */}
                        {/* Forma de pago */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_cforpag" className="text-right">
                                Forma de Pago
                            </Label>
                            <Input
                                id="oc_cforpag"
                                value={data.oc_cforpag}
                                onChange={(e) => setData('oc_cforpag', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* Moneda */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_ccodmon" className="text-right">
                                Moneda
                            </Label>
                            <Input
                                id="oc_ccodmon"
                                value={data.oc_ccodmon}
                                onChange={(e) => setData('oc_ccodmon', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* Fecha */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_dfecdoc" className="text-right">
                                Fecha de Documento
                            </Label>
                            <Input
                                id="oc_dfecdoc"
                                value={data.oc_dfecdoc}
                                onChange={(e) => setData('oc_dfecdoc', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* Nombre factura */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_cfacnombre" className="text-right">
                                Nombre Factura
                            </Label>
                            <Input
                                id="oc_cfacnombre"
                                value={data.oc_cfacnombre}
                                onChange={(e) => setData('oc_cfacnombre', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* RUC */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_cfacruc" className="text-right">
                                RUC Factura
                            </Label>
                            <Input
                                id="oc_cfacruc"
                                value={data.oc_cfacruc}
                                onChange={(e) => setData('oc_cfacruc', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* Dirección */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="oc_cfacdirec" className="text-right">
                                Dirección Factura
                            </Label>
                            <Input
                                id="oc_cfacdirec"
                                value={data.oc_cfacdirec}
                                onChange={(e) => setData('oc_cfacdirec', e.target.value)}
                                type="text"
                                disabled={processing}
                                className="col-span-3"
                            />
                        </div>

                        {/* Productos */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Productos</h3>
                            <Button
                                type="button"
                                onClick={() =>
                                    setData('productos', [...data.productos, { oc_citem: '', oc_ccodigo: '', oc_cdesref: '', oc_ncantid: '' }])
                                }
                                className="h-7 w-fit rounded-lg text-xs"
                            >
                                + Agregar
                            </Button>
                        </div>
                        {data.productos.map((producto, index) => (
                            <div key={index} className="grid grid-cols-1 items-center gap-4">
                                <Input
                                    placeholder="Código"
                                    value={producto.oc_ccodigo}
                                    onChange={(e) =>
                                        setData(
                                            'productos',
                                            data.productos.map((p, i) => (i === index ? { ...p, oc_ccodigo: e.target.value } : p)),
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <InputError message={(errors as Record<string, string>)[`productos.${index}.oc_ccodigo`]} />

                                <Input
                                    placeholder="Código Ítem"
                                    value={producto.oc_citem}
                                    onChange={(e) =>
                                        setData(
                                            'productos',
                                            data.productos.map((p, i) => (i === index ? { ...p, oc_citem: e.target.value } : p)),
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <InputError message={(errors as Record<string, string>)[`productos.${index}.oc_citem`]} />

                                <Input
                                    placeholder="Descripción"
                                    value={producto.oc_cdesref}
                                    onChange={(e) =>
                                        setData(
                                            'productos',
                                            data.productos.map((p, i) => (i === index ? { ...p, oc_cdesref: e.target.value } : p)),
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <InputError message={(errors as Record<string, string>)[`productos.${index}.oc_cdesref`]} />

                                <Input
                                    placeholder="Cantidad"
                                    type="number"
                                    value={producto.oc_ncantid}
                                    onChange={(e) =>
                                        setData(
                                            'productos',
                                            data.productos.map((p, i) => (i === index ? { ...p, oc_ncantid: e.target.value } : p)),
                                        )
                                    }
                                    className="col-span-1"
                                />
                                <InputError message={(errors as Record<string, string>)[`productos.${index}.oc_ncantid`]} />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 w-fit rounded-lg text-xs"
                                    onClick={() =>
                                        setData(
                                            'productos',
                                            data.productos.filter((_, i) => i !== index),
                                        )
                                    }
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        {/* <InputError message={errors.productos} className="mt-1" /> */}
                        {typeof errors.productos === 'string' && <InputError message={errors.productos} />}
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
