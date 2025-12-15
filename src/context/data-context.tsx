"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, Comment, User, Role, Group } from '@/types';

interface DataContextType {
    tickets: Ticket[];
    comments: Comment[];
    users: User[];
    groups: Group[];
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
    getTicket: (id: string) => Ticket | undefined;
    getTicketComments: (ticketId: string) => Comment[];
    inviteUser: (email: string, role: Role, name: string) => void;
    assignTicket: (ticketId: string, userId: string) => void;
    createGroup: (name: string, memberIds: string[]) => void;
    updateGroup: (id: string, updates: Partial<Group>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
    TICKETS: 'ticketing_data_tickets',
    COMMENTS: 'ticketing_data_comments',
    USERS: 'ticketing_data_users',
    GROUPS: 'ticketing_data_groups'
};

const INITIAL_TICKETS: Ticket[] = [
    {
        id: 't1',
        title: 'Login page is crashing',
        description: 'When I try to login with Google, the page goes white.',
        status: 'OPEN',
        priority: 'HIGH',
        createdBy: 'u3',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 't2',
        title: 'Feature Request: Dark Mode',
        description: 'Please add dark mode support.',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        createdBy: 'u3',
        assignedTo: 'u2',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 100000).toISOString(),
    }
];

const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        name: 'Master Admin',
        email: 'master@example.com',
        role: 'MASTER_ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Master'
    },
    {
        id: 'u2',
        name: 'Support Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    {
        id: 'u3',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    }
];

const INITIAL_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Support Team',
        memberIds: ['u1', 'u2'],
        createdAt: new Date().toISOString()
    }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    // Load data on mount
    useEffect(() => {
        const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
        const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);

        if (storedTickets) {
            setTickets(JSON.parse(storedTickets));
        } else {
            setTickets(INITIAL_TICKETS);
            localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
        }

        if (storedComments) {
            setComments(JSON.parse(storedComments));
        }

        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            setUsers(INITIAL_USERS);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        }

        if (storedGroups) {
            setGroups(JSON.parse(storedGroups));
        } else {
            setGroups(INITIAL_GROUPS);
            localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
        }
    }, []);

    // Persist updates
    useEffect(() => {
        if (tickets.length > 0) localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    }, [tickets]);

    useEffect(() => {
        if (comments.length > 0) localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }, [comments]);

    useEffect(() => {
        if (users.length > 0) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (groups.length > 0) localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    }, [groups]);

    const createTicket = (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTicket: Ticket = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setTickets(prev => [newTicket, ...prev]);

        // Notify group members if assigned to a group
        if (data.assignedGroupId) {
            const group = groups.find(g => g.id === data.assignedGroupId);
            if (group) {
                console.log(`Notification: Ticket assigned to group ${group.name}. Members: ${group.memberIds.join(', ')}`);
                // In a real app, we would send emails or push notifications here
            }
        }
    };

    const updateTicket = (id: string, updates: Partial<Ticket>) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    };

    const addComment = (data: Omit<Comment, 'id' | 'createdAt'>) => {
        const newComment: Comment = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setComments(prev => [...prev, newComment]);
    };

    const inviteUser = (email: string, role: Role, name: string) => {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        setUsers(prev => [...prev, newUser]);
    };

    const assignTicket = (ticketId: string, userId: string) => {
        updateTicket(ticketId, { assignedTo: userId });
    };

    const createGroup = (name: string, memberIds: string[]) => {
        const newGroup: Group = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            memberIds,
            createdAt: new Date().toISOString()
        };
        setGroups(prev => [...prev, newGroup]);
    };

    const updateGroup = (id: string, updates: Partial<Group>) => {
        setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const getTicket = (id: string) => tickets.find(t => t.id === id);

    const getTicketComments = (ticketId: string) =>
        comments.filter(c => c.ticketId === ticketId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <DataContext.Provider value={{
            tickets,
            comments,
            users,
            groups,
            createTicket,
            updateTicket,
            addComment,
            getTicket,
            getTicketComments,
            inviteUser,
            assignTicket,
            createGroup,
            updateGroup
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
