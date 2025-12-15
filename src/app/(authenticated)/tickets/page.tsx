import { auth } from "@/auth"
import { getTickets } from "@/actions/ticket-actions"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

export default async function TicketsPage() {
    const session = await auth()
    if (!session?.user) return null

    const tickets = await getTickets()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">Tickets</h1>
                <Link
                    href="/tickets/new"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 hover:shadow-indigo-500/25"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Ticket
                </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            placeholder="Search tickets..."
                            className="h-9 w-full rounded-md border border-white/10 bg-black/20 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Ticket ID</th>
                                <th className="px-6 py-3 font-medium">Subject</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Priority</th>
                                <th className="px-6 py-3 font-medium">Requester</th>
                                <th className="px-6 py-3 font-medium">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="transition-colors hover:bg-white/5">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{ticket.id.slice(-4)}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/tickets/${ticket.id}`} className="font-medium text-white hover:text-indigo-400 hover:underline">
                                            {ticket.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-amber-500/10 text-amber-500' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-400' :
                                                ticket.priority === 'MEDIUM' ? 'text-amber-400' :
                                                    'text-emerald-400'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{ticket.creator?.name || ticket.creator?.email}</td>
                                    <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tickets.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No tickets found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
