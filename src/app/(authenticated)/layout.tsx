import { Sidebar } from "@/components/layout/sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-950 p-8 text-slate-100">
                {children}
            </main>
        </div>
    )
}
