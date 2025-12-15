import { auth } from "@/auth"
import { getTicketById, addComment, updateTicketStatus } from "@/actions/ticket-actions"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

// Separate Client Component for the Comment Form to avoid hydration issues? 
// Or just server action in form. Simpler to keep it server component mostly.
// But we need interactivity for status updates.

async function TicketDetail({ params }: { params: { id: string } }) {
    const ticket = await getTicketById(params.id)
    if (!ticket) notFound()

    const session = await auth()

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
                            <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                                <span className="font-mono text-slate-500">#{ticket.id.slice(-4)}</span>
                                <span>•</span>
                                <span>Created by {ticket.creator.name}</span>
                                <span>•</span>
                                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 prose prose-invert max-w-none text-slate-300">
                        <p className="whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                </div>

                {/* Comments */}
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4">
                        <h3 className="font-semibold text-white">Conversation</h3>
                    </div>
                    <div className="divide-y divide-white/10">
                        {ticket.comments.map((comment) => (
                            <div key={comment.id} className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{comment.author.name}</span>
                                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-slate-300">{comment.content}</div>
                            </div>
                        ))}
                    </div>
                    {/* Add Comment Form */}
                    <div className="p-6 bg-black/20">
                        <form action={async (formData) => {
                            "use server"
                            const content = formData.get("content") as string
                            if (!content) return
                            await addComment(ticket.id, content)
                        }}>
                            <textarea
                                name="content"
                                className="w-full rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Write a reply..."
                                rows={3}
                            />
                            <div className="mt-2 flex justify-end">
                                <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                                    Send Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Sidebar (Status/Meta) */}
            <div className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <h3 className="font-semibold text-white mb-4">Details</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-slate-400 block mb-1">Status</span>
                            <form action={async (formData) => {
                                "use server"
                                const status = formData.get("status") as any // 'OPEN' | ...
                                await updateTicketStatus(ticket.id, status)
                            }}>
                                <select
                                    name="status"
                                    defaultValue={ticket.status}
                                    onChange={(e) => {
                                        // This is a server component, onChange needs client.
                                        // We'll leave it simple for now and rely on a button or auto-submit logic if we made this client.
                                        // For pure server, needs a submit button.
                                        // Let's stick to a simpler approach: Client component wrapper or just show current status.
                                        // To enable editing, I'll allow selecting and hitting 'Update'.
                                    }}
                                    className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                                >
                                    <option value="OPEN" className="bg-slate-900">Open</option>
                                    <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
                                    <option value="RESOLVED" className="bg-slate-900">Resolved</option>
                                    <option value="CLOSED" className="bg-slate-900">Closed</option>
                                </select>
                                <button className="mt-2 w-full rounded bg-white/10 py-1 text-xs text-white hover:bg-white/20">
                                    Update Status
                                </button>
                            </form>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-400 block mb-1">Priority</span>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-white/10 ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-400 bg-red-400/10' :
                                    ticket.priority === 'MEDIUM' ? 'text-amber-400 bg-amber-400/10' :
                                        'text-emerald-400 bg-emerald-400/10'
                                }`}>
                                {ticket.priority}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-400 block mb-1">Assignee</span>
                            <div className="text-sm text-white">
                                {ticket.assignee ? ticket.assignee.name : "Unassigned"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicketDetail 
