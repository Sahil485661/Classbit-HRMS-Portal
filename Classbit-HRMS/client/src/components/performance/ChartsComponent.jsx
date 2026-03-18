import React, { useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const ChartsComponent = ({ performanceData }) => {
    const [showRequired, setShowRequired] = useState(true);

    // Prompt 1: 6 axes for Skill Analysis
    const skillData = performanceData?.skills || [
        { subject: 'Technical Skills', Current: 90, Required: 85, fullMark: 100 },
        { subject: 'Communication', Current: 75, Required: 90, fullMark: 100 },
        { subject: 'Leadership', Current: 65, Required: 80, fullMark: 100 },
        { subject: 'Problem Solving', Current: 95, Required: 85, fullMark: 100 },
        { subject: 'Project Management', Current: 60, Required: 75, fullMark: 100 },
        { subject: 'Adaptability', Current: 85, Required: 70, fullMark: 100 },
    ];

    const historicalData = performanceData?.history || [
        { month: 'Jan', You: 3.5, Peers: 3.2 },
        { month: 'Feb', You: 3.8, Peers: 3.3 },
        { month: 'Mar', You: 4.0, Peers: 3.4 },
        { month: 'Apr', You: 3.9, Peers: 3.5 },
        { month: 'May', You: 4.5, Peers: 3.6 },
        { month: 'Jun', You: 4.8, Peers: 3.7 }
    ];

    const needsTraining = skillData.find(s => s.Current < s.Required - 10);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart: Skills */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Skill Analysis</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Current Proficiency vs Required for Senior Role</p>
                    </div>
                    <button 
                        onClick={() => setShowRequired(!showRequired)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${showRequired ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}
                    >
                        {showRequired ? 'Hide Required' : 'Show Required'}
                    </button>
                </div>
                
                <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                            <PolarGrid stroke="var(--border-color)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Current Proficiency" dataKey="Current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                            {showRequired && (
                                <Radar name="Required for Senior Role" dataKey="Required" stroke="#64748b" fill="#64748b" fillOpacity={0.2} strokeDasharray="3 3" />
                            )}
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {needsTraining && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-500">Skill Gap Detected</h4>
                            <p className="text-xs text-yellow-500/80 mt-1">
                                Your <span className="font-bold">{needsTraining.subject}</span> score is below the role requirement. We recommend taking the <span className="underline cursor-pointer hover:text-yellow-400">Advanced {needsTraining.subject} Module</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Line Chart: Historical Growth */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl flex flex-col">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Growth Trajectory</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Historical Performance vs. Department Peers</p>
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[0, 5]} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="You" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="Peers" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartsComponent;
