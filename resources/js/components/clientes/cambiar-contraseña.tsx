import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Cliente } from '@/types';
import { useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import React from 'react';

export default function ChangePasswordDialog({ cliente }: { cliente: Cliente }) {
    const [open, setOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        new_password: '',
        new_password_confirmation: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submit = (e: any) => {
        e.preventDefault();

        post(route('password.update', { cliente: cliente.id }), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="!p-0">
                <Button className="cursor-pointer bg-transparent p-0 text-black hover:bg-transparent">
                    <KeyRound className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Establecer nueva contraseña</DialogTitle>
                    <DialogDescription className="hidden">asdsa</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nueva contraseña</label>
                        <Input type="password" value={data.new_password} onChange={(e) => setData('new_password', e.target.value)} />
                        {errors.new_password && <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Confirmar nueva contraseña</label>
                        <Input
                            type="password"
                            value={data.new_password_confirmation}
                            onChange={(e) => setData('new_password_confirmation', e.target.value)}
                        />
                        {errors.new_password && <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Guardar contraseña
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
