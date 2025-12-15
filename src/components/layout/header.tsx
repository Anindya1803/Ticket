"use client";

"use client";

import { useAuth } from "@/context/auth-context";

export function Header() {
    const { user } = useAuth();

    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-10">
            <div className="flex items-center">
                {/* Breadcrumbs or Page Title could go here */}
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">{user?.role}</p>
                    </div>
                    <div className="relative h-10 w-10 rounded-full ring-2 ring-white shadow-md overflow-hidden">
                        <img
                            className="h-full w-full object-cover"
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                            alt={user?.name}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
