"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for Demo
const MOCK_USERS: Record<Role, User> = {
    MASTER_ADMIN: {
        id: 'u1',
        name: 'Master Admin',
        email: 'master@example.com',
        role: 'MASTER_ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Master'
    },
    ADMIN: {
        id: 'u2',
        name: 'Support Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    USER: {
        id: 'u3',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('ticketing_auth_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (role: Role) => {
        const mockUser = MOCK_USERS[role];
        setUser(mockUser);
        localStorage.setItem('ticketing_auth_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ticketing_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
