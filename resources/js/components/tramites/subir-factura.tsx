/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Check, File, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface InvoiceUploadCellProps {
    tramiteId?: any;
    initialFileName?: string;
}

export function InvoiceUploadCell({ tramiteId, initialFileName }: InvoiceUploadCellProps) {
    const [fileName, setFileName] = useState<string | null>(initialFileName || null);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        factura: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setData('factura', file);
        setIsSuccess(false); // resetear estado anterior si hubo éxito antes
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.factura) return;

        post(route('tramite.facturaCliente', tramiteId), {
            forceFormData: true,
            onSuccess: () => setIsSuccess(true),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Input de archivo */}
            <input ref={inputRef} id="invoice-upload" type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />

            {/* Botón para elegir archivo */}
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="text-sm">{fileName ? 'Cambiar factura' : 'Elegir factura'}</span>
            </Button>

            {/* Nombre del archivo + Estado */}
            {fileName && (
                <div className="flex max-w-[150px] items-center gap-2 overflow-hidden">
                    <File className="text-muted-foreground h-4 w-4" />
                    <span className="truncate text-sm" title={fileName}>
                        {fileName}
                    </span>

                    {processing ? (
                        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    ) : isSuccess ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : null}
                </div>
            )}

            {/* Botón de subir factura */}
            {fileName && !processing && !isSuccess && (
                <Button type="submit" size="sm" variant="secondary" className="cursor-pointer bg-gray-200 hover:bg-gray-200">
                    Guardar factura
                </Button>
            )}
        </form>
    );
}
