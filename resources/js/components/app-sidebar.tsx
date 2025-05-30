import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Briefcase, FileText, User, UserCircle } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    //     roles: ['administrador'],
    // },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: User,
        roles: ['administrador'], // solo admin puede verlo
    },
    {
        title: 'Empleados',
        href: '/empleados',
        icon: Briefcase,
        roles: ['administrador'], // solo admin puede verlo
    },
    {
        title: 'Proveedores',
        href: '/clientes',
        icon: UserCircle,
        roles: ['administrador', 'empleado'], // solo admin puede verlo
    },
    // {
    //     title: 'Areas',
    //     href: '/areas',
    //     icon: Layers,
    //     roles: ['administrador'],
    // },
    {
        title: 'Órdenes',
        href: '/tramites',
        icon: FileText,
        roles: ['administrador', 'empleado', 'cliente'], // admin y empleados
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="mx-auto w-full overflow-hidden rounded-md bg-[#F7FBF9]">
                        <SidebarMenuButton size="lg" asChild className="hover:bg-[#F7FBF9]">
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
