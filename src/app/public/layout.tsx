export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Matrix Support</h1>
                <p className="text-slate-500">Quick Ticket Submission</p>
            </div>
            {children}
            <div className="mt-8 text-center text-sm text-slate-400">
                &copy; {new Date().getFullYear()} Matrix Ticketing System
            </div>
        </div>
    );
}
