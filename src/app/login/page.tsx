"use client";

import { useAuth } from "@/context/auth-context";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, User, Users } from "lucide-react";

export default function LoginPage() {
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleLogin = (role: Role) => {
        login(role);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to HelpDesk
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Select a role to explore the demo
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">

                    <button
                        onClick={() => handleLogin('MASTER_ADMIN')}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-3 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Shield className="h-5 w-5 text-purple-500 group-hover:text-purple-400" aria-hidden="true" />
                        </span>
                        Master Admin
                        <span className="ml-2 text-purple-200 text-xs">(Full Access)</span>
                    </button>

                    <button
                        onClick={() => handleLogin('ADMIN')}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Users className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                        </span>
                        Support Admin
                        <span className="ml-2 text-blue-200 text-xs">(Manage Tickets)</span>
                    </button>

                    <button
                        onClick={() => handleLogin('USER')}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-3 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
                        </span>
                        Customer
                        <span className="ml-2 text-green-200 text-xs">(Submit Tickets)</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
