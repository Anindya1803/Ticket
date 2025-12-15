'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { TicketStatus, Priority } from "@prisma/client"

const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
})

export async function createTicket(prevState: any, formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const validatedFields = ticketSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { title, description, priority } = validatedFields.data

    try {
        await db.ticket.create({
            data: {
                title,
                description,
                priority,
                creatorId: session.user.id,
            },
        })

        revalidatePath("/tickets")
        return { success: true }
    } catch (error) {
        console.error("Failed to create ticket:", error)
        return { error: "Failed to create ticket" }
    }
}

export async function getTickets() {
    const session = await auth()
    if (!session?.user) return []

    const tickets = await db.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            creator: { select: { name: true, email: true } },
            assignee: { select: { name: true } },
        }
    })
    return tickets
}

export async function getTicketById(id: string) {
    const session = await auth()
    if (!session?.user) return null

    const ticket = await db.ticket.findUnique({
        where: { id },
        include: {
            creator: { select: { name: true, email: true, image: true } },
            assignee: { select: { name: true, email: true } },
            comments: {
                include: {
                    author: { select: { name: true, image: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    })
    return ticket
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    try {
        await db.ticket.update({
            where: { id: ticketId },
            data: { status }
        })
        revalidatePath(`/tickets/${ticketId}`)
        return { success: true }
    } catch (error) {
        return { error: "Failed to update status" }
    }
}

export async function addComment(ticketId: string, content: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await db.comment.create({
            data: {
                content,
                ticketId,
                authorId: session.user.id
            }
        })
        revalidatePath(`/tickets/${ticketId}`)
        return { success: true }
    } catch (error) {
        return { error: "Failed to add comment" }
    }
}
