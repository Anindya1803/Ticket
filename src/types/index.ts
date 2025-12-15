export type Role = 'MASTER_ADMIN' | 'ADMIN' | 'USER';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProblemType = 'WIFI' | 'PLUMBING' | 'ELECTRICAL' | 'FURNITURE' | 'CLEANING' | 'OTHER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string;
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdBy: string;
    assignedTo?: string;
    assignedGroupId?: string;
    createdAt: string;
    updatedAt: string;

    // Guest Fields
    isGuest?: boolean;
    guestName?: string;
    guestEmail?: string;
    guestRoom?: string;
    problemType?: ProblemType;
}

export interface Comment {
    id: string;
    ticketId: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

export interface Group {
    id: string;
    name: string;
    memberIds: string[];
    createdAt: string;
}
