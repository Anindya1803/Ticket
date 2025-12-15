import { auth } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getStats(userId: string, role: string) {
    // For now, fetching all stats. In real app, filter by role/permissions.
    const total = await db.ticket.count()
    const open = await db.ticket.count({ where: { status: 'OPEN' } })
    const resolved = await db.ticket.count({ where: { status: 'RESOLVED' } })
    return { total, open, resolved }
}

async function getRecentTickets() {
    return await db.ticket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            creator: true,
            assignee: true,
        }
    })
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const stats = await getStats(session.user.id, session.user.role as string)
    const recentTickets = await getRecentTickets()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                <Link
                    href="/tickets/new"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 hover:shadow-indigo-500/25"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Ticket
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                    <h3 className="text-sm font-medium text-slate-400">Total Tickets</h3>
                    <div className="mt-2 text-3xl font-bold text-white">{stats.total}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                    <h3 className="text-sm font-medium text-amber-500/80">Open Issues</h3>
                    <div className="mt-2 text-3xl font-bold text-amber-500">{stats.open}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
                    <h3 className="text-sm font-medium text-emerald-500/80">Resolved</h3>
                    <div className="mt-2 text-3xl font-bold text-emerald-500">{stats.resolved}</div>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <div className="border-b border-white/10 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
                </div>
                <div className="divide-y divide-white/10">
                    {recentTickets.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No tickets found.</div>
                    ) : (
                        recentTickets.map((ticket: any) => (
                            <div key={ticket.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5">
                                <div>
                                    <Link href={`/tickets/${ticket.id}`} className="font-medium text-white hover:text-indigo-400 hover:underline">
                                        {ticket.title}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-slate-400">#{ticket.id.slice(-4)}</span>
                                        <span className="text-sm text-slate-500">•</span>
                                        <span className="text-sm text-slate-400">{ticket.creator?.name || ticket.creator?.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-amber-500/10 text-amber-500' :
                                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
