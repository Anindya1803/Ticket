"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Settings, LogOut, Users, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Team", href: "/users", icon: Users },
    { name: "Groups", href: "/groups", icon: Folder },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex h-full w-64 flex-col glass-sidebar text-white transition-all duration-300">
            <div className="flex h-20 items-center justify-center border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="font-bold text-white">H</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        HELPDESK
                    </h1>
                </div>
            </div>
            <nav className="flex-1 space-y-2 px-3 py-6">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-300 shadow-inner border border-indigo-500/20"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-white/10 p-4 bg-black/20">
                <button
                    onClick={logout}
                    className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-red-400" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
