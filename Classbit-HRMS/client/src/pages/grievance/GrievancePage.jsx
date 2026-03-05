import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AlertCircle, Plus, MessageSquare, CheckCircle, Clock, Search } from 'lucide-react';
import Modal from '../../components/Modal';

const GrievancePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        isAnonymous: false
    });

    const fetchGrievances = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = (user.role === 'Super Admin' || user.role === 'HR')
                ? 'http://localhost:5000/api/grievance/all'
                : 'http://localhost:5000/api/grievance/my';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGrievances(res.data);
        } catch (error) {
            console.error('Error fetching grievances:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, [user.role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/grievance', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddModalOpen(false);
            setFormData({ subject: '', description: '', isAnonymous: false });
            fetchGrievances();
        } catch (error) {
            alert('Failed to submit grievance');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">Grievance Redressal</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Raise concerns or feedback. We ensure a safe and supportive environment.</p>
                </div>
                {user.role === 'Employee' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Report Grievance
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Open Issues', count: grievances.filter(g => g.status === 'Open').length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { label: 'Under Review', count: grievances.filter(g => g.status === 'Processing').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Resolved', count: grievances.filter(g => g.status === 'Resolved').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-md flex items-center gap-6">
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stat.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-xl overflow-hidden transition-colors">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] italic">Recent Tickets</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full pl-10 pr-4 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                    </div>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                    {loading ? (
                        <div className="p-12 text-center text-[var(--text-secondary)] italic">Connecting to support server...</div>
                    ) : grievances.length === 0 ? (
                        <div className="p-12 text-center text-[var(--text-secondary)] italic text-sm">No grievances recorded. Your workplace is healthy!</div>
                    ) : (
                        grievances.map((g) => (
                            <div key={g.id} className="p-6 hover:bg-[var(--bg-secondary)]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[var(--text-primary)]">{g.subject}</h4>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${g.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                                                g.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {g.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 max-w-2xl leading-relaxed">{g.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(g.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-[10px] text-[var(--text-secondary)] font-bold italic">
                                            - {g.isAnonymous ? 'Anonymous' : (g.Employee ? `${g.Employee.firstName} ${g.Employee.lastName}` : 'Direct')}
                                        </span>
                                    </div>
                                </div>
                                <button className="self-end md:self-center bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-blue-400 hover:border-blue-400/50 transition-all">
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Grievance Report">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Subject</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                            placeholder="Brief title of the issue"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Detailed Description</label>
                        <textarea
                            required
                            rows="5"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                            placeholder="Explain the concern in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <input
                            type="checkbox"
                            id="anon"
                            className="w-4 h-4 accent-red-600"
                            checked={formData.isAnonymous}
                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        />
                        <label htmlFor="anon" className="text-xs text-red-500 font-bold cursor-pointer">Submit this grievance anonymously</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 text-[var(--text-secondary)] font-semibold">Cancel</button>
                        <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-2xl font-bold transition-all shadow-lg">
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GrievancePage;
