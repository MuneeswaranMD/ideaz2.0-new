
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, FileText, Upload, Save, UserCircle, Briefcase, Mail, Phone, MapPin, Calendar, HeartPulse, Badge, Camera } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Cloudinary Configuration
const cld = new Cloudinary({ cloud: { cloudName: 'dxlmlhpfy' } });

interface UserProfile {
    email: string;
    displayName: string;
    department: string;
    role: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    jobTitle?: string;
    employeeId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    profileImageId?: string; // Cloudinary Public ID
    documents: { name: string; url: string; date: string }[];
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    setProfile({
                        email: auth.currentUser.email || '',
                        displayName: '',
                        department: '',
                        role: 'employee',
                        documents: []
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!auth.currentUser || !profile) return;
        setSaving(true);
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(docRef, {
                ...profile,
                email: auth.currentUser.email,
                role: profile.role || 'employee'
            }, { merge: true });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert('Error updating profile');
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const imageFile = e.target.files[0];
        setAvatarLoading(true);

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'ml_default'); // Using the user's existing preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dxlmlhpfy/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.secure_url) {
                setProfile(prev => prev ? { ...prev, profileImageId: data.public_id } : null);
                if (auth.currentUser && profile) {
                    const docRef = doc(db, 'users', auth.currentUser.uid);
                    await setDoc(docRef, { profileImageId: data.public_id }, { merge: true });
                }
            } else {
                console.error("Cloudinary Error:", data);
                const errorMessage = data.error?.message || "Unknown error";
                alert(`Upload failed: ${errorMessage}.\n\nCRITICAL: Your 'ml_default' preset is currently 'Signed'.\n\nPlease go to Cloudinary Settings > Upload > Upload Presets, finding 'ml_default', click Edit, and change 'Signing Mode' to 'Unsigned'. Save and try again.`);
            }
        } catch (err) {
            console.error("Upload Request Failed:", err);
            alert("Network error during upload.");
        }
        setAvatarLoading(false);
    };

    const handleUpload = async () => {
        // ... (existing document upload code remains same, omitted to keep focused on avatar changes, but I need to include it if I'm replacing the whole block or be careful with ranges)
        // Wait, the replacement range is limited. I'll just keep the existing handleUpload if I don't overwrite it.
        // Actually, I'll paste the whole file content to be safe or use multi-replace if I was clever.
        // I'll copy the existing logic for document upload below.
        if (!file || !auth.currentUser) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            const docRef = doc(db, 'users', auth.currentUser.uid);
            const newDoc = {
                name: file.name,
                url,
                date: new Date().toISOString()
            };

            await setDoc(docRef, {
                documents: arrayUnion(newDoc)
            }, { merge: true });

            setProfile(prev => prev ? { ...prev, documents: [...(prev.documents || []), newDoc] } : null);
            setFile(null);
            alert('Document uploaded successfully!');
        } catch (error) {
            console.error("Error uploading document: ", error);
            alert('Error uploading document');
        }
        setUploading(false);
    };

    // Helper to get helper image
    const getProfileImage = () => {
        if (profile?.profileImageId) {
            return cld.image(profile.profileImageId)
                .format('auto')
                .quality('auto')
                .resize(auto().gravity(autoGravity()).width(200).height(200));
        }
        return null;
    };

    if (loading) return <div className="text-white p-10">Loading profile...</div>;

    return (
        <div className="p-10 space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your personal information and documents.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Info Card */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 space-y-8">
                    <div className="flex items-center gap-6 mb-6">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-indigo-600/20 text-indigo-500 flex items-center justify-center overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                                {profile?.profileImageId ? (
                                    <AdvancedImage cldImg={getProfileImage()!} />
                                ) : (
                                    <UserCircle size={64} />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-500 transition-all">
                                <Camera size={14} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                            {avatarLoading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">Full Profile Details</h2>
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">{profile?.role}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section: Basic Identity */}
                        <div className="md:col-span-2 space-y-2">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Identity</h3>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="mt-2 relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={profile?.displayName || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, displayName: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Date of Birth</label>
                            <div className="mt-2 relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="date"
                                    value={profile?.dateOfBirth || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Section: Work Info */}
                        <div className="md:col-span-2 space-y-2 mt-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Professional Info</h3>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Department</label>
                            <div className="mt-2 relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={profile?.department || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, department: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Engineering"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Job Title</label>
                            <div className="mt-2 relative">
                                <Badge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={profile?.jobTitle || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, jobTitle: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Senior Developer"
                                />
                            </div>
                        </div>

                        {/* Section: Contact Info */}
                        <div className="md:col-span-2 space-y-2 mt-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Contact Details</h3>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
                            <div className="mt-2 relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                            <div className="mt-2 relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="tel"
                                    value={profile?.phone || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Address</label>
                            <div className="mt-2 relative">
                                <MapPin className="absolute left-4 top-4 text-gray-500" size={18} />
                                <textarea
                                    value={profile?.address || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[80px]"
                                    placeholder="1234 Main St, City, Country"
                                />
                            </div>
                        </div>

                        {/* Section: Emergency Contact */}
                        <div className="md:col-span-2 space-y-2 mt-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Emergency Contact</h3>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Contact Name</label>
                            <div className="mt-2 relative">
                                <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={profile?.emergencyContactName || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, emergencyContactName: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Contact Person"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Contact Phone</label>
                            <div className="mt-2 relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="tel"
                                    value={profile?.emergencyContactPhone || ''}
                                    onChange={(e) => setProfile(prev => prev ? { ...prev, emergencyContactPhone: e.target.value } : null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Emergency Phone"
                                />
                            </div>
                        </div>


                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving Profile...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>

                {/* Documents Card (Right Sidebar) */}
                <div className="lg:col-span-1 glass-card p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col h-fit">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-500 flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Documents</h2>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-dashed border-white/20 text-center hover:bg-white/10 transition-colors">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-2 text-gray-400"
                        >
                            <Upload size={32} className={file ? "text-purple-400" : "text-gray-500"} />
                            <span className="text-sm font-medium">{file ? file.name : 'Click to upload'}</span>
                        </label>
                        {file && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-6 rounded-lg transition-all w-full"
                            >
                                {uploading ? 'Uploading...' : 'Confirm'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Your Files</h3>
                        {profile?.documents && profile.documents.length > 0 ? (
                            profile.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText size={18} className="text-indigo-400 shrink-0" />
                                        <span className="text-sm text-gray-300 font-medium truncate">{doc.name}</span>
                                    </div>
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-400 hover:text-white font-bold hover:underline shrink-0 ml-2"
                                    >
                                        View
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-sm   pl-2">No documents uploaded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
