"use client";

import { useData } from "@/context/data-context";
import { useState } from "react";
import { ProblemType, TicketPriority } from "@/types";
import { Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PublicNewTicketPage() {
    const { createTicket } = useData();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form Stats
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [problemType, setProblemType] = useState<ProblemType>('WIFI');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        createTicket({
            title: `${problemType} Issue - Room ${room}`,
            description: description,
            status: 'OPEN',
            priority: 'MEDIUM', // Default priority for guest tickets
            createdBy: 'guest',
            isGuest: true,
            guestName: name,
            guestRoom: room,
            guestEmail: email || undefined,
            problemType: problemType
        });

        setIsLoading(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center animate-in zoom-in duration-300">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted!</h2>
                <p className="text-slate-500 mb-8">
                    Thank you, {name}. We have received your issue report for Room {room}.
                    Our team will investigate shortly.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setName('');
                        setRoom('');
                        setDescription('');
                        setProblemType('WIFI');
                        setEmail('');
                    }}
                    className="btn-primary w-full py-3 rounded-xl font-medium"
                >
                    Submit Another Ticket
                </button>
                <div className="mt-4">
                    <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Staff Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                <h2 className="font-semibold text-slate-900">New Support Request</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                            placeholder="101"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Problem Type</label>
                    <select
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                        value={problemType}
                        onChange={(e) => setProblemType(e.target.value as ProblemType)}
                    >
                        <option value="WIFI">WiFi / Internet</option>
                        <option value="PLUMBING">Plumbing / Water</option>
                        <option value="ELECTRICAL">Electrical / Power</option>
                        <option value="FURNITURE">Furniture / Damaged Items</option>
                        <option value="CLEANING">Cleaning / Housekeeping</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                        required
                        rows={3}
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                        placeholder="Please describe the issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email (Optional)
                        <span className="text-slate-400 font-normal ml-1">- for updates</span>
                    </label>
                    <input
                        type="email"
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center py-3 rounded-xl font-medium mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Ticket
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
