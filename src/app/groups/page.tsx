"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
    const { groups, users, createGroup } = useData();
    const { user } = useAuth();
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    if (!user || user.role !== 'MASTER_ADMIN') {
        return (
            <DashboardLayout>
                <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
                    <p className="mt-1 text-sm text-gray-500">You do not have permission to view this page.</p>
                </div>
            </DashboardLayout>
        );
    }

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;

        createGroup(newGroupName, selectedMemberIds);
        setIsModalOpen(false);
        setNewGroupName('');
        setSelectedMemberIds([]);
    };

    const toggleMemberSelection = (userId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <DashboardLayout>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Groups</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage support groups and assign multiple agents to them.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Group Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Members
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {groups.map((group) => (
                                        <tr key={group.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <Users className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{group.name}</div>
                                                        <div className="text-gray-500 text-xs">ID: {group.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {group.memberIds.map(memberId => {
                                                        const member = users.find(u => u.id === memberId);
                                                        if (!member) return null;
                                                        return (
                                                            <img
                                                                key={member.id}
                                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                                src={member.avatar}
                                                                alt={member.name}
                                                                title={member.name}
                                                            />
                                                        );
                                                    })}
                                                    {group.memberIds.length === 0 && <span className="text-gray-400 italic">No members</span>}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Date(group.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Group Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Create New Group
                                    </h3>
                                    <div className="mt-2">
                                        <form onSubmit={handleCreateGroup} className="space-y-4">
                                            <div>
                                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 text-left">
                                                    Group Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="groupName"
                                                    id="groupName"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)}
                                                    placeholder="e.g. Tier 1 Support"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                                                    Add Members
                                                </label>
                                                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
                                                    {users.filter(u => u.role !== 'USER').map(user => (
                                                        <div key={user.id} className="flex items-center">
                                                            <input
                                                                id={`user-${user.id}`}
                                                                name={`user-${user.id}`}
                                                                type="checkbox"
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                checked={selectedMemberIds.includes(user.id)}
                                                                onChange={() => toggleMemberSelection(user.id)}
                                                            />
                                                            <label htmlFor={`user-${user.id}`} className="ml-3 block text-sm font-medium text-gray-700 flex items-center">
                                                                <img src={user.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                                                                {user.name} ({user.role})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Create Group
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                    onClick={() => setIsModalOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
