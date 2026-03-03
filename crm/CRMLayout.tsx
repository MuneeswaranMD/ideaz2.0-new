import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, FileText, PenTool, Settings, LogOut, ShieldCheck, Sparkles, Clock, User, Users, Lock, Menu, X, Video, Mail, CheckSquare, BookOpen, Briefcase, HelpCircle, CheckCircle, ExternalLink, MessageSquare, Monitor, CreditCard, Book, Zap } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const CRMLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [permissions, setPermissions] = useState<string[]>([]);
    const [role, setRole] = useState('employee');
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let unsubscribeUserDoc: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is authenticated, fetch permissions
                unsubscribeUserDoc = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setPermissions(data.permissions || []);
                        setRole(data.role || 'employee');
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching permissions:", error);
                    setLoading(false);
                });
            } else {
                // User is not authenticated
                if (unsubscribeUserDoc) {
                    unsubscribeUserDoc();
                    unsubscribeUserDoc = null;
                }
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, []);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/crm/dashboard', perm: 'dashboard' },
        { icon: <Clock size={20} />, label: 'Time Management', path: '/crm/timesheets', perm: 'timesheets' },
        { icon: <Users size={20} />, label: 'Employees', path: '/crm/employees', role: 'admin' },
        { icon: <User size={20} />, label: 'My Profile', path: '/crm/profile', perm: 'profile' },
        { icon: <Receipt size={20} />, label: 'Financials', path: '/crm/billing', perm: 'billing' },
        { icon: <FileText size={20} />, label: 'Proposals', path: '/crm/proposals', perm: 'proposals' },
        { icon: <PenTool size={20} />, label: 'Blog Posts', path: '/crm/blog', perm: 'blog' },
        { icon: <Mail size={20} />, label: 'Enquiries', path: '/crm/enquiries', perm: 'enquiries' },
        { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/crm/tasks', perm: 'tasks' },
        { icon: <Briefcase size={20} />, label: 'Projects', path: '/crm/projects', perm: 'projects' },
        { icon: <Video size={20} />, label: 'Meetings', path: '/crm/meetings', perm: 'meetings' },
        { icon: <BookOpen size={20} />, label: 'Learning (LMS)', path: '/crm/learning', perm: 'learning' },
        { icon: <Sparkles size={20} />, label: 'AI Quotations', path: '/crm/quotations', perm: 'quotations' },
    ];

    const zohoItems = [
        { icon: <Users size={20} />, label: 'Zoho CRM', path: 'https://crm.zoho.com/', desc: 'Manage deals and tasks' },
        { icon: <Mail size={20} />, label: 'Zoho Mail', path: 'https://mail.zoho.com/', desc: 'Access emails and files' },
        { icon: <CreditCard size={20} />, label: 'Zoho Books', path: 'https://books.zoho.com/', desc: 'Accounting & tracking' },
        { icon: <MessageSquare size={20} />, label: 'Zoho Cliq', path: 'https://cliq.zoho.com/', desc: 'Communicate & collaborate' },
        { icon: <Monitor size={20} />, label: 'Zoho Meeting', path: 'https://meeting.zoho.com/', desc: 'Host & join webinars' },
    ];

    const hasAccess = (item: any) => {
        if (role === 'admin') return true;
        if (item.role === 'admin' && role !== 'admin') return false;
        if (item.perm) return permissions.includes(item.perm);
        return true; // Default allow if no restrictions defined
    };

    const visibleItems = menuItems.filter(item => hasAccess(item));

    // Access Check for Current Path
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    const isAccessGranted = currentMenuItem ? hasAccess(currentMenuItem) : true; // Allow explicit paths not in menu? Or strict? 

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '#/crm';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading access rights...</div>;
    }

    return (
        <div className="flex min-h-screen bg-black">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-white/5 flex items-center justify-between px-4 z-40">
                <Link to="/crm/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <ShieldCheck className="text-white" size={18} />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">Averqon<span className="text-indigo-500">CRM</span></span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-80 bg-zinc-950 border-r border-white/5 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="p-10 hidden md:block">
                    <Link to="/crm/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">Averqon<span className="text-indigo-500">CRM</span></span>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-8 overflow-y-auto scrollbar-hide">
                    <div>
                        <div className="px-6 mb-4">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Management</span>
                        </div>
                        <div className="space-y-1">
                            {visibleItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-3 rounded-2xl transition-all font-bold ${currentPath === item.path
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="px-6 mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Automation</span>
                            <Zap size={12} className="text-amber-500" />
                        </div>
                        <div className="space-y-1">
                            <Link
                                to="/crm/automation"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-6 py-3 rounded-2xl transition-all font-bold ${currentPath === '/crm/automation'
                                    ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5 group'
                                    }`}
                            >
                                <div className={`${currentPath === '/crm/automation' ? 'text-black' : 'text-gray-500 group-hover:text-amber-400'} transition-colors`}>
                                    <Zap size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm">n8n Workflows</span>
                                    <span className={`text-[9px] font-medium ${currentPath === '/crm/automation' ? 'text-black/60' : 'text-gray-600 group-hover:text-gray-400'} leading-tight`}>Integrated Automation</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="px-6 mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Zoho Workspace</span>
                            <ExternalLink size={12} className="text-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            {zohoItems.map((item) => (
                                <a
                                    key={item.path}
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 px-6 py-3 rounded-2xl transition-all font-bold text-gray-500 hover:text-white hover:bg-white/5 group"
                                >
                                    <div className="text-gray-500 group-hover:text-indigo-400 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{item.label}</span>
                                        <span className="text-[9px] font-medium text-gray-600 group-hover:text-gray-400 leading-tight">{item.desc}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
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
            <main className="flex-grow md:ml-80 bg-black min-h-screen overflow-y-auto w-full pt-16 md:pt-0">
                {isAccessGranted ? children : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <Lock size={48} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Access Restricted</h1>
                            <p className="text-gray-400 max-w-md mx-auto">
                                You do not have permission to view this section. Please contact your administrator if you believe this is an error.
                            </p>
                        </div>
                        <Link to="/crm/dashboard" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
                            Return to Dashboard
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CRMLayout;
