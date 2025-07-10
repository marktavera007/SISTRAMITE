import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[]; // ← opcional, define los roles que pueden ver este ítem
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export type UserEdit = Pick<User, 'name' | 'email' | 'role' | 'is_active'>;

export type Empleado = {
    id?: number;
    user_id?: number;
    name?: string;
    email?: string;
    password?: string;
    foto: File | null | string;
    dni: string;
    celular: string;
    cargo: string;
    direccion: string;
    created_at?: string;
    updated_at?: string;
    user?: {
        name: string;
        email: string;
        is_active: boolean;
    };
};

export type Cliente = {
    id?: number;
    user_id?: number;
    empleado_id?: string | number;
    name?: string;
    email?: string;
    password?: string;
    foto: File | null | string;
    dni: string;
    ruc: string;
    celular: string;
    direccion: string;
    created_at?: string;
    updated_at?: string;
    user?: {
        name: string;
        email: string;
        is_active: boolean;
    };
};

export type Area = {
    id?: number;
    nombre: string;
    estado?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type Tramite = {
    id?: number;
    cliente_id: number; // Relación con el cliente
    empleado_id?: number; // Relación con el empleado
    area_id: number; // Relación con el área
    area_destino_id: number;
    documento_subido?: File | null | string;
    dias_respuesta: string;
    dias_pasados: string;
    numero_expediente?: string; // Número de expediente único
    nota_ingreso?: string; // Nota de ingreso
    orden_compra?: string; // Orden de compra
    numero_factura?: string; // Número de factura
    tipo_documento: string; // Tipo de documento (Ej. Informe, Solicitud)
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' | 'derivado'; // Estado del trámite
    created_at?: string; // Fecha de creación
    updated_at?: string; // Fecha de actualización
    cliente: Cliente & {
        user: User;
    };
    empleado: Empleado & {
        user: User;
    };
    creador?: {
        id: number;
        nombre: string;
        email: string;
    };
    area: Area;
    area_destino: Area;
    area_destino_nombre: string;
    factura_subida?: string;
    oc_cforpag?: string;
    oc_ccodmon?: string;
    oc_dfecdoc?: string;
    oc_cfacnombre?: string;
    oc_cfacruc?: string;
    oc_cfacdirec?: string;
    oc_fechaestimadapago?: string;
    oc_fechaestimadapago?: string;
    oc_aprobacioncompras?: string;
    detalles: TramiteDetail[];
};

export type TramiteDetail = {
    id_det?: number;
    id_tramite?: number;
    oc_citem?: string;
    oc_ccodigo?: string;
    oc_cdesref?: string;
    oc_ncantid?: number;
};
