import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { auth } = usePage<SharedData>().props;

    // Filtra los ítems del menú según el rol del usuario
    // Filtrar ítems por rol
    const filteredItems = items.filter((item) => {
        // Si el ítem tiene roles definidos, solo mostrar si el usuario tiene uno de ellos
        if (item.roles && Array.isArray(item.roles)) {
            return item.roles.includes(auth.user.role);
        }
        return true; // Si no tiene roles, mostrar para todos
    });
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Panel</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
