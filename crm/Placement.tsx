
import React, { useState, useEffect } from 'react';
import { getJobs, createJob, deleteJob, getApplications, Job, JobApplication } from '../services/placementService';
import { Briefcase, MapPin, DollarSign, Users, Plus, Trash2, ExternalLink } from 'lucide-react';

const Placement: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [view, setView] = useState<'jobs' | 'applications'>('jobs');
    const [showModal, setShowModal] = useState(false);

    // Form
    const [jobData, setJobData] = useState<Partial<Job>>({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        status: 'open'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const j = await getJobs();
        setJobs(j);
        const a = await getApplications();
        setApplications(a);
    };

    const handleSaveJob = async () => {
        if (!jobData.title || !jobData.company) return alert("Required fields missing");
        await createJob(jobData as Job);
        setShowModal(false);
        setJobData({ title: '', company: '', location: '', type: 'Full-time', description: '', status: 'open' });
        loadData();
    };

    const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this job post?")) {
            await deleteJob(id);
            loadData();
        }
    };

    return (
        <div className="p-10 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Placement Hub</h1>
                    <p className="text-gray-400">Manage job postings and student applications.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                >
                    <Plus size={20} /> Post New Job
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setView('jobs')}
                    className={`px-4 py-2 font-bold rounded-lg transition-all ${view === 'jobs' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Active Jobs
                </button>
                <button
                    onClick={() => setView('applications')}
                    className={`px-4 py-2 font-bold rounded-lg transition-all ${view === 'applications' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Applications ({applications.length})
                </button>
            </div>

            {view === 'jobs' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all group relative">
                            <button
                                onClick={(e) => handleDeleteJob(job.id!, e)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                                    <p className="text-sm font-medium text-indigo-400">{job.company}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-white/5 px-2 py-1 rounded text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                                <span className="bg-white/5 px-2 py-1 rounded text-xs text-gray-400 flex items-center gap-1"><Briefcase size={10} /> {job.type}</span>
                                {job.salary && <span className="bg-white/5 px-2 py-1 rounded text-xs text-green-400 flex items-center gap-1"><DollarSign size={10} /> {job.salary}</span>}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{job.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-wider">
                                <span>{job.status}</span>
                                <span>Posted recently</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-6">Applicant</th>
                                <th className="p-6">Job ID</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300 divide-y divide-white/5">
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td className="p-6 font-medium">
                                        <div className="text-white">{app.applicantName}</div>
                                        <div className="text-sm text-gray-500">{app.email}</div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-400">{app.jobId}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase">{app.status}</span>
                                    </td>
                                    <td className="p-6">
                                        {app.resumeUrl && <a href={app.resumeUrl} target="_blank" className="text-indigo-400 hover:text-white flex items-center gap-1 text-sm font-bold"><ExternalLink size={14} /> Resume</a>}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-500">No applications received yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Create Job Posting</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Job Title" value={jobData.title} onChange={e => setJobData({ ...jobData, title: e.target.value })} />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Company Name" value={jobData.company} onChange={e => setJobData({ ...jobData, company: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Location" value={jobData.location} onChange={e => setJobData({ ...jobData, location: e.target.value })} />
                                <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={jobData.type} onChange={e => setJobData({ ...jobData, type: e.target.value as any })}>
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Internship</option>
                                    <option>Contract</option>
                                </select>
                            </div>
                            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Salary Range (e.g. $50k - $80k)" value={jobData.salary} onChange={e => setJobData({ ...jobData, salary: e.target.value })} />
                            <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Job Description" value={jobData.description} onChange={e => setJobData({ ...jobData, description: e.target.value })} />

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold">Cancel</button>
                                <button onClick={handleSaveJob} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Post Job</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Placement;
