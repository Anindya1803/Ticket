'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createTicket } from "@/actions/ticket-actions"
import { useActionState } from "react"
import { useRouter } from "next/navigation"

const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})

type TicketValues = z.infer<typeof ticketSchema>

export default function NewTicketPage() {
    const router = useRouter()

    // We can use server actions directly or with useActionState for better progressive enhancement
    // For simplicity with react-hook-form, we'll wrap the action.

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            priority: "MEDIUM"
        }
    })

    async function onSubmit(data: TicketValues) {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("priority", data.priority)

        const result = await createTicket(null, formData)

        if (result.error) {
            alert(result.error)
        } else {
            router.push("/tickets")
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Create New Ticket</h1>
                <p className="mt-2 text-slate-400">Submit a new issue to the helpdesk.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Subject</label>
                        <input
                            {...register("title")}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Brief summary of the issue"
                        />
                        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Priority</label>
                        <select
                            {...register("priority")}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="LOW" className="bg-slate-900">Low</option>
                            <option value="MEDIUM" className="bg-slate-900">Medium</option>
                            <option value="HIGH" className="bg-slate-900">High</option>
                            <option value="URGENT" className="bg-slate-900">Urgent</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Description</label>
                        <textarea
                            {...register("description")}
                            className="flex min-h-[150px] w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Detailed description of the problem..."
                        />
                        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
