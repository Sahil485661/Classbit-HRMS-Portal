import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';

const getProgressColor = (progress, status) => {
    if (status === 'Lagging') return 'bg-red-500';
    if (status === 'At-Risk') return 'bg-yellow-500';
    if (progress === 100 || status === 'Completed') return 'bg-green-500';
    return 'bg-blue-500';
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'On-Track': return <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">On Track</span>;
        case 'At-Risk': return <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">At Risk</span>;
        case 'Lagging': return <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Lagging</span>;
        case 'Completed': return <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Done</span>;
        default: return null;
    }
};

const OKRList = ({ okrs = [], isEmployee = false, onAddOkr }) => {
    const defaultOkrs = okrs.length > 0 ? okrs : [
        { id: 1, title: 'Ship Performance Dashboard', progress: 85, status: 'On-Track', deadline: '2026-03-31' },
        { id: 2, title: 'Reduce Server Latency by 20%', progress: 40, status: 'At-Risk', deadline: '2026-04-15' },
        { id: 3, title: 'Complete AWS Certification', progress: 10, status: 'Lagging', deadline: '2026-03-25' },
        { id: 4, title: 'Lead Q1 Team Building', progress: 100, status: 'Completed', deadline: '2026-02-28' },
    ];

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Objectives & Key Results</h3>
                </div>
                {isEmployee && (
                    <button 
                        onClick={onAddOkr}
                        className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Add OKR"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {defaultOkrs.map((okr) => {
                    const progressColor = getProgressColor(okr.progress, okr.status);
                    const isUpcoming = new Date(okr.deadline) < new Date(new Date().setDate(new Date().getDate() + 7));

                    return (
                        <div key={okr.id} className="group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">{okr.title}</h4>
                                        {getStatusBadge(okr.status)}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-[var(--text-secondary)] font-medium">
                                        <span className={`flex items-center gap-1 ${isUpcoming && okr.status !== 'Completed' ? 'text-yellow-500' : ''}`}>
                                            <Clock className="w-3 h-3" />
                                            {new Date(okr.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[var(--text-primary)]">{okr.progress}%</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${progressColor} transition-all duration-1000 ease-out`} 
                                    style={{ width: `${okr.progress}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OKRList;
