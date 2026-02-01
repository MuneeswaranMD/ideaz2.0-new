
import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { Users, UserPlus, Shield, CheckSquare, Trash2, FileText, XCircle, Search } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'employee';
    displayName: string;
    department: string;
    designation: string; // Job Role
    permissions: string[];
    createdAt?: string;
    documents?: any[];
}

const ALL_PERMISSIONS = [
    { id: 'dashboard', label: 'Dashboard Access' },
    { id: 'timesheets', label: 'Timesheets' },
    { id: 'profile', label: 'Profile Management' },
    { id: 'billing', label: 'Financials / Billing' },
    { id: 'proposals', label: 'Proposals' },
    { id: 'blog', label: 'Blog Administration' },
    { id: 'quotations', label: 'AI Quotations' },
    { id: 'meetings', label: 'Meeting Access' },
    { id: 'tasks', label: 'Task Management' },
    { id: 'enquiries', label: 'Enquiry Management' },
    { id: 'learning', label: 'LMS / Learning Management' },
];

const EmployeeManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        email: '',
        role: 'employee',
        displayName: '',
        department: '',
        designation: 'Full Stack Developer',
        permissions: ['dashboard', 'timesheets', 'profile', 'tasks']
    });

    const JOB_ROLES = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Video Editor',
        'Graphic Designer',
        'Digital Marketer',
        'Human Resources',
        'Sales Executive',
        'Other'
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserProfile[];
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const handleSaveUser = async () => {
        try {
            if (selectedUser) {
                // Update existing
                const docRef = doc(db, 'users', selectedUser.id);
                await updateDoc(docRef, {
                    role: formData.role,
                    permissions: formData.permissions,
                    department: formData.department,
                    designation: formData.designation,
                    displayName: formData.displayName
                });
            } else {
                // Create new placeholder user
                // Using addDoc creates a random ID. The user will 'claim' this by email on signup.
                await addDoc(collection(db, 'users'), {
                    ...formData,
                    createdAt: new Date().toISOString(),
                    documents: []
                });
            }
            setShowModal(false);
            fetchUsers();
            resetForm();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Failed to save user configuration.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user profile?")) return;
        try {
            await deleteDoc(doc(db, 'users', userId));
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            role: 'employee',
            displayName: '',
            department: '',
            designation: 'Full Stack Developer',
            permissions: ['dashboard', 'timesheets', 'profile', 'tasks']
        });
        setSelectedUser(null);
    };

    const openEdit = (user: UserProfile) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            role: user.role,
            displayName: user.displayName,
            department: user.department,
            designation: user.designation || 'Full Stack Developer',
            permissions: user.permissions || []
        });
        setShowModal(true);
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => {
            const current = prev.permissions || [];
            if (current.includes(permId)) {
                return { ...prev, permissions: current.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...current, permId] };
            }
        });
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white p-10">Loading User Database...</div>;

    return (
        <div className="p-10 space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Employee Management</h1>
                    <p className="text-gray-400">Configure access, roles, and profiles.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
                >
                    <UserPlus size={20} /> Add Employee
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
            </div>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <div key={user.id} className="glass-card p-6 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                {user.role}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white truncate">{user.displayName || 'Unnamed User'}</h3>
                        <p className="text-sm text-indigo-400 font-bold mb-1">{user.designation || user.department || 'Employee'}</p>
                        <p className="text-xs text-gray-500 mb-4 truncate">{user.email}</p>

                        <div className="space-y-2 mb-6">
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Access Rights</div>
                            <div className="flex flex-wrap gap-2">
                                {user.permissions && user.permissions.slice(0, 4).map(perm => (
                                    <span key={perm} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                                        {perm}
                                    </span>
                                ))}
                                {user.permissions && user.permissions.length > 4 && (
                                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500">+{user.permissions.length - 4} more</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openEdit(user)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                            >
                                Manage Profile
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-white">{selectedUser ? 'Edit Employee' : 'New Employee'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                                <XCircle size={32} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        disabled={!!selectedUser}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none disabled:opacity-50"
                                        placeholder="employee@averqon.in"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                        placeholder="Engineering"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Job Designation</label>
                                    <select
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    >
                                        {JOB_ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Access Permissions</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ALL_PERMISSIONS.map(perm => (
                                        <div
                                            key={perm.id}
                                            onClick={() => togglePermission(perm.id)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.permissions?.includes(perm.id)
                                                ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.permissions?.includes(perm.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'
                                                }`}>
                                                {formData.permissions?.includes(perm.id) && <CheckSquare size={12} className="text-white" />}
                                            </div>
                                            <span className="font-bold text-sm">{perm.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedUser && selectedUser.documents && selectedUser.documents.length > 0 && (
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Employee Documents</h3>
                                    <div className="space-y-2">
                                        {selectedUser.documents.map((doc: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} className="text-indigo-400" />
                                                    <span className="text-sm text-gray-300">{doc.name}</span>
                                                </div>
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 font-bold hover:underline">View</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex justify-end gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
