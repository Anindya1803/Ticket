"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useData } from "@/context/data-context";
import { useParams } from "next/navigation";
import { Mail, Shield, Ticket, Users } from "lucide-react";

export default function UserProfilePage() {
    const params = useParams();
    const { users, tickets, groups } = useData();

    const userId = params.id as string;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return (
            <DashboardLayout>
                <div className="text-center py-10">User not found</div>
            </DashboardLayout>
        );
    }

    const assignedTickets = tickets.filter(t => t.assignedTo === userId);
    const userGroups = groups.filter(g => g.memberIds.includes(userId));

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="relative flex items-end -mt-12 mb-4">
                            <img
                                className="h-24 w-24 rounded-full ring-4 ring-white bg-white"
                                src={user.avatar}
                                alt={user.name}
                            />
                            <div className="ml-4 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Shield className="h-4 w-4 mr-1" />
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Ticket className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{assignedTickets.length} Assigned Tickets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Groups */}
                {userGroups.length > 0 && (
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-gray-500" />
                                Groups
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {userGroups.map(group => (
                                <li key={group.id} className="px-6 py-4 flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                    <div className="text-sm text-gray-500">{group.memberIds.length} members</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recent Tickets */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Assigned Tickets</h3>
                    </div>
                    {assignedTickets.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {assignedTickets.map(ticket => (
                                <li key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-indigo-600 truncate">
                                            {ticket.title}
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                #{ticket.id}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Priority: {ticket.priority}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-6 py-4 text-sm text-gray-500">No tickets assigned.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
