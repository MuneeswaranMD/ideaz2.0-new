import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Lock, Mail, ArrowRight, ShieldCheck, Github, User, UserCog } from 'lucide-react';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'admin' | 'employee'>('employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let user: any;
            if (isLogin) {
                const credential = await signInWithEmailAndPassword(auth, email, password);
                user = credential.user;
            } else {
                const credential = await createUserWithEmailAndPassword(auth, email, password);
                user = credential.user;

                // Check if a profile already exists for this email (pre-created by Admin)
                const q = query(collection(db, 'users'), where('email', '==', user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Profile exists, link Auth UID to this profile
                    const placeholderDoc = querySnapshot.docs.find(d => d.id !== user.uid) || querySnapshot.docs[0];
                    if (placeholderDoc && placeholderDoc.id !== user.uid) {
                        await setDoc(doc(db, 'users', user.uid), {
                            ...placeholderDoc.data(),
                            uid: user.uid,
                            lastLogin: new Date().toISOString()
                        }, { merge: true });
                        await deleteDoc(placeholderDoc.ref);
                    }
                } else {
                    // Create new fresh user document with SELECTED ROLE
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        createdAt: new Date().toISOString(),
                        role: selectedRole, // Use user selection
                        displayName: '',
                        department: '',
                        documents: [],
                        // Grant permissions based on selected role
                        permissions: selectedRole === 'admin'
                            ? ['dashboard', 'timesheets', 'profile', 'billing', 'proposals', 'blog', 'quotations', 'admin']
                            : ['dashboard', 'profile', 'timesheets']
                    });
                }
            }

            // *** ADMIN OVERRIDE ***
            if (user && user.email === 'munees@averqon.in') {
                await setDoc(doc(db, 'users', user.uid), {
                    role: 'admin',
                    permissions: ['dashboard', 'timesheets', 'profile', 'billing', 'proposals', 'blog', 'quotations', 'admin']
                }, { merge: true });
            }

            window.location.href = '#/crm/dashboard';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-indigo-600/20 text-indigo-500 mb-6">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Averqon CRM</h1>
                    <p className="text-gray-400">Secure access to your business control panel.</p>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white/5">
                    {/* Role Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2 mb-8 bg-white/5 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('employee')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${selectedRole === 'employee'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <User size={16} /> Employee
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('admin')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${selectedRole === 'admin'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <UserCog size={16} /> Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Email Base</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-white"
                                    placeholder={selectedRole === 'admin' ? "admin@averqon.in" : "employee@averqon.in"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Coded Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center group ${selectedRole === 'admin'
                                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                                }`}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Initialize Dashboard' : `Create ${selectedRole === 'admin' ? 'Admin' : 'Employee'} Account`)}
                            {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-gray-400 hover:text-white transition-colors font-semibold"
                        >
                            {isLogin ? "System expansion needed? Request account" : "Existing user? Return to base"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8 uppercase tracking-[0.3em] font-bold">
                    Encrypted & Powered by Firebase
                </p>
            </div>
        </div>
    );
};

export default Auth;
