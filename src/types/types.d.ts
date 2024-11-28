//No comento nada y debo cambiar ese habito,
//Si no se entiende el codigo es mejor borrarlo y empezar de nuevo
// id? por si firestore necesita asignar un id

export interface Ticket {
    id?: string;
    ticketCode: string;
    patientName?: string;
    queues: Queue[];
    services: Service[];
    status: 'pending' | 'billing' | 'inQueue' | 'processing' | 'finished';
    createdAt: Date;
    billingPosition?: BillingPosition;
    updatedAt: Date;
    finishedAt?: Date;
    billingAt?: Date;
}

export interface BillingPosition {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Notification {
    id?: string;
    user: User;
    service: Service;
    seen: boolean;
    message: string;
    ticket: Ticket;
    billingPosition?: BillingPosition;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Video {
    id?: string;
    url: string;
    name: string;
}

export interface User {
    id?: string;
    authId: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'billing' | 'doctor';
    createdAt?: Date;
    updatedAt?: Date;
    billingPosition?: BillingPosition;
    services?: Service[];
}

export interface Queue {
    id?: string;
    name: string;
    count: number;
    serviceId: string;
}

export interface Service {
    id?: string;
    name: string;
    status?: string;
}
