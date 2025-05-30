import { ArrowLeft } from 'lucide-react';

export default function Volver() {
    return (
        <button
            onClick={() => window.history.back()}
            className="group mt-6 flex w-fit cursor-pointer items-center gap-2 px-10 py-1.5 text-sm text-amber-500 hover:underline hover:underline-offset-4"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
        </button>
    );
}
