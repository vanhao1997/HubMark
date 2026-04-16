import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="bg-white shadow border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-2xl font-bold text-gray-900 tracking-tight">
                                Hub<span className="text-blue-600">Mark</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-medium text-gray-700 bg-gray-100 py-1 px-3 rounded-full">{session.user?.name || session.user?.email}</span>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/api/auth/signout" className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Đăng xuất</a>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
