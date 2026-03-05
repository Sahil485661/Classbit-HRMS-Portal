import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, UserPlus, Search, Filter, Mail, Phone, Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';
import Modal from '../../components/Modal';

const RecruitmentPage = () => {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        department: '',
        type: 'Full-time',
        location: 'Remote',
        description: '',
        requirements: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [jobsRes, candRes] = await Promise.all([
                axios.get('http://localhost:5000/api/recruitment/jobs'),
                axios.get('http://localhost:5000/api/recruitment/candidates', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setJobs(jobsRes.data);
            setCandidates(candRes.data);
        } catch (error) {
            console.error('Error fetching recruitment data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/recruitment/jobs', newJob, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsJobModalOpen(false);
            setNewJob({ title: '', department: '', type: 'Full-time', location: 'Remote', description: '', requirements: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create job');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Recruitment Center</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage job openings and candidate pipeline.</p>
                </div>
                <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Post New Job
                </button>
            </div>

            <div className="flex border-b border-[var(--border-color)]">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'jobs' ? 'text-blue-500 border-blue-500' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}
                >
                    Open Positions
                </button>
                <button
                    onClick={() => setActiveTab('candidates')}
                    className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'candidates' ? 'text-blue-500 border-blue-500' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}
                >
                    Active Candidates
                </button>
            </div>

            {activeTab === 'jobs' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center italic text-[var(--text-secondary)]">Loading positions...</div>
                    ) : jobs.length === 0 ? (
                        <div className="col-span-full py-20 text-center italic text-[var(--text-secondary)]">No active job openings.</div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xl hover:border-blue-500/30 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-full uppercase tracking-tighter">Active</span>
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">{job.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">{job.department}</p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded-md font-bold uppercase">{job.type}</span>
                                    <span className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded-md font-bold uppercase">{job.location}</span>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-between items-center text-xs">
                                    <span className="text-[var(--text-secondary)] font-bold">Applied: 12</span>
                                    <button className="text-blue-500 hover:underline font-bold">View Openings</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)]/30 text-[var(--text-secondary)] text-[10px] uppercase tracking-widest">
                                <th className="px-6 py-4">Candidate</th>
                                <th className="px-6 py-4">Applied For</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Recruiter</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center italic text-[var(--text-secondary)]">Loading talent pool...</td></tr>
                            ) : candidates.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center italic text-[var(--text-secondary)]">No candidates found.</td></tr>
                            ) : (
                                candidates.map((cand) => (
                                    <tr key={cand.id} className="hover:bg-[var(--bg-secondary)]/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                                                    {cand.firstName[0]}{cand.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">{cand.firstName} {cand.lastName}</p>
                                                    <a href={`http://localhost:5000/${cand.resumeUrl}`} className="text-[10px] text-blue-500 hover:underline">Download CV</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium">
                                            {cand.Job?.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><Mail className="w-3 h-3" /> {cand.email}</span>
                                                <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><Phone className="w-3 h-3" /> {cand.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${cand.status === 'Hired' ? 'bg-green-500/10 text-green-500' :
                                                cand.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {cand.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] italic">Antigravity AI</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} title="Create New Job Posting">
                <form onSubmit={handleCreateJob} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Job Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Department</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={newJob.department}
                                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Employment Type</label>
                            <select
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={newJob.type}
                                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Location</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsJobModalOpen(false)} className="px-6 py-2.5 text-[var(--text-secondary)] font-semibold">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg">
                            Post Hiring
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RecruitmentPage;
