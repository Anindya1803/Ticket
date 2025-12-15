"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { Role } from "@/types";
import { Plus, Shield, User as UserIcon, Users } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
    const { users, inviteUser } = useData();
    const { user: currentUser } = useAuth();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<Role>('USER');

    if (currentUser?.role !== 'MASTER_ADMIN') {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <Shield className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
                        <p className="mt-1 text-sm text-gray-500">Only Master Admins can manage users.</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteUser(inviteEmail, inviteRole, inviteName);
        setIsInviteModalOpen(false);
        setInviteName('');
        setInviteEmail('');
        setInviteRole('USER');
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
                    <p className="text-slate-500 mt-1">Manage users and their roles.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-primary flex items-center px-4 py-2 rounded-lg font-medium"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Invite User
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <div key={user.id} className="glass-panel rounded-xl p-6 card-hover relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Actions could go here */}
                        </div>
                        <Link href={`/profile/${user.id}`} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                            <img className="h-12 w-12 rounded-full bg-slate-100" src={user.avatar} alt="" />
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">{user.name}</h3>
                                <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                        </Link>
                        <div className="mt-4 flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'MASTER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                {user.role === 'MASTER_ADMIN' && <Shield className="mr-1 h-3 w-3" />}
                                {user.role === 'ADMIN' && <Users className="mr-1 h-3 w-3" />}
                                {user.role === 'USER' && <UserIcon className="mr-1 h-3 w-3" />}
                                {user.role.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400">Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-medium text-slate-900">Invite New User</h3>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Role</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as Role)}
                                >
                                    <option value="USER">User (Customer)</option>
                                    <option value="ADMIN">Support Admin</option>
                                    <option value="MASTER_ADMIN">Master Admin</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
