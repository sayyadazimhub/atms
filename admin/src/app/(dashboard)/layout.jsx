import AdminSidebar from '@/components/AdminSidebar';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({ children }) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const decoded = await verifyUserToken(token);
    if (!decoded) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen overflow-hidden flex-col lg:flex-row force-light bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
