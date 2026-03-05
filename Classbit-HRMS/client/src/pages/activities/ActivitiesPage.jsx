import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Shield, LogIn, UserCircle, Settings, AlertTriangle, Search, Clock } from 'lucide-react';

const ActivitiesPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        if (action.includes('CREATE') || action.includes('ADD')) return 'text-emerald-400';
        if (action.includes('DELETE') || action.includes('LOCK')) return 'text-rose-400';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'text-amber-400';
        return 'text-blue-400';
    };

    const getIcon = (action) => {
        if (action.includes('LOGIN')) return LogIn;
        if (action.includes('USER')) return UserCircle;
        if (action.includes('SETTING')) return Settings;
        if (action.includes('DELETE')) return AlertTriangle;
        return History;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">System Audit Trail</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Verifiable immutable logs of every core operation in the cluster.</p>
                </div>
                <div className="relative group">
                    <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search audit IDs..."
                        className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl pl-12 pr-6 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xl transition-all w-80"
                    />
                </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden transition-colors">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Live Security Feed</h3>
                    </div>
                    <button onClick={fetchLogs} className="text-xs font-bold text-blue-400 hover:underline">Force Refresh</button>
                </div>

                <div className="divide-y divide-[var(--border-color)]">
                    {loading ? (
                        <div className="p-12 text-center text-[var(--text-secondary)] italic">Polling database for recent hooks...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 text-center text-[var(--text-secondary)] italic">No recent activity detected.</div>
                    ) : (
                        logs.map((log) => {
                            const Icon = getIcon(log.action);
                            return (
                                <div key={log.id} className="p-6 hover:bg-[var(--bg-secondary)]/30 transition-all flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] ${getActionColor(log.action)} shadow-sm`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm tracking-tight">{log.action}</h4>
                                            <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed opacity-80">{log.description}</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <UserCircle className="w-3 h-3 text-blue-400" />
                                            </div>
                                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
                                                Triggered By: {log.User?.email || 'System Root'}
                                            </span>
                                            <span className="text-[10px] text-slate-500 ml-auto font-mono opacity-30">HEX_ID: {log.id.substring(0, 8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivitiesPage;
