import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex items-center justify-center rounded-md">
                                <AppLogo />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="text-center">
                            <h1 className="text-muted-foreground mb-1 font-medium">{title}</h1>
                            {description && <p className="text-muted-foreground text-center text-sm">{description}</p>}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
