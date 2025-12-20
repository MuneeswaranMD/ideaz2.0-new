
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, FileText, PenTool, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const CRMLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/crm/dashboard' },
        { icon: <Receipt size={20} />, label: 'Financials', path: '/crm/billing' },
        { icon: <PenTool size={20} />, label: 'Blog Posts', path: '/crm/blog' },
        { icon: <FileText size={20} />, label: 'Proposals', path: '/crm/proposals' },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '#/crm';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <aside className="w-80 bg-zinc-950 border-r border-white/5 flex flex-col fixed h-full z-50">
                <div className="p-10">
                    <Link to="/crm/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">Averqon<span className="text-indigo-500">CRM</span></span>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${currentPath === item.path
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-10 space-y-4">
                    <button className="flex items-center gap-4 text-gray-500 hover:text-white transition-colors font-bold px-6 py-2">
                        <Settings size={20} /> Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 text-red-500 hover:text-red-400 transition-colors font-bold px-6 py-2"
                    >
                        <LogOut size={20} /> Terminal Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-80 bg-black min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default CRMLayout;
